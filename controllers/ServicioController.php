<?php

class ServicioController
{
    
    public function index()
    {
        $servicioModel = new ServicioModel();
        $response = $servicioModel->getAll();

        if ($response !== false) {
            $json = [
                'status'  => 200,
                'results' => $response
            ];
        } else {
            $json = [
                'status'  => 400,
                'results' => 'No se encontraron servicios o ocurrió un error'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }

    public function get($id)
    {
        $servicioModel = new ServicioModel();
        $response = $servicioModel->getById($id);

        if ($response) {
            $json = [
                'status'  => 200,
                'results' => $response
            ];
        } else {
            $json = [
                'status'  => 404,
                'results' => 'El servicio no existe o está inactivo'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }

    
    public function create()
    {
        try {
            $data = $_POST;
            $imagen = $_FILES['imagen'] ?? null;

            if (
                empty(trim($data['nombre'] ?? '')) ||
                !isset($data['precio']) ||
                !isset($data['duracion_minutos'])
            ) {
                http_response_code(400);
                echo json_encode([
                    'status' => 400,
                    'results' => 'Faltan datos obligatorios'
                ]);
                return;
            }

            $servicioModel = new ServicioModel();
            $resultado = $servicioModel->create($data, $imagen);

            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'status' => 201,
                    'results' => 'Servicio registrado correctamente',
                    'id_servicio' => $resultado
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'status' => 400,
                    'results' => 'No se pudo registrar el servicio'
                ]);
            }
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }


    
    public function update($id)
    {
        try {
            // Recibir los datos del formulario
            $data = $_POST;

            // Recibir imagen nueva, si se seleccionó
            $imagen = $_FILES['imagen'] ?? null;

            if (
                empty(trim($data['nombre'] ?? '')) ||
                !isset($data['precio']) ||
                !isset($data['duracion_minutos'])
            ) {
                http_response_code(400);
                echo json_encode([
                    'status' => 400,
                    'results' => 'Faltan datos obligatorios para actualizar'
                ]);
                return;
            }

            $servicioModel = new ServicioModel();

            // Actualizar el servicio
            $resultado = $servicioModel->update($id, $data, $imagen);

            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'status' => 200,
                    'results' => 'Servicio actualizado correctamente'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'status' => 400,
                    'results' => 'No se pudo actualizar el servicio'
                ]);
            }
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }


    public function delete($id)
    {
        $servicioModel = new ServicioModel();
        $response = $servicioModel->delete($id);

        if ($response) {
            $json = [
                'status'  => 200,
                'results' => 'Servicio eliminado (desactivado) exitosamente'
            ];
        } else {
            $json = [
                'status'  => 400,
                'results' => 'No se pudo eliminar el servicio'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }
}