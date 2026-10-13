<?php
class genre
{
    //Metodo para obtener el listado de generos
    public function index()
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new GenreModel();//Instanciar el modelo de genero
            $result = $genero->all();//Obtener el listado de generos
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Metodo para obtener un genero por su id
    public function get($param)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new GenreModel();//Instanciar el modelo de genero
            $result = $genero->get($param);//Obtener un genero por su id
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Metodo para obtener un genero por su id (otra forma de hacerlo)
    public function getGenreMovie($id)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new GenreModel();//Instanciar el modelo de genero
            $result = $genero->getGenreMovie($id);//Obtener un genero por su id
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Metodo para obtener las peliculas por genero
    public function getMoviesbyGenre($param)
    {
        try {
            $response = new Response();//Instanciar la clase de respuesta
            $genero = new GenreModel();//Instanciar el modelo de genero
            $result = $genero->getMoviesbyGenre($param);//Obtener las peliculas por genero
            $response->toJSON($result);//Dar respuesta
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
