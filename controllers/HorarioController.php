<?php

class HorarioController
{
    private $model;

    public function __construct()
    {
        $this->model = new HorarioModel();
    }

    /**
     * Endpoint GET /horario
     */
    public function index()
    {
        $response = new Response();
        $result = $this->model->getAll();

        if ($result !== false) {
            $response->toJSON(200, $result);
        } else {
            $response->toJSON(500, null, "Error al consultar los horarios.");
        }
    }

    /**
     * Endpoint GET /horario/get/$idDoctor
     */
    public function get($idDoctor)
    {
        $response = new Response();
        $result = $this->model->getByDoctor($idDoctor);

        if ($result !== false) {
            $response->toJSON(200, $result);
        } else {
            $response->toJSON(404, null, "No se encontró el horario para el doctor especificado.");
        }
    }

    /**
     * Endpoint POST /horario
     */
    public function create()
    {
        $response = new Response();
        $request = new Request();
        $data = $request->getBody();

        if (!isset($data->dia_semana) || empty($data->hora_apertura) || empty($data->hora_cierre)) {
            $response->toJSON(400, null, "Faltan datos obligatorios (día de la semana, hora apertura y hora cierre).");
            return;
        }

        $result = $this->model->create($data);

        if ($result) {
            $response->toJSON(201, ["id_excepciones_horario" => $result], "Horario registrado correctamente.");
        } else {
            $response->toJSON(500, null, "No se pudo registrar el horario.");
        }
    }

    /**
     * Endpoint PUT /horario/update/$id
     */
    public function update($id)
    {
        $response = new Response();
        $request = new Request();
        $data = $request->getBody();

        $result = $this->model->update($id, $data);

        if ($result) {
            $response->toJSON(200, true, "Horario actualizado correctamente.");
        } else {
            $response->toJSON(500, false, "Error al actualizar el horario.");
        }
    }

    /**
     * Endpoint DELETE /horario/delete/$id
     */
    public function delete($id)
    {
        $response = new Response();
        $result = $this->model->delete($id);

        if ($result) {
            $response->toJSON(200, true, "Registro de horario eliminado correctamente.");
        } else {
            $response->toJSON(500, false, "Error al eliminar el registro.");
        }
    }
}