<?php

class FacturaModel
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
                        f.id_factura,
                        f.fecha,
                        f.estado,
                        f.total,
                        u.nombre AS cliente
                    FROM factura f
                    INNER JOIN usuario u
                        ON f.id_cliente = u.id_usuario
                    ORDER BY f.fecha DESC, f.id_factura DESC";

            return $this->enlace->executeSQL($vSql);

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
                    "El ID de la factura no es válido"
                );
            }
            
            $vSql = "SELECT
                        f.id_factura,
                        f.id_cliente,
                        u.nombre AS cliente,
                        u.identificacion,
                        u.telefono,
                        u.correo,
                        u.direccion,
                        f.id_doctor,
                        ud.nombre AS doctor,
                        f.id_cita,
                        f.fecha,
                        f.estado,
                        f.subtotal,
                        f.impuesto,
                        f.total
                    FROM factura f
                    INNER JOIN usuario u
                        ON f.id_cliente = u.id_usuario
                    LEFT JOIN doctor d
                        ON f.id_doctor = d.id_doctor
                    LEFT JOIN usuario ud
                        ON d.id_usuario = ud.id_usuario
                    WHERE f.id_factura = $id";

            $resultado = $this->enlace->executeSQL($vSql);

            if (empty($resultado)) {
                return null;
            }

            $factura = $resultado[0];

            $vSqlDetalle = "SELECT
                                df.id_detalle,
                                df.id_producto,
                                df.id_servicio,
                                CASE
                                    WHEN df.id_producto IS NOT NULL
                                        THEN p.nombre
                                    ELSE s.nombre
                                END AS nombre,
                                CASE
                                    WHEN df.id_producto IS NOT NULL
                                        THEN 'Producto'
                                    ELSE 'Servicio'
                                END AS tipo,
                                df.cantidad,
                                df.precio_unitario,
                                df.subtotal,
                                df.impuesto,
                                df.total
                            FROM detalle_factura df
                            LEFT JOIN producto p
                                ON df.id_producto = p.id_producto
                            LEFT JOIN servicio s
                                ON df.id_servicio = s.id_servicio
                            WHERE df.id_factura = $id
                            ORDER BY df.id_detalle DESC";

            $factura->detalles = $this->enlace->executeSQL($vSqlDetalle);

            return $factura;

        } catch (Exception $e) {
            handleException($e);
        }
    }
}