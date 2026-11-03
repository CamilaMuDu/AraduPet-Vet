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
        $inputJSON = file_get_contents('php://input');
        $object = json_decode($inputJSON);

        if (!isset($object->nombre) || empty(trim($object->nombre)) || !isset($object->precio) || !isset($object->duracion_minutos)) {
            $json = [
                'status'  => 400,
                'results' => 'Faltan datos obligatorios (nombre, precio o duracion_minutos)'
            ];
            echo json_encode($json, http_response_code($json['status']));
            return;
        }

        $servicioModel = new ServicioModel();
        $response = $servicioModel->create($object);

        if ($response) {
            $json = [
                'status'  => 201,
                'results' => 'Servicio creado exitosamente con el ID: ' . $response
            ];
        } else {
            $json = [
                'status'  => 400,
                'results' => 'No se pudo registrar el servicio'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }

    public function update($id)
    {
        $inputJSON = file_get_contents('php://input');
        $object = json_decode($inputJSON);

        if (!isset($object->nombre) || empty(trim($object->nombre)) || !isset($object->precio)) {
            $json = [
                'status'  => 400,
                'results' => 'Faltan datos obligatorios para la actualización'
            ];
            echo json_encode($json, http_response_code($json['status']));
            return;
        }

        $servicioModel = new ServicioModel();
        $response = $servicioModel->update($id, $object);

        if ($response) {
            $json = [
                'status'  => 200,
                'results' => 'Servicio actualizado correctamente'
            ];
        } else {
            $json = [
                'status'  => 400,
                'results' => 'No se pudo actualizar el servicio'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
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