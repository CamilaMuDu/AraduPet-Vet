<?php

class CitaController
{
    //getAll
    public function index()
    {
        try {
            $response = new Response();
            $cita = new CitaModel();

            $result = $cita->all();

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //getById
    public function get($id)
    {
        try {
            $response = new Response();
            $cita = new CitaModel();

            $result = $cita->get($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Filtrar cita por doctor
    public function getByDoctor($idDoctor)
    {
        try {
            $response = new Response();
            $cita = new CitaModel();

            $result = $cita->getByDoctor($idDoctor);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
