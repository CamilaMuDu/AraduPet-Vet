<?php

class FacturaController
{
    //getall
    public function index()
    {
        try {
            $response = new Response();
            $factura = new FacturaModel();

            $result = $factura->all();

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

            $result = $factura->get($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
