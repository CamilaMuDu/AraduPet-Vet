<?php

class ExcepcionesHorarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    private function validarId($valor, $campo = "ID")
    {
        $id = filter_var($valor, FILTER_VALIDATE_INT);

        if ($id === false || $id <= 0) {
            throw new InvalidArgumentException(
                "El $campo no es válido."
            );
        }

        return $id;
    }

    private function consultar($sql)
    {
        $resultado = $this->enlace->executeSQL($sql);

        return $resultado ?? [];
    }

    public function getAll()
    {
        try {
            $sql = "SELECT
                        e.id_excepciones_horario,
                        e.id_doctor,
                        e.fecha,
                        e.dia_semana,
                        e.hora_apertura,
                        e.hora_cierre,
                        e.motivo,
                        u.nombre AS nombre_doctor
                    FROM excepciones_horario e
                    INNER JOIN doctor d
                        ON e.id_doctor = d.id_doctor
                    INNER JOIN usuario u
                        ON d.id_usuario = u.id_usuario
                    ORDER BY
                        e.fecha ASC,
                        e.hora_apertura ASC";

            $resultado = $this->consultar($sql);

            usort($resultado, function ($a, $b) {
                return strcmp(
                    $a->fecha . " " . $a->hora_apertura,
                    $b->fecha . " " . $b->hora_apertura
                );
            });

            return $resultado;

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function getByDoctor($idDoctor)
    {
        try {
            $idDoctor = $this->validarId(
                $idDoctor,
                "ID del veterinario"
            );

            $sql = "SELECT
                        e.id_excepciones_horario,
                        e.id_doctor,
                        e.fecha,
                        e.dia_semana,
                        e.hora_apertura,
                        e.hora_cierre,
                        e.motivo,
                        u.nombre AS nombre_doctor
                    FROM excepciones_horario e
                    INNER JOIN doctor d
                        ON e.id_doctor = d.id_doctor
                    INNER JOIN usuario u
                        ON d.id_usuario = u.id_usuario
                    WHERE e.id_doctor = $idDoctor
                    ORDER BY
                        e.fecha ASC,
                        e.hora_apertura ASC";

            $resultado = $this->consultar($sql);

            usort($resultado, function ($a, $b) {
                return strcmp(
                    $a->fecha . " " . $a->hora_apertura,
                    $b->fecha . " " . $b->hora_apertura
                );
            });

            return $resultado;

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function get($id)
    {
        try {
            $id = $this->validarId(
                $id,
                "ID del bloqueo"
            );

            $sql = "SELECT
                        e.id_excepciones_horario,
                        e.id_doctor,
                        e.fecha,
                        e.dia_semana,
                        e.hora_apertura,
                        e.hora_cierre,
                        e.motivo,
                        u.nombre AS nombre_doctor
                    FROM excepciones_horario e
                    INNER JOIN doctor d
                        ON e.id_doctor = d.id_doctor
                    INNER JOIN usuario u
                        ON d.id_usuario = u.id_usuario
                    WHERE e.id_excepciones_horario = $id";

            $resultado = $this->consultar($sql);

            return $resultado[0] ?? null;

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function create($data)
    {
        try {
            $idDoctor = $this->validarId(
                $data["id_doctor"] ?? null,
                "ID del veterinario"
            );

            $fechaTexto = $data["fecha"] ?? "";
            $horaInicio = $data["hora_apertura"] ?? "";
            $horaFin = $data["hora_cierre"] ?? "";
            $motivo = $data["motivo"] ?? "";

            if (
                !is_string($fechaTexto) ||
                !preg_match(
                    '/^\d{4}-\d{2}-\d{2}$/',
                    $fechaTexto
                )
            ) {
                throw new InvalidArgumentException(
                    "La fecha debe tener el formato YYYY-MM-DD."
                );
            }

            $zona = new DateTimeZone(
                "America/Costa_Rica"
            );

            $fecha = DateTimeImmutable::createFromFormat(
                "!Y-m-d",
                $fechaTexto,
                $zona
            );

            if (
                !$fecha ||
                $fecha->format("Y-m-d") !== $fechaTexto
            ) {
                throw new InvalidArgumentException(
                    "La fecha del bloqueo no es válida."
                );
            }

            $hoy = new DateTimeImmutable(
                "today",
                $zona
            );

            if ($fecha < $hoy) {
                throw new InvalidArgumentException(
                    "No se pueden registrar bloqueos en fechas anteriores a hoy."
                );
            }

            $formatoHora =
                '/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/';

            if (
                !is_string($horaInicio) ||
                !is_string($horaFin) ||
                !preg_match($formatoHora, $horaInicio) ||
                !preg_match($formatoHora, $horaFin)
            ) {
                throw new InvalidArgumentException(
                    "Las horas deben tener el formato HH:MM o HH:MM:SS."
                );
            }

            if (strlen($horaInicio) === 5) {
                $horaInicio .= ":00";
            }

            if (strlen($horaFin) === 5) {
                $horaFin .= ":00";
            }

            if ($horaInicio >= $horaFin) {
                throw new InvalidArgumentException(
                    "La hora final debe ser mayor que la hora inicial."
                );
            }

            if ($motivo === null) {
                $motivo = "";
            }

            if (!is_string($motivo)) {
                throw new InvalidArgumentException(
                    "El motivo debe ser un texto."
                );
            }

            $motivo = trim($motivo);

            if (mb_strlen($motivo, "UTF-8") > 150) {
                throw new InvalidArgumentException(
                    "El motivo no puede superar los 150 caracteres."
                );
            }

            $sqlDoctor = "SELECT id_doctor
                          FROM doctor
                          WHERE id_doctor = $idDoctor
                          AND activo = 1";

            $doctor = $this->consultar($sqlDoctor);

            if (empty($doctor)) {
                throw new InvalidArgumentException(
                    "El veterinario no existe o se encuentra inactivo."
                );
            }

            $diaSemana = (int) $fecha->format("N");

            $sqlHorario = "SELECT id_horario
                           FROM horario_doctor
                           WHERE id_doctor = $idDoctor
                           AND dia_semana = $diaSemana
                           AND activo = 1
                           AND hora_apertura <= '$horaInicio'
                           AND hora_cierre >= '$horaFin'";

            $horarios = $this->consultar($sqlHorario);

            if (empty($horarios)) {
                throw new DomainException(
                    "El bloqueo debe estar completamente dentro del horario de atención del veterinario."
                );
            }

            $sqlBloqueos = "SELECT id_excepciones_horario
                            FROM excepciones_horario
                            WHERE id_doctor = $idDoctor
                            AND fecha = '$fechaTexto'
                            AND hora_apertura < '$horaFin'
                            AND hora_cierre > '$horaInicio'";

            $bloqueos = $this->consultar($sqlBloqueos);

            if (!empty($bloqueos)) {
                throw new DomainException(
                    "Ya existe un bloqueo registrado que se superpone con el rango de horas seleccionado."
                );
            }

            $sqlCitas = "SELECT id_cita
                         FROM cita
                         WHERE id_doctor = $idDoctor
                         AND fecha_cita = '$fechaTexto'
                         AND id_estado IN (1, 2)
                         AND hora_inicio < '$horaFin'
                         AND hora_fin > '$horaInicio'";

            $citas = $this->consultar($sqlCitas);

            if (!empty($citas)) {
                throw new DomainException(
                    "No se puede registrar el bloqueo porque existen citas pendientes o confirmadas en ese rango de horas."
                );
            }

            $motivoSQL = "NULL";

            if ($motivo !== "") {
                $motivoSeguro = $this->enlace->escapeString(
                    $motivo
                );

                $motivoSQL = "'$motivoSeguro'";
            }

            $sql = "INSERT INTO excepciones_horario
                    (
                        id_doctor,
                        fecha,
                        dia_semana,
                        hora_apertura,
                        hora_cierre,
                        motivo
                    )
                    VALUES
                    (
                        $idDoctor,
                        '$fechaTexto',
                        $diaSemana,
                        '$horaInicio',
                        '$horaFin',
                        $motivoSQL
                    )";

            $idBloqueo = $this->enlace->executeSQL_DML_last(
                $sql
            );

            if (!$idBloqueo) {
                throw new RuntimeException(
                    "No se pudo registrar el bloqueo."
                );
            }

            return [
                "id_excepciones_horario" => $idBloqueo,
                "mensaje" => "Bloqueo registrado correctamente."
            ];

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function delete($id)
    {
        try {
            $id = $this->validarId(
                $id,
                "ID del bloqueo"
            );

            $bloqueo = $this->get($id);

            if ($bloqueo === null) {
                throw new InvalidArgumentException(
                    "El bloqueo seleccionado no existe."
                );
            }

            $sql = "DELETE FROM excepciones_horario
                    WHERE id_excepciones_horario = $id";

            $resultado = $this->enlace->executeSQL_DML(
                $sql
            );

            if ($resultado !== 1) {
                throw new RuntimeException(
                    "No se pudo eliminar el bloqueo."
                );
            }

            return [
                "success" => true,
                "id_excepciones_horario" => $id,
                "mensaje" => "Bloqueo eliminado correctamente."
            ];

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }
}
