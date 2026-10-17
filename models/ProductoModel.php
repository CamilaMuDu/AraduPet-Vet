<?php

class ProductoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    //getAll
    public function all()
    {
        try {         
            $vSql = "SELECT
                        p.id_producto,
                        p.nombre,
                        p.precio,
                        p.marca,
                        p.imagen_url
                    FROM producto p
                    WHERE p.estado = 1
                    ORDER BY p.nombre ASC";

            $vResultado = $this->enlace->executeSQL($vSql);

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }

    //getById
    public function get($id)
    {
        try {
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if ($id === false || $id <= 0) {
                throw new InvalidArgumentException(
                    "El ID del producto no es válido"
                );
            }

            $vSql = "SELECT
                        p.id_producto,
                        p.nombre,
                        p.descripcion,
                        p.imagen_url,
                        p.precio,
                        p.stock,
                        p.marca,
                        p.presentacion,
                        p.estado,
                        c.id_categoria,
                        c.nombre AS categoria
                     FROM producto p
                     INNER JOIN categoria_producto c
                         ON p.id_categoria = c.id_categoria
                     WHERE p.id_producto = $id";

            $vResultado = $this->enlace->executeSQL($vSql);

            if (!empty($vResultado)) {
                return $vResultado[0];
            }

            return null;

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
