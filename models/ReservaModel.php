<?php

class ReservaModel
{
    private MySqlConnect $db;
    private const IMPUESTO = 0.13; 

    public function __construct()
    {
        $this->db = new MySqlConnect();
    }

    private function entero($valor, string $campo): int
    {
        $id = filter_var($valor, FILTER_VALIDATE_INT);
        if ($id === false || $id < 1) {
            throw new InvalidArgumentException("$campo inválido.");
        }
        return $id;
    }

    private function texto($valor, string $campo, int $max, bool $obligatorio = true): string
    {
        if (!is_string($valor)) {
            throw new InvalidArgumentException("$campo debe ser texto.");
        }
        $valor = trim($valor);
        if (($obligatorio && $valor === '') || mb_strlen($valor, 'UTF-8') > $max) {
            throw new InvalidArgumentException("$campo debe tener entre " . ($obligatorio ? 1 : 0) . " y $max caracteres.");
        }
        return $this->db->escapeString($valor);
    }

    private function consultar(string $sql): array
    {
        return $this->db->executeSQL($sql) ?? [];
    }

    private function uno(string $sql): ?object
    {
        return $this->consultar($sql)[0] ?? null;
    }

    private function fechaValida($valor): string
    {
        if (!is_string($valor) || !preg_match('/^\d{4}-\d{2}-\d{2}$/D', $valor)) {
            throw new InvalidArgumentException('Fecha inválida. Utilice YYYY-MM-DD.');
        }
        $fecha = DateTimeImmutable::createFromFormat('!Y-m-d', $valor, new DateTimeZone('America/Costa_Rica'));
        if (!$fecha || $fecha->format('Y-m-d') !== $valor || $valor < (new DateTimeImmutable('now', new DateTimeZone('America/Costa_Rica')))->format('Y-m-d')) {
            throw new InvalidArgumentException('La fecha debe ser válida y no anterior a hoy.');
        }
        return $valor;
    }

    private function horaValida($valor): string
    {
        if (!is_string($valor) || !preg_match('/^(?:[01]\d|2[0-3]):(?:00|15|30|45)(?::00)?$/D', $valor)) {
            throw new InvalidArgumentException('Seleccione una hora disponible, en intervalos de 15 minutos.');
        }
        return substr($valor, 0, 5) . ':00';
    }

    private function minutos(string $hora): int
    {
        $partes = explode(':', $hora);
        return ((int)$partes[0]) * 60 + (int)$partes[1];
    }

    private function comoHora(int $minutos): string
    {
        return sprintf('%02d:%02d:00', intdiv($minutos, 60), $minutos % 60);
    }

    private function doctoresDisponibles($actor): array
    {
        $filtro = '';
        if ($actor->rol === 'Encargado') {
            $id = (int)$actor->id_usuario;
            $filtro = " AND d.id_usuario = $id";
        }
        return $this->consultar("SELECT d.id_doctor FROM doctor d INNER JOIN usuario u ON u.id_usuario=d.id_usuario WHERE d.activo=1 AND u.id_estado_usuario=1 AND u.id_rol=2 $filtro ORDER BY d.id_doctor");
    }

    private function servicio(int $id): object
    {
        $servicio = $this->uno("SELECT id_servicio, precio, duracion_minutos, nombre FROM servicio WHERE id_servicio=$id AND estado=1");
        if (!$servicio || (int)$servicio->duracion_minutos < 1) {
            throw new InvalidArgumentException('El servicio seleccionado no está disponible.');
        }
        return $servicio;
    }

    private function agendaDoctor(int $doctor, string $fecha): array
    {
        $dia = (int)(new DateTimeImmutable($fecha))->format('N');
        return [
            'horarios' => $this->consultar("SELECT hora_apertura,hora_cierre FROM horario_doctor WHERE id_doctor=$doctor AND dia_semana=$dia AND activo=1"),
            'bloqueos' => $this->consultar("SELECT hora_apertura,hora_cierre FROM excepciones_horario WHERE id_doctor=$doctor AND fecha='$fecha'"),
            'citas' => $this->consultar("SELECT hora_inicio,hora_fin FROM cita WHERE id_doctor=$doctor AND fecha_cita='$fecha' AND id_estado IN (1,2)")
        ];
    }

    private function doctorLibre(array $agenda, int $inicio, int $fin): bool
    {
        $enJornada = false;
        foreach ($agenda['horarios'] as $h) {
            if ($this->minutos($h->hora_apertura) <= $inicio && $this->minutos($h->hora_cierre) >= $fin) {
                $enJornada = true;
                break;
            }
        }
        if (!$enJornada) return false;
        foreach (array_merge($agenda['bloqueos'], $agenda['citas']) as $ocupacion) {
            $desde = isset($ocupacion->hora_inicio) ? $ocupacion->hora_inicio : $ocupacion->hora_apertura;
            $hasta = isset($ocupacion->hora_fin) ? $ocupacion->hora_fin : $ocupacion->hora_cierre;
            if ($this->minutos($desde) < $fin && $this->minutos($hasta) > $inicio) return false;
        }
        return true;
    }

