<?php

class HorarioModel
{
    private $db;

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    /**
     * Obtener todos los horarios con la información del doctor asignado
     */
    public function getAll()
    {
        try {
            $sql = "SELECT h.id_excepciones_horario, h.dia_semana, h.hora_apertura, h.hora_cierre,
                           d.id_doctor, u.nombre AS nombre_doctor, d.especialidad
                    FROM excepciones_horario h
                    INNER JOIN doctor d ON d.id_excepciones_horario = h.id_excepciones_horario
                    INNER JOIN usuario u ON d.id_usuario = u.id_usuario
                    WHERE d.activo = 1
                    ORDER BY h.dia_semana ASC, h.hora_apertura ASC";

            return $this->db->executeSQL($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Obtener el horario/excepción de un doctor específico por su id_doctor
     */
    public function getByDoctor($idDoctor)
    {
        try {
            $idSeguro = intval($idDoctor);
            $sql = "SELECT h.id_excepciones_horario, h.dia_semana, h.hora_apertura, h.hora_cierre,
                           d.id_doctor, u.nombre AS nombre_doctor, d.especialidad
                    FROM excepciones_horario h
                    INNER JOIN doctor d ON d.id_excepciones_horario = h.id_excepciones_horario
                    INNER JOIN usuario u ON d.id_usuario = u.id_usuario
                    WHERE d.id_doctor = {$idSeguro} AND d.activo = 1";

            $result = $this->db->executeSQL($sql);
            return !empty($result) ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Crear un nuevo horario en la tabla excepciones_horario
     */
    public function create($data)
    {
        try {
            $diaSemana = intval($data->dia_semana);
            $horaApertura = $this->db->escapeString($data->hora_apertura);
            $horaCierre = $this->db->escapeString($data->hora_cierre);

            $sql = "INSERT INTO excepciones_horario (dia_semana, hora_apertura, hora_cierre) 
                    VALUES ({$diaSemana}, '{$horaApertura}', '{$horaCierre}')";

            return $this->db->executeSQL_DML_last($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Actualizar las horas de una excepción u horario existente
     */
    public function update($id, $data)
    {
        try {
            $idSeguro = intval($id);
            $diaSemana = intval($data->dia_semana);
            $horaApertura = $this->db->escapeString($data->hora_apertura);
            $horaCierre = $this->db->escapeString($data->hora_cierre);

            $sql = "UPDATE excepciones_horario 
                    SET dia_semana = {$diaSemana}, 
                        hora_apertura = '{$horaApertura}', 
                        hora_cierre = '{$horaCierre}' 
                    WHERE id_excepciones_horario = {$idSeguro}";

            return $this->db->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /**
     * Eliminar una excepción u horario por su ID
     */
    public function delete($id)
    {
        try {
            $idSeguro = intval($id);
            $sql = "DELETE FROM excepciones_horario WHERE id_excepciones_horario = {$idSeguro}";
            return $this->db->executeSQL_DML($sql);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}