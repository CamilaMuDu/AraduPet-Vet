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

    //crear producto 
    public function create($data) 
    {
        try {
            $nombre = trim($data['nombre'] ?? '' );
            $descripcion = trim($data['descripcion'] ?? '' );
            $idCategoria = filter_var($data['id_categoria'] ?? null, FILTER_VALIDATE_INT);
            $precioTexto = $data['precio'] ?? '';
            $stockTexto = $data['stock'] ?? 0;
            $marca = trim($data['marca'] ?? '' );
            $presentacion = trim($data['presentacion'] ?? '' );
            $imagenUrl = trim($data['imagen_url'] ?? '' );

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
            $imagenSQL = $imagenUrl === '' ? 'NULL' : "'" . $this->escapar($imagenUrl) . "'";
            $precio = number_format(floatval($precioTexto), 2, '.', '');
            $stock =(int)$stockTexto;

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

    //Modificar producto 
    public function update($id, $data) 
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if
            ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del producto no es válido"
                );
            }

            $actual = $this->get($id);

            if(!$actual) {
                throw new InvalidArgumentException(
                    "El producto con ID $id no existe"
                );
            }

            $nombre = trim($data['nombre'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $idCategoria = filter_var($data['id_categoria'] ?? null, FILTER_VALIDATE_INT);
            $precioTexto = $data['precio'] ?? '';
            $stockTexto = $data['stock'] ?? 0;
            $marca = trim($data['marca'] ?? '');
            $presentacion = trim($data['presentacion'] ?? '');
            $imagenUrl = trim($data['imagen_url'] ?? '');

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
            $imagenSQL = $imagenUrl === '' ? 'NULL' : "'" . $this->escapar($imagenUrl) . "'";
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

    //validar datos
    private function validarDatos($nombre, $descripcion, $idCategoria, $precioTexto, $stockTexto, $marca, $presentacion, $imagenUrl) 
    {
        if($nombre === '' || strlen($nombre) > 100) {
            throw new InvalidArgumentException(
                "El nombre del producto es obligatorio y no debe exceder los 100 caracteres"
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
                "El precio del producto debe ser un número válido y no puede ser negativo"
            );
        }

        if (!preg_match('/^\d+$/', (string)$stockTexto) ||
            (float)$stockTexto > 2147483647) {
            throw new InvalidArgumentException(
                "El stock debe ser un entero mayor o igual a cero"
            );
        }

        if (strlen($marca) > 50) {
            throw new InvalidArgumentException(
                "La marca admite máximo 50 caracteres"
            );
        }

        if (strlen($presentacion) > 50) {
            throw new InvalidArgumentException(
                "La presentación admite máximo 50 caracteres"
            );
        }

        if (strlen($imagenUrl) > 255) {
            throw new InvalidArgumentException(
                "La URL de imagen admite máximo 255 caracteres"
            );
        }

        if ($imagenUrl !== '' &&
            filter_var($imagenUrl, FILTER_VALIDATE_URL) === false) {
            throw new InvalidArgumentException(
                "La URL de imagen no es válida"
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

    private function escapar($valor) 
    {
        return $this->enlace->escapeString($valor);
    }
}
