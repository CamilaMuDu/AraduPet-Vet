<?php

class ExcepcionesHorarioController
{
    private function responder($operacion)
    {
        try {
            $resultado = $operacion();
            (new Response())->toJSON($resultado);
        } catch (InvalidArgumentException $e) {
            (new Response())->status(400)->toJSON(['mensaje' => $e->getMessage()]);
        } catch (DomainException $e) {
            (new Response())->status(409)->toJSON(['mensaje' => $e->getMessage()]);
        } catch (Throwable $e) {
            error_log($e->getMessage());
            (new Response())->status(500)->toJSON(['mensaje' => 'Ocurrió un error al procesar el bloqueo.']);
        }
    }

    public function index()
    {
        $this->responder(function () {
            return ['bloqueos' => (new ExcepcionesHorarioModel())->getAll()];
        });
    }

    public function getByDoctor($idDoctor)
    {
        $this->responder(function () use ($idDoctor) {
            return ['bloqueos' => (new ExcepcionesHorarioModel())->getByDoctor($idDoctor)];
        });
    }

    public function get($id)
    {
        $this->responder(function () use ($id) {
            $bloqueo = (new ExcepcionesHorarioModel())->get($id);
            if ($bloqueo === null) {
                throw new InvalidArgumentException('El bloqueo indicado no existe.');
            }
            return $bloqueo;
        });
    }

    public function create()
    {
        $this->responder(function () {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
                throw new InvalidArgumentException('Los datos JSON son inválidos.');
            }
            return (new ExcepcionesHorarioModel())->create($data);
        });
    }

    public function delete($id)
    {
        $this->responder(function () use ($id) {
            return (new ExcepcionesHorarioModel())->delete($id);
        });
    }
}