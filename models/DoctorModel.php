<?php

class DoctorModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    //Listar veterinarios
    public function getAll()
    {
        try{
            $vSql = "SELECT 
            d.id_doctor,
            u.id_usuario,
            u.nombre,
            u.identificacion,
            u.telefono,
            u.correo,
            u.direccion,
            u.fecha_nacimiento,
            d.especialidad,
            d.biografia,
            d.id_excepciones_horario,
            d.activo
            FROM doctor d
            INNER JOIN usuario u ON d.id_usuario = u.id_usuario
            WHERE d.activo = 1
            ORDER BY u.nombre ASC";

            return $this->enlace->executeSQL($vSql);
        } catch (Exception $e) {
            HandleException::logException($e);
        }
    }

    //Obtener veterinario por ID
    public function get($id)
    {
        try{
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if($id === false || $id <= 0) {
                throw new InvalidArgumentException("El ID del veterinario no es válido");
            }

            $vSql = "SELECT
            d.id_doctor,
            u.id_usuario,
            u.nombre,
            u.identificacion,
            u.telefono,
            u.correo,
            u.direccion,
            u.fecha_nacimiento,
            d.especialidad,
            d.biografia,
            d.id_excepciones_horario,
            d.activo
            FROM doctor d
            INNER JOIN usuario u ON d.id_usuario = u.id_usuario
            WHERE d.id_doctor = :id AND d.activo = 1";

            $vResultado = $this->enlace->executeSQL($vSql);

            if(!empty($vResultado)) {
                return $vResultado[0];
            } 

            return null;       
        } catch (Exception $e) {
            HandleException($e);
        }
    }
}