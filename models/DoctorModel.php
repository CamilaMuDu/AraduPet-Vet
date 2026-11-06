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
            WHERE d.id_doctor = $id AND d.activo = 1";

            $vResultado = $this->enlace->executeSQL($vSql);

            if(!empty($vResultado)) {
                return $vResultado[0];
            } 

            return null;       
        } catch (Exception $e) {
        HandleException::logException($e);
        }
    }

    // Registrar veterinario
    public function create($data)
    {
        try {
            $this->validarDatos($data);

            $nombre = $this->enlace->escapeString(trim($data['nombre']));
            $identificacion = $this->enlace->escapeString(trim($data['identificacion']));
            $telefono = $this->enlace->escapeString(trim($data['telefono']));
            $correo = $this->enlace->escapeString(trim($data['correo']));
            $direccion = $this->enlace->escapeString(trim($data['direccion']));
            $fechaNacimiento = $this->enlace->escapeString($data['fecha_nacimiento']);
            $especialidad = $this->enlace->escapeString(trim($data['especialidad']));
            $biografia = $this->enlace->escapeString(trim($data['biografia'] ?? ''));

            $contrasenaHash = password_hash(
                $data['contrasena'],
                PASSWORD_DEFAULT
            );

            $contrasenaHash = $this->enlace->escapeString($contrasenaHash);

            $correoExiste = $this->enlace->executeSQL(
                "SELECT id_usuario FROM usuario WHERE correo = '$correo'"
            );

            $identificacionExiste = $this->enlace->executeSQL(
                "SELECT id_usuario FROM usuario WHERE identificacion = '$identificacion'"
            );

            if (!empty($correoExiste)) {
                throw new Exception("El correo electrónico ya está registrado.");
            }

            if (!empty($identificacionExiste)) {
                throw new Exception("La identificación ya está registrada.");
            }

            $this->enlace->beginTransaction();

            $sqlUsuario = "INSERT INTO usuario (
                id_rol,
                nombre,
                identificacion,
                telefono,
                correo,
                direccion,
                fecha_nacimiento,
                contrasena
            ) VALUES (
                2,
                '$nombre',
                '$identificacion',
                '$telefono',
                '$correo',
                '$direccion',
                '$fechaNacimiento',
                '$contrasenaHash'
            )";

            $idUsuario = $this->enlace->executeSQL_DML_last($sqlUsuario);

            if (!$idUsuario) {
                throw new Exception("No se pudo registrar el usuario.");
            }

            $sqlDoctor = "INSERT INTO doctor (
                id_usuario,
                especialidad,
                biografia,
                id_excepciones_horario,
                activo
            ) VALUES (
                $idUsuario,
                '$especialidad',
                '$biografia',
                NULL,
                1
            )";

            $idDoctor = $this->enlace->executeSQL_DML_last($sqlDoctor);

            if (!$idDoctor) {
                throw new Exception("No se pudo registrar el veterinario.");
            }

            $this->enlace->commit();

            return [
                "id_doctor" => $idDoctor,
                "mensaje" => "Veterinario registrado correctamente."
            ];

        } catch (Throwable $e) {
            $this->enlace->rollback();
            throw $e;
        }
    }

        // Actualizar veterinario
    public function update($id, $data)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException("El ID del veterinario no es válido.");
            }

            $camposObligatorios = [
                'nombre',
                'identificacion',
                'telefono',
                'correo',
                'direccion',
                'fecha_nacimiento',
                'especialidad'
            ];

            foreach ($camposObligatorios as $campo) {
                if (!isset($data[$campo]) || trim((string)$data[$campo]) === '') {
                    throw new InvalidArgumentException("El campo $campo es obligatorio.");
                }
            }

            if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException("El correo electrónico no es válido.");
            }

            if (strlen($data['nombre']) > 100 ||
                strlen($data['identificacion']) > 30 ||
                strlen($data['telefono']) > 20 ||
                strlen($data['correo']) > 150 ||
                strlen($data['direccion']) > 100 ||
                strlen($data['especialidad']) > 100) {
                throw new InvalidArgumentException("Uno o más campos superan la longitud permitida.");
            }

            $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_nacimiento']);

            if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_nacimiento']) {
                throw new InvalidArgumentException("La fecha de nacimiento no es válida.");
            }

            $doctor = $this->get($id);

            if (!$doctor) {
                throw new Exception("El veterinario no existe o está inactivo.");
            }

            $idUsuario = (int)$doctor->id_usuario;

            $nombre = $this->enlace->escapeString(trim($data['nombre']));
            $identificacion = $this->enlace->escapeString(trim($data['identificacion']));
            $telefono = $this->enlace->escapeString(trim($data['telefono']));
            $correo = $this->enlace->escapeString(trim($data['correo']));
            $direccion = $this->enlace->escapeString(trim($data['direccion']));
            $fechaNacimiento = $this->enlace->escapeString($data['fecha_nacimiento']);
            $especialidad = $this->enlace->escapeString(trim($data['especialidad']));
            $biografia = $this->enlace->escapeString(trim($data['biografia'] ?? ''));

            $correoExiste = $this->enlace->executeSQL(
                "SELECT id_usuario FROM usuario
                WHERE correo = '$correo' AND id_usuario <> $idUsuario"
            );

            $identificacionExiste = $this->enlace->executeSQL(
                "SELECT id_usuario FROM usuario
                WHERE identificacion = '$identificacion'
                AND id_usuario <> $idUsuario"
            );

            if (!empty($correoExiste)) {
                throw new Exception("El correo electrónico ya está registrado por otro usuario.");
            }

            if (!empty($identificacionExiste)) {
                throw new Exception("La identificación ya está registrada por otro usuario.");
            }

            $this->enlace->beginTransaction();

            $sqlUsuario = "UPDATE usuario SET
                nombre = '$nombre',
                identificacion = '$identificacion',
                telefono = '$telefono',
                correo = '$correo',
                direccion = '$direccion',
                fecha_nacimiento = '$fechaNacimiento'
                WHERE id_usuario = $idUsuario";

            $this->enlace->executeSQL_DML($sqlUsuario);

            if (!empty($data['contrasena'])) {

                if (strlen($data['contrasena']) < 8) {
                    throw new InvalidArgumentException(
                        "La contraseña debe tener al menos 8 caracteres."
                    );
                }

                $hash = password_hash($data['contrasena'], PASSWORD_DEFAULT);
                $hash = $this->enlace->escapeString($hash);

                $sqlContrasena = "UPDATE usuario
                    SET contrasena = '$hash'
                    WHERE id_usuario = $idUsuario";

                $this->enlace->executeSQL_DML($sqlContrasena);
            }

            $sqlDoctor = "UPDATE doctor SET
                especialidad = '$especialidad',
                biografia = '$biografia'
                WHERE id_doctor = $id";

            $this->enlace->executeSQL_DML($sqlDoctor);

            $this->enlace->commit();

            return [
                "id_doctor" => $id,
                "mensaje" => "Veterinario actualizado correctamente."
            ];

        } catch (Throwable $e) {
            $this->enlace->rollback();
            throw $e;
        }
    }

        // Borrado lógico
    public function delete($id)
    {
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if ($id === false || $id <= 0) {
            throw new InvalidArgumentException(
                "El ID del veterinario no es válido."
            );
        }

        $doctor = $this->get($id);

        if (!$doctor) {
            throw new Exception(
                "El veterinario no existe."
            );
        }

        $sql = "UPDATE doctor
                SET activo = 0
                WHERE id_doctor = " . (int)$id . "
                AND activo = 1";

        $this->enlace->executeSQL_DML($sql);

        return [
            "success" => true,
            "id_doctor" => $id,
            "mensaje" => "Veterinario eliminado correctamente."
        ];
    }

    private function validarDatos($data)
    {
        $camposObligatorios = [
            'nombre',
            'identificacion',
            'telefono',
            'correo',
            'direccion',
            'fecha_nacimiento',
            'contrasena',
            'especialidad'
        ];

        foreach ($camposObligatorios as $campo) {
            if (!isset($data[$campo]) || trim((string)$data[$campo]) === '') {
                throw new InvalidArgumentException(
                    "El campo $campo es obligatorio."
                );
            }
        }

        if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("El correo electrónico no es válido.");
        }

        if (strlen($data['nombre']) > 100) {
            throw new InvalidArgumentException("El nombre no puede superar 100 caracteres.");
        }

        if (strlen($data['identificacion']) > 30) {
            throw new InvalidArgumentException("La identificación no puede superar 30 caracteres.");
        }

        if (strlen($data['telefono']) > 20) {
            throw new InvalidArgumentException("El teléfono no puede superar 20 caracteres.");
        }

        if (strlen($data['correo']) > 150) {
            throw new InvalidArgumentException("El correo no puede superar 150 caracteres.");
        }

        if (strlen($data['direccion']) > 100) {
            throw new InvalidArgumentException("La dirección no puede superar 100 caracteres.");
        }

        if (strlen($data['especialidad']) > 100) {
            throw new InvalidArgumentException("La especialidad no puede superar 100 caracteres.");
        }

        $fecha = DateTime::createFromFormat('Y-m-d', $data['fecha_nacimiento']);

        if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha_nacimiento']) {
            throw new InvalidArgumentException("La fecha de nacimiento no es válida.");
        }

        if (strlen($data['contrasena']) < 8) {
            throw new InvalidArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }

        if (isset($data['biografia']) && strlen($data['biografia']) > 5000) {
            throw new InvalidArgumentException("La biografía es demasiado extensa.");
        }
    }
}