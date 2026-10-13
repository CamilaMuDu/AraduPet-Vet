<?php
//localhost:81/apinombreproyecto/movie
class movie
{
    //GET Obtener el listado de peliculas
    public function index()
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $movieM = new MovieModel;//Instancia del modelo
            $result = $movieM->all();//Acción del modelo a ejecutar
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //GET Obtener una pelicula por su id
    public function get($id)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $movie = new MovieModel();//Instancia del modelo
            $result = $movie->get($id);//Acción del modelo a ejecutar
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //GET Obtener el conteo de peliculas por genero
    public function getCountByGenre($param)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $movie = new MovieModel();//Instancia del modelo
            $result = $movie->getCountByGenre($param);//
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
//Obtener peliculas por tienda
    public function moviesByShopRental($idShopRental)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->moviesByShopRental($idShopRental);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
