<?php
class ImageModel
{
    private $upload_path = 'uploads/';  //Ruta de subida de las imagenes
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif'); //Extensiones permitidas

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect(); //Conectarse a la BD
    }
    //Obtener una imagen de una pelicula
    public function getImageMovie($idMovie)
    {
        try {
            
            //Consulta sql
            $vSql = "SELECT * FROM movie_image where movie_id=$idMovie"; //Obtener imagenes de una pelicula

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado)) {
                // Retornar el objeto
                return $vResultado[0];
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
