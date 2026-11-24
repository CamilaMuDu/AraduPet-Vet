
<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UsuarioAuth
{
    public static function verificar($rolesPermitidos)
    {
        $headers = apache_request_headers();
        $headers = array_change_key_case($headers, CASE_LOWER);

        $authorization = $headers['authorization'] ?? '';

        if (strpos($authorization, 'Bearer ') !== 0) {
            self::denegar(401, 'Token no proporcionado');
        }

        $token = substr($authorization, 7);

        try {
            $datos = JWT::decode(
                $token,
                new Key(Config::get('SECRET_KEY'), 'HS256')
            );

        } catch (Exception $e) {
            self::denegar(401, 'Token inválido o expirado');
        }

        $modelo = new UsuarioModel();

        $usuario = $modelo->buscarPorId($datos->sub ?? null);

        if (!$usuario || $usuario->estado !== 'Activo') {
            self::denegar(403, 'Usuario no habilitado');
        }

        if ($usuario->rol !== ($datos->rol->name ?? null)) {
            self::denegar(401, 'Su rol ha cambiado. Inicie sesión nuevamente');
        }

        if (!in_array($usuario->rol, $rolesPermitidos, true)) {
            self::denegar(403, 'Rol no autorizado');
        }

        return $usuario;
    }

    private static function denegar($status, $mensaje)
    {
        http_response_code($status);

        echo json_encode([
            'status' => $status,
            'result' => $mensaje
        ]);

        exit;
    }
}
