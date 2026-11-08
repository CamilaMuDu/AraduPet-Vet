<?php

class ServicioModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    /**
     * Obtener todos los servicios activos
     */
    public function getAll()
    {
        try {
            $sql = "SELECT id_servicio, nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado 
                    FROM servicio 
                    WHERE estado = 1";

            // Usamos el método nativo del profe para SELECT
            $result = $this->db->executeSQL($sql);
            return $result;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Obtener un servicio por su ID
     */
    public function getById($id)
    {
        try {
            $idSeguro = intval($id);
            $sql = "SELECT id_servicio, nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado 
                    FROM servicio 
                    WHERE id_servicio = {$idSeguro} AND estado = 1";

            $result = $this->db->executeSQL($sql);
            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Crear un nuevo servicio
     */
    public function create($data)
    {
        try {
            // Sanitizamos las entradas para prevenir inyecciones SQL con mysqli
            $nombre = $this->db->escapeString($data->nombre);
            $descripcion = $this->db->escapeString($data->descripcion ?? '');
            $precio = floatval($data->precio);
            $duracion = intval($data->duracion_minutos);
            $ayuno = isset($data->requiere_ayuno) ? intval($data->requiere_ayuno) : 0;
            $cita = isset($data->requiere_cita_previa) ? intval($data->requiere_cita_previa) : 1;

            $sql = "INSERT INTO servicio (nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado) 
                    VALUES ('{$nombre}', '{$descripcion}', {$precio}, {$duracion}, {$ayuno}, {$cita}, 1)";

            // Usamos el método nativo del profe para INSERT que devuelve el ID
            return $this->db->executeSQL_DML_last($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Actualizar un servicio existente
     */
    public function update($id, $data)
    {
        try {
            $idSeguro = intval($id);
            $nombre = $this->db->escapeString($data->nombre);
            $descripcion = $this->db->escapeString($data->descripcion ?? '');
            $precio = floatval($data->precio);
            $duracion = intval($data->duracion_minutos);
            $ayuno = isset($data->requiere_ayuno) ? intval($data->requiere_ayuno) : 0;
            $cita = isset($data->requiere_cita_previa) ? intval($data->requiere_cita_previa) : 1;

            $sql = "UPDATE servicio 
                    SET nombre = '{$nombre}', 
                        descripcion = '{$descripcion}', 
                        precio = {$precio}, 
                        duracion_minutos = {$duracion}, 
                        requiere_ayuno = {$ayuno}, 
                        requiere_cita_previa = {$cita} 
                    WHERE id_servicio = {$idSeguro}";

            // Usamos el método nativo del profe para UPDATE/DELETE
            return $this->db->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Eliminar (desactivar) un servicio (Borrado lógico)
     */
    public function delete($id)
    {
        try {
            $idSeguro = intval($id);
            $sql = "UPDATE servicio SET estado = 0 WHERE id_servicio = {$idSeguro}";

            return $this->db->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}