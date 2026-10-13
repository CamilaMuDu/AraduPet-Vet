<?php
class DirectorModel
{
    public $enlace;//Conectarse a la BD
    public function __construct()
    {
        $this->enlace = new MySqlConnect();//Conectarse a la BD
    }
    //Obtener el listado de directores
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM director;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener un director por su id
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM director where id=$id"; //Obtener un director específico
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }
}