    private function opciones($actor, int $idServicio, string $fecha): array
    {
        $duracion = (int)$this->servicio($idServicio)->duracion_minutos;
        $doctores = $this->doctoresDisponibles($actor);
        $agendas = [];
        foreach ($doctores as $d) {
            $idDoctor = (int)$d->id_doctor;
            $agendas[$idDoctor] = $this->agendaDoctor($idDoctor, $fecha);
        }
        $hoy = new DateTimeImmutable('now', new DateTimeZone('America/Costa_Rica'));
        $opciones = [];
        for ($inicio = 0; $inicio + $duracion <= 1440; $inicio += 15) {
            if ($fecha === $hoy->format('Y-m-d') && $inicio <= ((int)$hoy->format('H') * 60 + (int)$hoy->format('i'))) continue;
            $libres = [];
            foreach ($agendas as $idDoctor => $agenda) {
                if ($this->doctorLibre($agenda, $inicio, $inicio + $duracion)) {
                    $libres[] = $idDoctor;
                }
            }
            if ($libres) {
                $opciones[] = [
                    'hora_inicio' => substr($this->comoHora($inicio), 0, 5),
                    'hora_fin' => substr($this->comoHora($inicio + $duracion), 0, 5),
                    'cantidad_veterinarios' => count($libres),
                    '_doctores' => $libres
                ];
            }
        }
        return $opciones;
    }

    public function disponibilidad($actor, $idServicio, $fecha): array
    {
        $id = $this->entero($idServicio, 'Servicio');
        $fecha = $this->fechaValida($fecha);
        $opciones = $this->opciones($actor, $id, $fecha);
        foreach ($opciones as &$opcion) unset($opcion['_doctores']);
        unset($opcion);
        return $opciones;
    }

    public function mascotas($actor, $idCliente): array
    {
        $cliente = $this->entero($idCliente, 'Cliente');
        if ($actor->rol === 'Cliente' && $cliente !== (int)$actor->id_usuario) {
            throw new DomainException('No tiene acceso a las mascotas de otro cliente.');
        }
        return $this->consultar("SELECT id_mascota, nombre, especie, raza FROM mascota WHERE id_cliente=$cliente AND activo=1 ORDER BY nombre");
    }

    public function clientes($actor): array
    {
        if (!in_array($actor->rol, ['Administrador', 'Encargado'], true)) {
            throw new DomainException('Solo el personal autorizado puede consultar clientes.');
        }
        return $this->consultar("SELECT id_usuario, nombre, correo FROM usuario WHERE id_rol=3 AND id_estado_usuario=1 ORDER BY nombre");
    }

    public function historial($actor): array
    {
        $filtro = '';
        if ($actor->rol === 'Cliente') $filtro = ' AND c.id_cliente=' . (int)$actor->id_usuario;
        if ($actor->rol === 'Encargado') $filtro = ' AND d.id_usuario=' . (int)$actor->id_usuario;
        $sql = "SELECT c.id_cita,c.fecha_cita,c.hora_inicio,c.hora_fin,c.id_cliente,
                       u.nombre AS cliente,u.correo AS correo_cliente,m.nombre AS mascota,
                       s.nombre AS servicio,du.nombre AS doctor, ec.nombre AS estado,ec.color,
                       f.id_factura,f.estado AS estado_factura
                FROM cita c INNER JOIN usuario u ON u.id_usuario=c.id_cliente
                INNER JOIN mascota m ON m.id_mascota=c.id_mascota
                INNER JOIN servicio s ON s.id_servicio=c.id_servicio
                INNER JOIN doctor d ON d.id_doctor=c.id_doctor
                INNER JOIN usuario du ON du.id_usuario=d.id_usuario
                INNER JOIN estado_cita ec ON ec.id_estado=c.id_estado
                LEFT JOIN factura f ON f.id_cita=c.id_cita WHERE 1=1 $filtro
                ORDER BY c.fecha_cita DESC,c.hora_inicio DESC";
        $resultado = $this->consultar($sql);
        usort($resultado, fn($a,$b) => strcmp($b->fecha_cita.' '.$b->hora_inicio, $a->fecha_cita.' '.$a->hora_inicio));
        return $resultado;
    }

    public function detalle($actor, $idCita): ?object
    {
        $id = $this->entero($idCita, 'Cita');
        foreach ($this->historial($actor) as $c) {
            if ((int)$c->id_cita === $id) {
                $r = $this->uno("SELECT motivo_consulta,resp_vacunas_al_dia,resp_sintomas,resp_dieta_actual,observaciones FROM cita WHERE id_cita=$id");
                if ($r) foreach ($r as $k=>$v) $c->$k = $v;
                return $c;
            }
        }
        return null;
    }

