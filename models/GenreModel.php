<?php
class GenreModel{
    public $enlace;//
    public function __construct() {
        
        $this->enlace=new MySqlConnect();//Conectarse a la BD
       
    }
    //
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM genre;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

    //Obtener un genero por su id
    public function get($id){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM genre where id=$id"; //Obtener un género específico
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
    
    //Obtener los generos de una pelicula
    public function getGenreMovie($idMovie){
        try {
            //Consulta sql
			$vSql = "SELECT g.id,g.title 
            FROM genre g,movie_genre mg 
            where mg.genre_id=g.id and mg.movie_id=$idMovie";//Obtener los géneros de una película
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
    //Obtener las peliculas de un genero
	public function getMoviesbyGenre($param){
        try {
			$vResultado =null;
			if(!empty($param )){
				$vSql="SELECT m.id, m.lang, m.time, m.title, m.year
				FROM movie_genre mg, movie m
				where mg.movie_id=m.id and mg.genre_id=$param";
				$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			}
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
}
