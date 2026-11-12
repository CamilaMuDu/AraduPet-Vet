
<?php

class ServicioModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    // Obtener todos los servicios activos
    public function getAll()
    {
        try {
            $sql = "SELECT id_servicio, nombre, descripcion,
                           imagen_url, precio, duracion_minutos,
                           requiere_ayuno, requiere_cita_previa, estado
                    FROM servicio
                    WHERE estado = 1";

            return $this->db->executeSQL($sql);

        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // Obtener un servicio por ID
    public function getById($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del servicio no es válido."
                );
            }

            $sql = "SELECT id_servicio, nombre, descripcion,
                           imagen_url, precio, duracion_minutos,
                           requiere_ayuno, requiere_cita_previa, estado
                    FROM servicio
                    WHERE id_servicio = $id AND estado = 1";

            $resultado = $this->db->executeSQL($sql);

            return !empty($resultado) ? $resultado[0] : null;

        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // Crear servicio con imagen
    public function create($data, $imagen = null)
    {
        $imagenUrl = null;

        try {
            $nombre = trim($data['nombre'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $precioTexto = $data['precio'] ?? '';
            $duracionTexto = $data['duracion_minutos'] ?? '';
            $ayuno = (int)($data['requiere_ayuno'] ?? 0);
            $cita = (int)($data['requiere_cita_previa'] ?? 1);

            $this->validarDatos(
                $nombre, $descripcion, $precioTexto,
                $duracionTexto, $ayuno, $cita
            );

            $imagenUrl = $this->subirImagen($imagen);

            $nombreSQL = $this->db->escapeString($nombre);
            $descripcionSQL = $this->db->escapeString($descripcion);

            $imagenSQL = $imagenUrl === null
                ? 'NULL'
                : "'" . $this->db->escapeString($imagenUrl) . "'";

            $precio = number_format((float)$precioTexto, 2, '.', '');
            $duracion = (int)$duracionTexto;

            $sql = "INSERT INTO servicio
                    (nombre, descripcion, imagen_url, precio,
                     duracion_minutos, requiere_ayuno,
                     requiere_cita_previa, estado)
                    VALUES
                    ('$nombreSQL', '$descripcionSQL', $imagenSQL,
                     $precio, $duracion, $ayuno, $cita, 1)";

            $resultado = $this->db->executeSQL_DML_last($sql);

            if (!$resultado) {
                throw new Exception("No se pudo registrar el servicio.");
            }

            return $resultado;

        } catch (Exception $e) {
            // Evitar dejar una imagen sin servicio asociado
            if ($imagenUrl !== null) {
                $this->eliminarArchivo($imagenUrl);
            }

            handleException($e);
            return false;
        }
    }

    // Actualizar servicio con imagen
    public function update($id, $data, $imagen = null)
    {
        $imagenNueva = null;

        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del servicio no es válido."
                );
            }

            $actual = $this->getById($id);

            if (!$actual) {
                throw new InvalidArgumentException(
                    "El servicio no existe o está inactivo."
                );
            }

            $nombre = trim($data['nombre'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $precioTexto = $data['precio'] ?? '';
            $duracionTexto = $data['duracion_minutos'] ?? '';
            $ayuno = (int)($data['requiere_ayuno'] ?? 0);
            $cita = (int)($data['requiere_cita_previa'] ?? 1);

            $this->validarDatos(
                $nombre, $descripcion, $precioTexto,
                $duracionTexto, $ayuno, $cita
            );

            $imagenNueva = $this->subirImagen($imagen);

            // Conservar la imagen anterior si no hay una nueva
            $imagenUrl = $imagenNueva
                ?? ($actual->imagen_url ?? null);

            $nombreSQL = $this->db->escapeString($nombre);
            $descripcionSQL = $this->db->escapeString($descripcion);

            $imagenSQL = empty($imagenUrl)
                ? 'NULL'
                : "'" . $this->db->escapeString($imagenUrl) . "'";

            $precio = number_format((float)$precioTexto, 2, '.', '');
            $duracion = (int)$duracionTexto;

            $sql = "UPDATE servicio SET
                        nombre = '$nombreSQL',
                        descripcion = '$descripcionSQL',
                        imagen_url = $imagenSQL,
                        precio = $precio,
                        duracion_minutos = $duracion,
                        requiere_ayuno = $ayuno,
                        requiere_cita_previa = $cita
                    WHERE id_servicio = $id AND estado = 1";

            $resultado = $this->db->executeSQL_DML($sql);

            if ($resultado === false) {
                throw new Exception("No se pudo actualizar el servicio.");
            }

            return true;

        } catch (Exception $e) {
            if ($imagenNueva !== null) {
                $this->eliminarArchivo($imagenNueva);
            }

            handleException($e);
            return false;
        }
    }

    // Eliminación lógica del servicio
    public function delete($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del servicio no es válido."
                );
            }

            $sql = "UPDATE servicio
                    SET estado = 0
                    WHERE id_servicio = $id AND estado = 1";

            return $this->db->executeSQL_DML($sql);

        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // Validar información del servicio
    private function validarDatos(
        $nombre, $descripcion, $precio,
        $duracion, $ayuno, $cita
    ) {
        if ($nombre === '' || mb_strlen($nombre) > 100) {
            throw new InvalidArgumentException(
                "El nombre es obligatorio y debe tener máximo 100 caracteres."
            );
        }

        if (mb_strlen($descripcion) > 100) {
            throw new InvalidArgumentException(
                "La descripción debe tener máximo 100 caracteres."
            );
        }

        if (!is_numeric($precio) ||
            !is_finite((float)$precio) ||
            (float)$precio < 0 ||
            (float)$precio > 99999999.99) {
            throw new InvalidArgumentException(
                "El precio del servicio no es válido."
            );
        }

        if (!preg_match('/^[1-9]\d*$/', (string)$duracion) ||
            (float)$duracion > 2147483647) {
            throw new InvalidArgumentException(
                "La duración debe ser un número entero positivo."
            );
        }

        if (!in_array($ayuno, [0, 1], true) ||
            !in_array($cita, [0, 1], true)) {
            throw new InvalidArgumentException(
                "Los valores de ayuno y cita previa no son válidos."
            );
        }
    }

    // Subir imagen del servicio
    private function subirImagen($imagen)
    {
        if ($imagen === null ||
            ($imagen['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }

        if ($imagen['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Ocurrió un error al subir la imagen.");
        }

        if ($imagen['size'] > 5 * 1024 * 1024) {
            throw new InvalidArgumentException(
                "La imagen no puede superar los 5 MB."
            );
        }

        if (!is_uploaded_file($imagen['tmp_name'])) {
            throw new InvalidArgumentException(
                "El archivo recibido no es válido."
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
                "Solo se permiten imágenes JPG, PNG o WebP."
            );
        }

        $carpeta = dirname(__DIR__) . '/public/images/servicios/';

        if (!is_dir($carpeta)) {
            if (!mkdir($carpeta, 0775, true)) {
                throw new Exception(
                    "No se pudo crear la carpeta de imágenes."
                );
            }
        }

        if (!is_writable($carpeta)) {
            throw new Exception(
                "La carpeta de imágenes no tiene permisos de escritura."
            );
        }

        $nombreArchivo = bin2hex(random_bytes(16))
            . '.' . $extensiones[$tipo];

        $rutaDestino = $carpeta . $nombreArchivo;

        if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
            throw new Exception(
                "No se pudo guardar la imagen del servicio."
            );
        }

        return 'public/images/servicios/' . $nombreArchivo;
    }

    // Eliminar archivo nuevo si falla el registro o actualización
    private function eliminarArchivo($ruta)
    {
        $prefijo = 'public/images/servicios/';

        if (!str_starts_with($ruta, $prefijo)) {
            return;
        }

        $archivo = dirname(__DIR__) . '/' . $ruta;

        if (is_file($archivo)) {
            unlink($archivo);
        }
    }
}
