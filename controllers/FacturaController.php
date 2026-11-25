<?php

class FacturaController
{
    //getAll
    public function index()
    {
        try {
            $response = new Response();
            $factura = new FacturaModel();

            $usuario = UsuarioAuth::verificar([
                'Administrador',
                'Encargado',
                'Cliente'
            ]);

            if ($usuario->rol === 'Cliente') {
                $result = $factura->all($usuario->id_usuario);
            } else {
                $result = $factura->all();
            }

            if (empty($result)) {
            http_response_code(200);
            echo json_encode([]);
            return;
            }

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GetById
    public function get($id)
    {
        try {
            $response = new Response();
            $factura = new FacturaModel();

            $usuario = UsuarioAuth::verificar([
                'Administrador',
                'Encargado',
                'Cliente'
            ]);

            if ($usuario->rol === 'Cliente') {
                $result = $factura->get(
                    $id,
                    $usuario->id_usuario
                );
            } else {
                $result = $factura->get($id);
            }

            if (!$result) {
                http_response_code(404);

                echo json_encode([
                    'status' => 404,
                    'result' => 'Factura no encontrada'
                ]);

                return;
            }

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
