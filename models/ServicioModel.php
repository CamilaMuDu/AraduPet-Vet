<?php

class ServicioModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    
    public function getAll()
    {
        try {
            $sql = "SELECT id_servicio, nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado 
                    FROM servicio 
                    WHERE estado = 1";

            $result = $this->db->executeSelect($sql);
            return $result;
        } catch (Exception $e) {
            HandleException::logException($e);
            return false;
        }
    }

    public function getById($id)
    {
        try {
            $sql = "SELECT id_servicio, nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado 
                    FROM servicio 
                    WHERE id_servicio = :id AND estado = 1";

            $params = [':id' => $id];
            $result = $this->db->executeSelect($sql, $params);

            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            HandleException::logException($e);
            return false;
        }
    }

    public function create($data)
    {
        try {
            $sql = "INSERT INTO servicio (nombre, descripcion, precio, duracion_minutos, requiere_ayuno, requiere_cita_previa, estado) 
                    VALUES (:nombre, :descripcion, :precio, :duracion_minutos, :requiere_ayuno, :requiere_cita_previa, 1)";

            $params = [
                ':nombre'               => $data->nombre,
                ':descripcion'          => $data->descripcion,
                ':precio'               => $data->precio,
                ':duracion_minutos'     => $data->duracion_minutos,
                ':requiere_ayuno'       => $data->requiere_ayuno ?? 0,
                ':requiere_cita_previa' => $data->requiere_cita_previa ?? 1
            ];

            return $this->db->executeInsert($sql, $params);
        } catch (Exception $e) {
            HandleException::logException($e);
            return false;
        }
    }

    public function update($id, $data)
    {
        try {
            $sql = "UPDATE servicio 
                    SET nombre = :nombre, 
                        descripcion = :descripcion, 
                        precio = :precio, 
                        duracion_minutos = :duracion_minutos, 
                        requiere_ayuno = :requiere_ayuno, 
                        requiere_cita_previa = :requiere_cita_previa 
                    WHERE id_servicio = :id";

            $params = [
                ':id'                   => $id,
                ':nombre'               => $data->nombre,
                ':descripcion'          => $data->descripcion,
                ':precio'               => $data->precio,
                ':duracion_minutos'     => $data->duracion_minutos,
                ':requiere_ayuno'       => $data->requiere_ayuno,
                ':requiere_cita_previa' => $data->requiere_cita_previa
            ];

            return $this->db->executeRow($sql, $params);
        } catch (Exception $e) {
            HandleException::logException($e);
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $sql = "UPDATE servicio SET estado = 0 WHERE id_servicio = :id";
            $params = [':id' => $id];

            return $this->db->executeRow($sql, $params);
        } catch (Exception $e) {
            HandleException::logException($e);
            return false;
        }
    }
}