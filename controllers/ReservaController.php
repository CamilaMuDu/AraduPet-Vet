<?php

class ReservaController
{
    private function actor()
    {
        return UsuarioAuth::verificar(['Cliente','Encargado','Administrador']);
    }

    private function respuesta($datos, int $status = 200): void
    {
        (new Response())->status($status)->toJSON(['result' => $datos, 'status' => $status]);
    }

    private function ejecutar(callable $accion): void
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $this->respuesta($accion(new ReservaModel(), $this->actor()));
        } catch (InvalidArgumentException $e) {
            $this->respuesta(['mensaje' => $e->getMessage()], 422);
        } catch (DomainException $e) {
            $this->respuesta(['mensaje' => $e->getMessage()], 409);
        } catch (Throwable $e) {
            error_log('Reserva: ' . $e->getMessage());
            $this->respuesta(['mensaje' => 'No se pudo procesar la solicitud.'], 500);
        }
    }

    public function index(): void
    {
        $this->ejecutar(fn($m,$actor) => $m->historial($actor));
    }

    public function get($id): void
    {
        $this->ejecutar(function($m,$actor) use ($id) {
            $resultado = $m->detalle($actor, $id);
            if (!$resultado) throw new DomainException('Cita no encontrada o sin permisos.');
            return $resultado;
        });
    }

    public function clientes(): void
    {
        $this->ejecutar(fn($m,$actor) => $m->clientes($actor));
    }

    public function mascotas($idCliente): void
    {
        $this->ejecutar(fn($m,$actor) => $m->mascotas($actor, $idCliente));
    }

    public function disponibilidad($idServicio, $fecha): void
    {
        $this->ejecutar(fn($m,$actor) => $m->disponibilidad($actor, $idServicio, $fecha));
    }

    public function create(): void
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $actor = $this->actor();
            $datos = json_decode(file_get_contents('php://input'), true);
            if (!is_array($datos)) throw new InvalidArgumentException('Se requiere un JSON válido.');
            $resultado = (new ReservaModel())->crear($actor, $datos);
            $this->respuesta($resultado, 201);
        } catch (InvalidArgumentException $e) {
            $this->respuesta(['mensaje' => $e->getMessage()], 422);
        } catch (DomainException $e) {
            $this->respuesta(['mensaje' => $e->getMessage()], 409);
        } catch (Throwable $e) {
            error_log('Reserva create: ' . $e->getMessage());
            $this->respuesta(['mensaje' => 'No se pudo guardar la reserva y su proforma.'], 500);
        }
    }
}
