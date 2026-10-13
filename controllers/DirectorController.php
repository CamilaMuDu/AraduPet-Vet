<?php
class director
{
    //Metodo para obtener el listado de directores
    public function index()
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new DirectorModel();//Instanciar el modelo de director
            $result = $genero->all();//Obtener el listado de directores
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Metodo para obtener un director por su id
    public function get($param)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new DirectorModel();//Instanciar el modelo de director
            $result = $genero->get($param);//Obtener un director por su id
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
