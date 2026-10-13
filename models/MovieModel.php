<?php
class MovieModel
{
    //Conectarse a la BD
    public $enlace;
    //Constructor
    public function __construct()
    {
        $this->enlace = new MySqlConnect();//Conectarse a la BD
    }
   
    //Obtener el listado de peliculas
    public function all()
    {
        try {
            $imagenM=new ImageModel();
            //Consulta SQL
            $vSQL = "SELECT * FROM movie order by title desc;";//Obtener el listado de películas
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Incluir imagenes
            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i < count($vResultado); $i++) { 
                    $vResultado[$i]=$this->get($vResultado[$i]->id);
                }
            }
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
//Obtener una pelicula por su id
    public function get($id)
    {
        try {
            $directorM=new DirectorModel();//Instanciar el modelo de director
            $genreM=new GenreModel();//Instanciar el modelo de genero
            $actorM=new ActorModel();//Instanciar el modelo de actor
            $imagenM=new ImageModel();//Instanciar el modelo de imagen
            $vSql = "SELECT * FROM movie where id=$id;"; //Obtener una película específica
            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if(!empty($vResultado)){//Si se encuentra la película
                $vResultado=$vResultado[0];//Obtener el resultado
                //Imagenes
                $vResultado->imagen=$imagenM->getImageMovie(($vResultado->id));//Obtener la imagen de una película
                //Director
                $director=$directorM->get($vResultado->director_id);//Obtener el director de una película
                $vResultado->director=$director;//Director
                //Generos --genres
                $listaGeneros=$genreM->getGenreMovie($vResultado->id);//Obtener los géneros de una película
                $vResultado->genres=$listaGeneros;//Géneros
                //Actores --actors
                $listaActores=$actorM->getActorMovie($id);//Obtener los actores de una película
                $vResultado->actors=$listaActores;//Actores
            }
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
//Obtener la cantidad de peliculas por genero
    public function getCountByGenre()
    {
        try {
            $vResultado = null;//Inicializar la variable de resultado
            //Consulta sql
            $vSql = "SELECT count(mg.genre_id) as 'Cantidad', g.title as 'Genero'
			FROM genre g, movie_genre mg, movie m
			where mg.movie_id=m.id and mg.genre_id=g.id
			group by mg.genre_id";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);//Retornar la respuesta
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener las peliculas de una tienda de alquiler
    public function moviesByShopRental($idShopRental)
    {
        try {
            $imagenM=new ImageModel();
            //Consulta SQL
            $vSQL = "SELECT m.*, i.price
                    FROM movie m, inventory i
                    where 
                    m.id=i.movie_id
                    and shop_id=$idShopRental
                    order by m.title desc";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            //Incluir imagenes
            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i < count($vResultado); $i++) { 
                    $vResultado[$i]->imagen=$imagenM->getImageMovie(($vResultado[$i]->id));
                }
            }
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
