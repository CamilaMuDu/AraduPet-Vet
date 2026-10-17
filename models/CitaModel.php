
<?php

class CitaModel
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
                        c.id_cita,
                        c.fecha_cita,
                        c.hora_inicio,
                        c.hora_fin,
                        ec.nombre AS estado,
                        ec.color,
                        m.nombre AS mascota,
                        s.nombre AS servicio,
                        ud.nombre AS doctor
                    FROM cita c
                    INNER JOIN estado_cita ec
                        ON c.id_estado = ec.id_estado
                    INNER JOIN mascota m
                        ON c.id_mascota = m.id_mascota
                    INNER JOIN servicio s
                        ON c.id_servicio = s.id_servicio
                    INNER JOIN doctor d
                        ON c.id_doctor = d.id_doctor
                    INNER JOIN usuario ud
                        ON d.id_usuario = ud.id_usuario
                    ORDER BY c.fecha_cita ASC, c.hora_inicio ASC";

            return $this->enlace->executeSQL($vSql);

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
                    "El ID de la cita no es válido"
                );
            }

            $vSql = "SELECT
                        c.id_cita,
                        c.fecha_cita,
                        c.hora_inicio,
                        c.hora_fin,
                        c.motivo_consulta,
                        c.resp_vacunas_al_dia,
                        c.resp_sintomas,
                        c.resp_dieta_actual,
                        c.observaciones,
                        ec.nombre AS estado,
                        ec.color,
                        m.nombre AS mascota,
                        m.especie,
                        m.raza,
                        s.nombre AS servicio,
                        u.nombre AS cliente,
                        ud.nombre AS doctor
                     FROM cita c
                     INNER JOIN estado_cita ec
                        ON c.id_estado = ec.id_estado
                     INNER JOIN mascota m
                        ON c.id_mascota = m.id_mascota
                     INNER JOIN servicio s
                        ON c.id_servicio = s.id_servicio
                     INNER JOIN usuario u
                        ON c.id_cliente = u.id_usuario
                     INNER JOIN doctor d
                        ON c.id_doctor = d.id_doctor
                     INNER JOIN usuario ud
                        ON d.id_usuario = ud.id_usuario
                     WHERE c.id_cita = $id";

            $resultado = $this->enlace->executeSQL($vSql);

            if (!empty($resultado)) {
                return $resultado[0];
            }

            return null;

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Filtrar cita por doctor
    public function getByDoctor($idDoctor)
    {
        try {
            $idDoctor = filter_var($idDoctor, FILTER_VALIDATE_INT);

            if ($idDoctor === false || $idDoctor <= 0) {
                throw new InvalidArgumentException(
                    "El ID del veterinario no es válido"
                );
            }

            $vSql = "SELECT
                        c.id_cita,
                        c.id_doctor,
                        c.fecha_cita,
                        c.hora_inicio,
                        c.hora_fin,
                        ec.nombre AS estado,
                        ec.color,
                        m.nombre AS mascota,
                        s.nombre AS servicio,
                        u.nombre AS veterinario
                     FROM cita c
                     INNER JOIN estado_cita ec
                        ON c.id_estado = ec.id_estado
                     INNER JOIN mascota m
                        ON c.id_mascota = m.id_mascota
                     INNER JOIN servicio s
                        ON c.id_servicio = s.id_servicio
                     INNER JOIN doctor d
                        ON c.id_doctor = d.id_doctor
                     INNER JOIN usuario u
                        ON d.id_usuario = u.id_usuario
                     WHERE c.id_doctor = $idDoctor
                     ORDER BY c.fecha_cita ASC, c.hora_inicio ASC";

            return $this->enlace->executeSQL($vSql);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
