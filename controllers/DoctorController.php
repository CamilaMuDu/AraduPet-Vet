<?php

class DoctorController
{
    //lista de verinarios
    public function index()
    {
        try{
            $response = new Response();
            $doctorModel = new DoctorModel();
            $result = $doctorModel->getAll();

            $response->toJSON($result);
        }catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    //Obtener veterinario por ID
    public function get($id)
    {
        try{
            $response = new Response();
            $doctorModel = new DoctorModel();
            $result = $doctorModel->get($id);

            if ($result) {
                $response->toJSON($result);
            } else {
                $response->status(404)->toJSON([], 'Veterinario no encontrado');
            }
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    //Registrar veterinario
    public function create()
    {
        try{
            $data = json_decode(file_get_contents("php://input"), true);

            if(!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
                throw new InvalidArgumentException("Los datos JSON son inválidos");
            }

            $doctorModel = new DoctorModel();
            $result = $doctorModel->create($data);

            $response = new Response();
            $response ->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    //Actualizar veterinario
    public function update($id)
    {
        try{
            $data = json_decode(file_get_contents("php://input"), true);

            if(!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
                throw new InvalidArgumentException("Los datos JSON son inválidos");
            }

            $doctorModel = new DoctorModel();
            $result = $doctorModel->update($id, $data);

            $response = new Response();
            $response ->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

        // Eliminar veterinario
    public function delete($id)
    {
        try {
            $doctorModel = new DoctorModel();
            $resultado = $doctorModel->delete($id);

            $response = new Response();
            $response->toJSON($resultado);

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }
}