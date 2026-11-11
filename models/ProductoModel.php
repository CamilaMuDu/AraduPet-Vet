<?php

class ProductoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    //getAll
    public function all()
    {
        try {         
            $vSql = "SELECT
                        p.id_producto,
                        p.nombre,
                        p.precio,
                        p.stock,
                        p.marca,
                        p.presentacion,
                        p.imagen_url,
                        p.id_categoria,
                        c.nombre AS categoria
                    FROM producto p
                    INNER JOIN categoria_producto c
                        ON p.id_categoria = c.id_categoria
                    WHERE p.estado = 1
                    ORDER BY p.nombre ASC";

            $vResultado = $this->enlace->executeSQL($vSql);

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //getById
    public function get($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del producto no es válido"
                );
            }

            $vsql = "SELECT
                        p.id_producto,
                        p.id_categoria,
                        p.nombre,
                        p.descripcion,
                        p.imagen_url,
                        p.precio,
                        p.stock,
                        p.marca,
                        p.presentacion,
                        p.estado,
                        c.nombre AS categoria,
                        c.descripcion AS descripcion_categoria
                    FROM producto p
                    INNER JOIN categoria_producto c
                        ON p.id_categoria = c.id_categoria
                    WHERE p.id_producto = $id";

            $vResultado = $this->enlace->executeSQL($vsql);

            if (!empty($vResultado)) {
                return $vResultado[0];
            }

            return null;

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //lista categoría producto
    public function getCategorias()
    {
        try {
            $vSql = "SELECT 
                        id_categoria,
                        nombre,
                        descripcion
                    FROM categoria_producto
                    ORDER BY nombre ASC";

            $vResultado = $this->enlace->executeSQL($vSql);

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

   
    // Crear producto
    public function create($data, $imagen = null)
    {
        try {
            $nombre = trim($data['nombre'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $idCategoria = filter_var(
                $data['id_categoria'] ?? null,
                FILTER_VALIDATE_INT
            );
            $precioTexto = $data['precio'] ?? '';
            $stockTexto = $data['stock'] ?? 0;
            $marca = trim($data['marca'] ?? '');
            $presentacion = trim($data['presentacion'] ?? '');
            $imagenUrl = $this->subirImagen($imagen);

            $this->validarDatos(
                $nombre,
                $descripcion,
                $idCategoria,
                $precioTexto,
                $stockTexto,
                $marca,
                $presentacion,
                $imagenUrl ?? ''
            );

            $nombreSQL = $this->escapar($nombre);
            $descripcionSQL = $this->escapar($descripcion);
            $marcaSQL = $this->escapar($marca);
            $presentacionSQL = $this->escapar($presentacion);

            $precio = number_format((float)$precioTexto, 2, '.', '');
            $stock = (int)$stockTexto;
            $imagenSQL = $imagenUrl === null
                ? 'NULL'
                : "'" . $this->escapar($imagenUrl) . "'";

            $vsql = "INSERT INTO producto (
                        id_categoria,
                        nombre,
                        descripcion,
                        imagen_url,
                        precio,
                        stock,
                        marca,
                        presentacion,
                        estado
                    ) VALUES (
                        $idCategoria,
                        '$nombreSQL',
                        '$descripcionSQL',
                        $imagenSQL,
                        $precio,
                        $stock,
                        " . ($marca === '' ? 'NULL' : "'$marcaSQL'") . ",
                        " . ($presentacion === '' ? 'NULL' : "'$presentacionSQL'") . ",
                        1
                    )";

            $vResultado = $this->enlace->executeSQL_DML_last($vsql);

            return [
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'data' => $vResultado
            ];

        } catch (Exception $e) {
            handleException($e);

            return [
                'success' => false,
                'message' => 'Error al crear el producto'
            ];
        }
    }


    // Modificar producto
    public function update($id, $data, $imagen = null)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del producto no es válido"
                );
            }

            $actual = $this->get($id);

            if (!$actual) {
                throw new InvalidArgumentException(
                    "El producto con ID $id no existe"
                );
            }

            $nombre = trim($data['nombre'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $idCategoria = filter_var(
                $data['id_categoria'] ?? null,
                FILTER_VALIDATE_INT
            );
            $precioTexto = $data['precio'] ?? '';
            $stockTexto = $data['stock'] ?? 0;
            $marca = trim($data['marca'] ?? '');
            $presentacion = trim($data['presentacion'] ?? '');

            $imagenNueva = $this->subirImagen($imagen);
            $imagenUrl = $imagenNueva ?? ($actual->imagen_url ?? '');

            $this->validarDatos(
                $nombre,
                $descripcion,
                $idCategoria,
                $precioTexto,
                $stockTexto,
                $marca,
                $presentacion,
                $imagenUrl
            );

            $nombreSQL = $this->escapar($nombre);
            $descripcionSQL = $this->escapar($descripcion);
            $marcaSQL = $this->escapar($marca);
            $presentacionSQL = $this->escapar($presentacion);

            $imagenSQL = $imagenUrl === ''
                ? 'NULL'
                : "'" . $this->escapar($imagenUrl) . "'";

            $precio = number_format((float)$precioTexto, 2, '.', '');
            $stock = (int)$stockTexto;

            $vsql = "UPDATE producto SET
                        id_categoria = $idCategoria,
                        nombre = '$nombreSQL',
                        descripcion = '$descripcionSQL',
                        imagen_url = $imagenSQL,
                        precio = $precio,
                        stock = $stock,
                        marca = " . ($marca === '' ? 'NULL' : "'$marcaSQL'") . ",
                        presentacion = " . ($presentacion === '' ? 'NULL' : "'$presentacionSQL'") . "
                    WHERE id_producto = $id";

            $vResultado = $this->enlace->executeSQL_DML($vsql);

            return [
                'success' => true,
                'message' => 'Producto actualizado correctamente',
                'data' => $vResultado
            ];

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Borrado lógico de producto
    public function delete($id)
    {
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if ($id === false || $id <= 0) {
            throw new InvalidArgumentException(
                "El ID del producto no es válido."
            );
        }

        $producto = $this->get($id);

        if (!$producto) {
            throw new Exception(
                "El producto no existe o ya fue eliminado."
            );
        }

        $sql = "UPDATE producto
                SET estado = 0
                WHERE id_producto = " . (int)$id . "
                AND estado = 1";

        $this->enlace->executeSQL_DML($sql);

        return [
            "success" => true,
            "id_producto" => $id,
            "mensaje" => "Producto eliminado correctamente."
        ];
    }


    // guardar imagen de un producto registrado
    public function guardarImagen($id, $imagen)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException("El ID del producto no es válido.");
            }

            $producto = $this->get($id);

            if (!$producto) {
                throw new InvalidArgumentException("El producto no existe.");
            }

            if ($imagen === null || $imagen['error'] === UPLOAD_ERR_NO_FILE) {
                throw new InvalidArgumentException("La imagen del producto es obligatoria.");
            }

            $imagenUrl = $this->subirImagen($imagen);

            if (!$imagenUrl) {
                throw new Exception("No se pudo guardar la imagen.");
            }

            $imagenSQL = $this->escapar($imagenUrl);

            $sql = "UPDATE producto
                    SET imagen_url = '$imagenSQL'
                    WHERE id_producto = $id";

            $this->enlace->executeSQL_DML($sql);

            return [
                'success' => true,
                'message' => 'Imagen del producto guardada correctamente',
                'data' => $imagenUrl
            ];

        } catch (Exception $e) {
            handleException($e);

            return [
                'success' => false,
                'message' => 'Error al guardar la imagen del producto'
            ];
        }
    }


    //validar datos
    private function validarDatos($nombre, $descripcion, $idCategoria, $precioTexto, $stockTexto, $marca, $presentacion, $imagenUrl) 
    {
        if($nombre === '' || strlen($nombre) > 100) {
            throw new InvalidArgumentException(
                "El nombre del producto es obligatorio"
            );
        }

        if($descripcion === '') {
            throw new InvalidArgumentException(
                "La descripción del producto es obligatoria"
            );
        }

        if($idCategoria === false || $idCategoria <= 0) {
            throw new InvalidArgumentException(
                "La categoría del producto no es válida"
            );
        }

        if(!is_numeric($precioTexto) || !is_finite((float)$precioTexto) || (float)$precioTexto < 0 || strlen ((string)$precioTexto) > 30) {
            throw new InvalidArgumentException(
                "El precio del producto es obligatorio"
            );
        }

        if (!preg_match('/^\d+$/', (string)$stockTexto) ||
            (float)$stockTexto > 2147483647) {
            throw new InvalidArgumentException(
                "El stock es obligatorio"
            );
        }

        if (strlen($marca) > 50) {
            throw new InvalidArgumentException(
                "La marca del producto es obligayoria"
            );
        }

        if (strlen($presentacion) > 50) {
            throw new InvalidArgumentException(
                "La presentación es obligatoria"
            );
        }

        if (strlen($imagenUrl) > 255) {
            throw new InvalidArgumentException(
                "La ruta de imagen es obligatoria"
            );
        }

        $categorias = $this->getCategorias();
        $existe = false;

        foreach ($categorias as $categoria) {
            if ((int)$categoria->id_categoria === (int)$idCategoria) {
                $existe = true;
                break;
            }
        }

        if (!$existe) {
            throw new InvalidArgumentException(
                "La categoría seleccionada no existe"
            );
        }
    }

    private function subirImagen($imagen)
    {
        if ($imagen === null || $imagen['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }

        if ($imagen['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Ocurrió un error al subir la imagen.");
        }

        if ($imagen['size'] > 5 * 1024 * 1024) {
            throw new InvalidArgumentException(
                "La imagen es muy grande."
            );
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $tipo = $finfo->file($imagen['tmp_name']);

        $extensiones = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp'
        ];

        if (!isset($extensiones[$tipo])) {
            throw new InvalidArgumentException(
                "El formato de imagen no es válido."
            );
        }

        $carpeta = dirname(__DIR__) . '/public/images/productos/';
        
        if (!is_dir($carpeta)) {
            if (!mkdir($carpeta, 0755, true)) {
                throw new Exception("No se pudo crear la carpeta de imágenes.");
            }
        }

        $nombreArchivo = bin2hex(random_bytes(16))
            . '.' . $extensiones[$tipo];

        $rutaDestino = $carpeta . $nombreArchivo;

        if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
            throw new Exception("No se pudo guardar la imagen.");
        }

        return 'public/images/productos/' . $nombreArchivo;
    }



    private function escapar($valor) 
    {
        return $this->enlace->escapeString($valor);
    }
}
