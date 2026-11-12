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

    //get categoria producto
    public function categorias()
    {
        try{
            $preductoM = new ProductoModel();
            $result = $preductoM->getCategorias();

            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Crear producto
    public function create()
    {
        try {
            $data = $_POST;

            $imagen = $_FILES['imagen'] ?? null;

            $productoM = new ProductoModel();
            $result = $productoM->create($data, $imagen);

            $response = new Response();
            $response->toJSON($result);

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    // Actualizar producto
    public function update($id)
    {
        try {
            $data = $_POST;
            $imagen = $_FILES['imagen'] ?? null;

            $productoM = new ProductoModel();
            $result = $productoM->update($id, $data, $imagen);

            $response = new Response();
            $response->toJSON($result);
        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }

    // Guardar imagen de un producto
    public function guardarImagen($id)
    {
        try {
            $imagen = $_FILES['imagen'] ?? null;

            $productoM = new ProductoModel();
            $resultado = $productoM->guardarImagen($id, $imagen);

            $response = new Response();
            $response->toJSON($resultado);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Eliminar producto 
    public function delete($id)
    {
        try {
            $productoModel = new ProductoModel();
            $resultado = $productoModel->delete($id);

            $response = new Response();
            $response->toJSON($resultado);

        } catch (Throwable $e) {
            HandleException::logException($e);
            throw $e;
        }
    }
}
