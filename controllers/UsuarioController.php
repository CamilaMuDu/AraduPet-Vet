<?php

use Firebase\JWT\JWT;

class UsuarioController
{
    public function login()
    {
        header ('Content-Type: application/json');

        $datos = json_decode(file_get_contents("php://input"), true);

        $correo = trim($datos['correo'] ?? '');
        $contrasena = $datos['contrasena'] ?? '';

        if($correo === '' || $contrasena === '') {
            http_response_code(400);
            echo json_encode(['status' => 400, 'result' => 'Debe ingresar correo y contraseña']);
            return;
        }

        $modelo = new UsuarioModel();
        $usuario = $modelo->buscarPorCorreo($correo);

        if(!$usuario || !password_verify($contrasena, $usuario ->contrasena)) {
            http_response_code(401);
            echo json_encode(['status' => 401, 'result' => 'Correo o contraseña incorrectos']);
            return;
        }

        if ($usuario->estado !== 'Activo') {
            http_response_code(403);
            echo json_encode([
                'status' => 403,
                'result' => 'Usuario no habilitado'
            ]);
            return;
        }

        $ahora = time();

        $payload = [
            'iat' => $ahora,
            'exp' => $ahora + 3600,
            'sub' => (string) $usuario->id_usuario,
            'rol' => [
                'name' => $usuario->rol
            ]
        ];

        $token = JWT::encode(
            $payload,
            Config::get('SECRET_KEY'),
            'HS256'
        );

        echo json_encode([
            'status' => 200,
            'result' => [
                'token' => $token,
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'correo' => $usuario->correo,
                    'rol' => $usuario->rol
                ]
            ]
        ]);
    }

    public function registrar()
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents("php://input"));

        $campos = [
            'nombre',
            'identificacion',
            'telefono',
            'correo',
            'direccion',
            'fecha_nacimiento',
            'contrasena'
        ];

        foreach ($campos as $campo) {
            if (!isset($datos->$campo) ||
                !is_string($datos->$campo) ||
                trim($datos->$campo) === '') {

                http_response_code(400);
                echo json_encode([
                    'status' => 400,
                    'result' => 'El campo ' . $campo . ' es obligatorio'
                ]);
                return;
            }
        }

        $datos->correo = trim($datos->correo);
        $datos->identificacion = trim($datos->identificacion);

        if (!filter_var($datos->correo, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'status' => 400,
                'result' => 'El correo electrónico no es válido'
            ]);
            return;
        }

        if (strlen($datos->contrasena) < 8 ||
            strlen($datos->contrasena) > 72) {

            http_response_code(400);
            echo json_encode([
                'status' => 400,
                'result' => 'La contraseña debe tener entre 8 y 72 bytes'
            ]);
            return;
        }

        $modelo = new UsuarioModel();

        if ($modelo->buscarPorCorreo($datos->correo)) {
            http_response_code(409);
            echo json_encode([
                'status' => 409,
                'result' => 'El correo electrónico ya está registrado'
            ]);
            return;
        }

        if ($modelo->buscarPorIdentificacion($datos->identificacion)) {
            http_response_code(409);
            echo json_encode([
                'status' => 409,
                'result' => 'La identificación ya está registrada'
            ]);
            return;
        }

        $resultado = $modelo->registrar($datos);

        if (!$resultado) {
            http_response_code(500);
            echo json_encode([
                'status' => 500,
                'result' => 'No se pudo registrar el usuario'
            ]);
            return;
        }

        http_response_code(201);
        echo json_encode([
            'status' => 201,
            'result' => 'Usuario registrado correctamente'
        ]);
    }

    public function index()
    {
        header('Content-Type: application/json');

        UsuarioAuth::verificar(['Administrador']);

        $modelo = new UsuarioModel();
        $resultado = $modelo->all();

        echo json_encode([
            'status' => 200,
            'result' => $resultado ?? []
        ]);
    }


    public function update($id)
    {
        header('Content-Type: application/json');

        $auth = new AuthMiddleware();
        $auth->handle(['Administrador']);

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            http_response_code(405);
            echo json_encode([
                'status' => 405,
                'result' => 'Método no permitido'
            ]);
            return;
        }

        $datos = json_decode(file_get_contents("php://input"));

        $idRol = filter_var(
            $datos->id_rol ?? null,
            FILTER_VALIDATE_INT
        );

        if (!in_array($idRol, [2, 3], true)) {
            http_response_code(400);
            echo json_encode([
                'status' => 400,
                'result' => 'Rol no permitido'
            ]);
            return;
        }

        $modelo = new UsuarioModel();
        $usuario = $modelo->buscarPorId($id);

        if (!$usuario) {
            http_response_code(404);
            echo json_encode([
                'status' => 404,
                'result' => 'Usuario no encontrado'
            ]);
            return;
        }

        if ((int)$usuario->id_rol === 1) {
            http_response_code(403);
            echo json_encode([
                'status' => 403,
                'result' => 'No se puede modificar el rol del administrador'
            ]);
            return;
        }

        if ((int)$usuario->id_rol === $idRol) {
            echo json_encode([
                'status' => 200,
                'result' => 'El usuario ya tiene ese rol'
            ]);
            return;
        }

        $resultado = $modelo->cambiarRol($id, $idRol);

        if (!$resultado) {
            http_response_code(500);
            echo json_encode([
                'status' => 500,
                'result' => 'No se pudo actualizar el rol'
            ]);
            return;
        }

        echo json_encode([
            'status' => 200,
            'result' => 'Rol actualizado correctamente'
        ]);
    }
}