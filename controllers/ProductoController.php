
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

    //post producto 
    public function create()
    {
        try{
            $data = json_decode(file_get_contents("php://input"), true);

            if(!is_array($data) || json_last_error() !== JSON_ERROR_NONE){
                throw new InvalidArgumentException("El JSON enviado no es valido");
            }

            $prodctoM = new ProductoModel();
            $result = $prodctoM->create($data);

            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //put actualizar producto
    public function update($id)
    {
        try{
            $data = json_decode(file_get_contents("php://input"), true);

            if(!is_array($data) || json_last_error() !== JSON_ERROR_NONE){
                throw new InvalidArgumentException("El JSON enviado no es valido");
            }

            $prodctoM = new ProductoModel();
            $result = $prodctoM->update($id, $data);

            $response = new Response();
            $response->toJSON($result);
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
