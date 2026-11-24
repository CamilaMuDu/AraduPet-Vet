<?php

class UsuarioModel 
{
    public $enlace;
    
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    
    public function buscarPorCorreo($correo)
    {
        try{
            $correoSeguro = $this->enlace->escapeString($correo);

            $vSql = "SELECT 
                    u.id_usuario,
                    u.nombre,
                    u.correo,
                    u.contrasena,
                    u.id_estado_usuario,
                    eu.nombre AS estado,
                    r.id_rol,
                    r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.id_rol = r.id_rol
                    INNER JOIN estado_usuario eu ON u.id_estado_usuario = eu.id_estado_usuario
                    WHERE u.correo = '$correoSeguro'
                    LIMIT 1";

            $resultado = $this->enlace->executeSQL($vSql);
            return !empty($resultado) ? $resultado[0] : null;    
        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    public function registrar($datos)
    {
        try {
            $nombre = $this->enlace->escapeString($datos->nombre);
            $identificacion = $this->enlace->escapeString($datos->identificacion);
            $telefono = $this->enlace->escapeString($datos->telefono);
            $correo = $this->enlace->escapeString($datos->correo);
            $direccion = $this->enlace->escapeString($datos->direccion);
            $fechaNacimiento = $this->enlace->escapeString($datos->fecha_nacimiento);

            $contrasena = password_hash(
                $datos->contrasena,
                PASSWORD_DEFAULT
            );

            $vSql = "INSERT INTO usuario (
                        id_rol,
                        id_estado_usuario,
                        nombre,
                        identificacion,
                        telefono,
                        correo,
                        direccion,
                        fecha_nacimiento,
                        contrasena
                    ) VALUES (
                        3,
                        1,
                        '$nombre',
                        '$identificacion',
                        '$telefono',
                        '$correo',
                        '$direccion',
                        '$fechaNacimiento',
                        '$contrasena'
                    )";

            return $this->enlace->executeSQL_DML_last($vSql);

        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    public function buscarPorIdentificacion($identificacion)
    {
        try {
            $identificacionSegura = $this->enlace->escapeString(
                $identificacion
            );

            $vSql = "SELECT id_usuario
                    FROM usuario
                    WHERE identificacion = '$identificacionSegura'
                    LIMIT 1";

            $resultado = $this->enlace->executeSQL($vSql);

            return !empty($resultado) ? $resultado[0] : null;

        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    public function all()
    {
        try {
            $vSql = "SELECT
                        u.id_usuario,
                        u.nombre,
                        u.identificacion,
                        u.correo,
                        u.telefono,
                        u.id_rol,
                        r.nombre AS rol,
                        eu.nombre AS estado
                    FROM usuario u
                    INNER JOIN rol r
                        ON u.id_rol = r.id_rol
                    INNER JOIN estado_usuario eu
                        ON u.id_estado_usuario = eu.id_estado_usuario
                    ORDER BY u.nombre DESC";

            return $this->enlace->executeSQL($vSql);

        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }

    public function cambiarRol($idUsuario, $idRol)
    {
        try {
            $idUsuario = filter_var($idUsuario, FILTER_VALIDATE_INT);
            $idRol = filter_var($idRol, FILTER_VALIDATE_INT);

            if ($idUsuario === false || $idUsuario <= 0) {
                return false;
            }

            if (!in_array($idRol, [2, 3], true)) {
                return false;
            }

            $this->enlace->beginTransaction();

            $vSql = "UPDATE usuario
                    SET id_rol = $idRol
                    WHERE id_usuario = $idUsuario
                    AND id_rol IN (2, 3)";

            $resultado = $this->enlace->executeSQL_DML($vSql);

            if ($resultado !== 1) {
                $this->enlace->rollback();
                return false;
            }

            if ($idRol === 3) {
                $vSqlDoctor = "UPDATE doctor
                            SET activo = 0
                            WHERE id_usuario = $idUsuario";

                $resultadoDoctor = $this->enlace
                    ->executeSQL_DML($vSqlDoctor);

                if (!is_int($resultadoDoctor) || $resultadoDoctor < 0) {
                    $this->enlace->rollback();
                    return false;
                }
            }

            $this->enlace->commit();

            return true;

        } catch (Exception $e) {
            $this->enlace->rollback();
            handleException($e);
            return false;
        }
    }

    public function buscarPorId($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                return null;
            }

            $vSql = "SELECT
                        u.id_usuario,
                        u.nombre,
                        u.correo,
                        u.id_rol,
                        u.id_estado_usuario,
                        r.nombre AS rol,
                        eu.nombre AS estado
                    FROM usuario u
                    INNER JOIN rol r
                        ON u.id_rol = r.id_rol
                    INNER JOIN estado_usuario eu
                        ON u.id_estado_usuario = eu.id_estado_usuario
                    WHERE u.id_usuario = $id
                    LIMIT 1";

            $resultado = $this->enlace->executeSQL($vSql);

            return !empty($resultado) ? $resultado[0] : null;

        } catch (Exception $e) {
            handleException($e);
            return null;
        }
    }
}