    public function crear($actor, array $datos): array
    {
        $idServicio = $this->entero($datos['id_servicio'] ?? null, 'Servicio');
        $idMascota = $this->entero($datos['id_mascota'] ?? null, 'Mascota');
        $idCliente = $actor->rol === 'Cliente'
            ? (int)$actor->id_usuario
            : $this->entero($datos['id_cliente'] ?? null, 'Cliente');
        $fecha = $this->fechaValida($datos['fecha'] ?? null);
        $hora = $this->horaValida($datos['hora_inicio'] ?? null);
        $motivo = $this->texto($datos['motivo_consulta'] ?? '', 'Motivo de consulta', 100);
        $vacunas = $this->texto($datos['resp_vacunas_al_dia'] ?? '', 'Vacunas al día', 10);
        $sintomas = $this->texto($datos['resp_sintomas'] ?? '', 'Síntomas', 100);
        $dieta = $this->texto($datos['resp_dieta_actual'] ?? '', 'Dieta actual', 150);
        $mascota = $this->uno("SELECT id_mascota FROM mascota WHERE id_mascota=$idMascota AND id_cliente=$idCliente AND activo=1");
        if (!$mascota) throw new DomainException('La mascota no pertenece al cliente o no está activa.');
        $cliente = $this->uno("SELECT id_usuario FROM usuario WHERE id_usuario=$idCliente AND id_rol=3 AND id_estado_usuario=1");
        if (!$cliente) throw new DomainException('El cliente no está habilitado.');
        $this->db->beginTransaction();
        try {
            
            $bloqueo = $this->uno("SELECT GET_LOCK('aradupetvet_reservas',10) AS adquirido");
            if (!$bloqueo || (int)$bloqueo->adquirido !== 1) {
                throw new RuntimeException('No se pudo bloquear la agenda. Vuelva a intentarlo.');
            }
            $servicio = $this->servicio($idServicio);
            $opciones = $this->opciones($actor, $idServicio, $fecha);
            $libres = [];
            foreach ($opciones as $opcion) {
                if ($opcion['hora_inicio'] === substr($hora,0,5)) {
                    $libres = $opcion['_doctores'];
                    break;
                }
            }
            if (!$libres) throw new DomainException('La hora seleccionada ya no está disponible.');
            
            $cargas = [];
            foreach ($libres as $idDoctor) {
                $r = $this->uno("SELECT COUNT(*) AS total FROM cita WHERE id_doctor=$idDoctor AND fecha_cita='$fecha' AND id_estado IN (1,2)");
                $cargas[$idDoctor] = (int)($r->total ?? 0);
            }
            usort($libres, fn($a,$b) => ($cargas[$a] <=> $cargas[$b]) ?: ($a <=> $b));
            $idDoctor = $libres[0];
            $fin = $this->comoHora($this->minutos($hora) + (int)$servicio->duracion_minutos);
            $sql = "INSERT INTO cita(id_cliente,id_mascota,id_servicio,id_doctor,id_estado,fecha_cita,hora_inicio,hora_fin,motivo_consulta,resp_vacunas_al_dia,resp_sintomas,resp_dieta_actual,notificado)
                    VALUES($idCliente,$idMascota,$idServicio,$idDoctor,1,'$fecha','$hora','$fin','$motivo','$vacunas','$sintomas','$dieta',0)";
            $idCita = (int)$this->db->executeSQL_DML_last($sql);
            if ($idCita < 1) throw new RuntimeException('No se pudo registrar la cita.');
            $subtotal = round((float)$servicio->precio,2);
            $impuesto = round($subtotal * self::IMPUESTO, 2);
            $total = round($subtotal + $impuesto,2);
            $encargado = $actor->rol === 'Cliente' ? 'NULL' : (int)$actor->id_usuario;
            $idFactura = (int)$this->db->executeSQL_DML_last("INSERT INTO factura (id_cliente,id_doctor,id_encargado,id_cita,estado,estado_pago,subtotal,impuesto,total) VALUES($idCliente,$idDoctor,$encargado,$idCita,'Proforma','Pendiente',$subtotal,$impuesto,$total)");
            if ($idFactura < 1) throw new RuntimeException('No se pudo registrar la proforma.');
            $lineas = (int)$this->db->executeSQL_DML("INSERT INTO detalle_factura(id_factura,id_servicio,id_producto,cantidad,precio_unitario,impuesto,subtotal,total) VALUES ($idFactura,$idServicio,NULL,1,$subtotal,$impuesto,$subtotal,$total)");
            if ($lineas !== 1) throw new RuntimeException('No se pudo registrar el detalle de la proforma.');
            $this->db->commit();
            return ['id_cita'=>$idCita,'id_factura'=>$idFactura,'id_doctor'=>$idDoctor,'estado'=>'Pendiente','estado_factura'=>'Proforma'];
        } catch (Throwable $e) {
            $this->db->rollback();
            throw $e;
        }
    }
}
