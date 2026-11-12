<?php

class HorarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getAll()
    {
        try {
            $sql = "SELECT 
                        h.id_horario, 
                        h.id_doctor, 
                        h.dia_semana, 
                        h.hora_apertura, 
                        h.hora_cierre,
                        u.nombre AS nombre_doctor, 
                        d.especialidad
                    FROM horario_doctor h
                    INNER JOIN doctor d ON h.id_doctor = d.id_doctor
                    INNER JOIN usuario u ON d.id_usuario = u.id_usuario
                    WHERE d.activo = 1 AND h.activo = 1
                    ORDER BY h.dia_semana ASC, h.hora_apertura ASC";

            return $this->enlace->executeSQL($sql);
        } catch (Throwable $e) {
            HandleException::logException($e);
            return [];
        }
    }

    public function create($data)
    {
        try {
            $idDoctor = filter_var($data['id_doctor'], FILTER_VALIDATE_INT);
            $diaSemana = filter_var($data['dia_semana'], FILTER_VALIDATE_INT);
            $horaApertura = $this->enlace->escapeString($data['hora_apertura']);
            $horaCierre = $this->enlace->escapeString($data['hora_cierre']);

            if (!$idDoctor || !$diaSemana) {
                throw new InvalidArgumentException("El doctor y el día son obligatorios.");
            }

            $sql = "INSERT INTO horario_doctor (id_doctor, dia_semana, hora_apertura, hora_cierre) 
                    VALUES ($idDoctor, $diaSemana, '$horaApertura', '$horaCierre')";

            $idHorario = $this->enlace->executeSQL_DML_last($sql);

            return [
                "id_horario" => $idHorario,
                "mensaje" => "Horario registrado correctamente."
            ];
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function update($id, $data)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);
            $diaSemana = filter_var($data['dia_semana'], FILTER_VALIDATE_INT);
            $horaApertura = $this->enlace->escapeString($data['hora_apertura']);
            $horaCierre = $this->enlace->escapeString($data['hora_cierre']);

            if (!$id || !$diaSemana) {
                throw new InvalidArgumentException("El ID del horario y el día son obligatorios.");
            }

            $sql = "UPDATE horario_doctor 
                    SET dia_semana = $diaSemana, 
                        hora_apertura = '$horaApertura', 
                        hora_cierre = '$horaCierre' 
                    WHERE id_horario = $id";

            $this->enlace->executeSQL_DML($sql);

            return [
                "id_horario" => $id,
                "mensaje" => "Horario actualizado correctamente."
            ];
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function delete($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);
            $sql = "DELETE FROM horario_doctor WHERE id_horario = $id";
            $this->enlace->executeSQL_DML($sql);

            return [
                "success" => true,
                "id_horario" => $id,
                "mensaje" => "Horario eliminado correctamente."
            ];
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }
}