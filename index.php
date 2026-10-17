<?php

// Composer autoloader
require_once 'vendor/autoload.php';

/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/DirectorModel.php";
require_once "models/GenreModel.php";
require_once "models/ImageModel.php";
require_once "models/MovieModel.php";

require_once __DIR__ . "/models/ProductoModel.php";
require_once "models/FacturaModel.php";
require_once "models/CitaModel.php";


/***--- Agregar todos los controladores*/
require_once "controllers/DirectorController.php";
require_once "controllers/GenreController.php";
require_once "controllers/MovieController.php";

require_once __DIR__ . "/controllers/ProductoController.php";
require_once "controllers/FacturaController.php";
require_once "controllers/CitaController.php";


//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();


