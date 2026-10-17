
<?php

class ProductoController
{

   //getAll
    public function index()
    {
        try {
            $response = new Response();
            $productoM = new ProductoModel();
            $result = $productoM->all();
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
            $productoM = new ProductoModel();
            $result = $productoM->get($id);
            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
