<?php

class HorarioController
{
    public function index()
    {
        try {
            $response = new Response();
            $horarioModel = new HorarioModel();
            $result = $horarioModel->getAll();

            $response->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
                throw new InvalidArgumentException("Los datos JSON son inválidos");
            }

            $horarioModel = new HorarioModel();
            $result = $horarioModel->create($data);

            $response = new Response();
            $response->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function update($id)
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
                throw new InvalidArgumentException("Los datos JSON son inválidos");
            }

            $horarioModel = new HorarioModel();
            $result = $horarioModel->update($id, $data);

            $response = new Response();
            $response->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    public function delete($id)
    {
        try {
            $horarioModel = new HorarioModel();
            $result = $horarioModel->delete($id);

            $response = new Response();
            $response->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }
}