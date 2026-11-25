import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import * as yup from 'yup';

import { useAuth } from '../../context/AuthContext';
import ReservaService from '../../services/ReservaService';
import ServiciosService from '../../services/ServiciosService';

const esquema = yup.object({
  id_cliente: yup
    .number()
    .integer()
    .positive()
    .required('Seleccione un cliente.'),

  id_mascota: yup
    .number()
    .integer()
    .positive()
    .required('Seleccione una mascota.'),

  id_servicio: yup
    .number()
    .integer()
    .positive()
    .required('Seleccione un servicio.'),

  fecha: yup
    .string()
    .required('Seleccione una fecha.')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida.')
    .test(
      'vigente',
      'La fecha no puede ser anterior a hoy.',
      (valor) => !valor || !dayjs(valor).isBefore(dayjs(), 'day')
    ),

  hora_inicio: yup
    .string()
    .required('Seleccione una hora disponible.'),

  motivo_consulta: yup
    .string()
    .trim()
    .required('Indique el motivo.')
    .max(100),

  resp_vacunas_al_dia: yup
    .string()
    .required('Indique si tiene vacunas al día.'),

  resp_sintomas: yup
    .string()
    .trim()
    .required(
      'Describa los síntomas; si no hay, escriba Ninguno.'
    )
    .max(100),

  resp_dieta_actual: yup
    .string()
    .trim()
    .required('Indique la dieta actual.')
    .max(150)
});

const lista = (response) => {
  const data = response.data?.result ?? response.data;
  return Array.isArray(data) ? data : [];
};

const mensajeError = (err) =>
  err.response?.data?.result?.mensaje ||
  err.response?.data?.mensaje ||
  err.message ||
  'Error de registro';

const formatoCRC = (valor) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC'
  }).format(Number(valor));

export default function ReservaFormulario({
  servicioInicial = null,
  alCrear,
  alCancelar,
  administrativo = false
}) {
  const { usuario } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horas, setHoras] = useState([]);

  const [cargandoHoras, setCargandoHoras] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});

  const [form, setForm] = useState({
    id_cliente:
      usuario?.rol === 'Cliente'
        ? Number(usuario.id_usuario)
        : '',

    id_mascota: '',
    id_servicio: servicioInicial?.id_servicio || '',
    fecha: '',
    hora_inicio: '',
    motivo_consulta: '',
    resp_vacunas_al_dia: '',
    resp_sintomas: '',
    resp_dieta_actual: ''
  });

  const actualizar = (campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,

      ...(campo === 'id_cliente'
        ? { id_mascota: '' }
        : {}),

      ...(['fecha', 'id_servicio'].includes(campo)
        ? { hora_inicio: '' }
        : {})
    }));

    setErrores((actual) => ({
      ...actual,
      [campo]: ''
    }));

    setError('');
  };

  useEffect(() => {
    if (administrativo) {
      ReservaService.clientes()
        .then((respuesta) => {
          setClientes(lista(respuesta));
        })
        .catch((err) => {
          setError(mensajeError(err));
        });
    }

    if (!servicioInicial) {
      ServiciosService.getServicios()
        .then((respuesta) => {
          const data =
            respuesta.data?.results ??
            respuesta.data?.result ??
            respuesta.data;

          setServicios(
            Array.isArray(data)
              ? data.filter((s) => Number(s.estado) === 1)
              : []
          );
        })
        .catch((err) => {
          setError(mensajeError(err));
        });
    }
  }, [administrativo, servicioInicial]);

  useEffect(() => {
    if (!form.id_cliente) {
      setMascotas([]);
      return;
    }

    let vigente = true;

    ReservaService.mascotas(form.id_cliente)
      .then((respuesta) => {
        if (vigente) {
          setMascotas(lista(respuesta));
        }
      })
      .catch((err) => {
        if (vigente) {
          setError(mensajeError(err));
        }
      });

    return () => {
      vigente = false;
    };
  }, [form.id_cliente]);

  useEffect(() => {
    if (!form.id_servicio || !form.fecha) {
      setHoras([]);
      return;
    }

    let vigente = true;

    setCargandoHoras(true);
    setHoras([]);

    ReservaService.disponibilidad(
      form.id_servicio,
      form.fecha
    )
      .then((respuesta) => {
        if (vigente) {
          setHoras(lista(respuesta));
        }
      })
      .catch((err) => {
        if (vigente) {
          setError(mensajeError(err));
        }
      })
      .finally(() => {
        if (vigente) {
          setCargandoHoras(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, [form.id_servicio, form.fecha]);

  const servicio = useMemo(
    () =>
      servicioInicial ||
      servicios.find(
        (s) =>
          Number(s.id_servicio) ===
          Number(form.id_servicio)
      ),
    [servicioInicial, servicios, form.id_servicio]
  );

  const horaElegida = horas.find(
    (hora) => hora.hora_inicio === form.hora_inicio
  );

  async function guardar(event) {
    event.preventDefault();

    if (guardando) return;

    setErrores({});
    setError('');

    try {
      await esquema.validate(form, {
        abortEarly: false
      });

      setGuardando(true);

      const respuesta = await ReservaService.crear(form);

      alCrear?.(respuesta.data?.result);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const nuevosErrores = {};

        err.inner.forEach((item) => {
          if (
            item.path &&
            !nuevosErrores[item.path]
          ) {
            nuevosErrores[item.path] = item.message;
          }
        });

        setErrores(nuevosErrores);
      } else {
        setError(mensajeError(err));
      }
    } finally {
      setGuardando(false);
    }
  }

  const campo = (nombre, etiqueta, multiline = false) => (
    <TextField
      label={etiqueta}
      fullWidth
      required
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      value={form[nombre]}
      onChange={(event) =>
        actualizar(nombre, event.target.value)
      }
      error={!!errores[nombre]}
      helperText={errores[nombre] || ''}
      inputProps={{
        maxLength:
          nombre === 'resp_dieta_actual'
            ? 150
            : 100
      }}
    />
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 850,
        mx: 'auto',
        my: 3
      }}
    >
      <Typography
        variant="h5"
        color="primary"
        sx={{ mb: 3 }}
      >
        Registrar nueva reserva
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={guardar}>
        <Stack spacing={2.5}>
          {administrativo ? (
            <FormControl
              fullWidth
              error={!!errores.id_cliente}
            >
              <InputLabel>Cliente</InputLabel>

              <Select
                value={form.id_cliente}
                label="Cliente"
                onChange={(event) =>
                  actualizar(
                    'id_cliente',
                    event.target.value
                  )
                }
              >
                {clientes.map((cliente) => (
                  <MenuItem
                    value={cliente.id_usuario}
                    key={cliente.id_usuario}
                  >
                    {cliente.nombre} — {cliente.correo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Cliente"
              value={`${usuario?.nombre || ''} (${usuario?.correo || ''})`}
              disabled
              fullWidth
            />
          )}

          <FormControl
            fullWidth
            error={!!errores.id_mascota}
          >
            <InputLabel>Mascota</InputLabel>

            <Select
              label="Mascota"
              value={form.id_mascota}
              onChange={(event) =>
                actualizar(
                  'id_mascota',
                  event.target.value
                )
              }
            >
              {mascotas.map((mascota) => (
                <MenuItem
                  key={mascota.id_mascota}
                  value={mascota.id_mascota}
                >
                  {mascota.nombre} ({mascota.especie})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {servicioInicial ? (
            <TextField
              label="Servicio"
              value={`${servicioInicial.nombre} — ${servicioInicial.duracion_minutos} min`}
              disabled
            />
          ) : (
            <FormControl
              fullWidth
              error={!!errores.id_servicio}
            >
              <InputLabel>Servicio</InputLabel>

              <Select
                label="Servicio"
                value={form.id_servicio}
                onChange={(event) =>
                  actualizar(
                    'id_servicio',
                    event.target.value
                  )
                }
              >
                {servicios.map((servicio) => (
                  <MenuItem
                    key={servicio.id_servicio}
                    value={servicio.id_servicio}
                  >
                    {servicio.nombre} — {servicio.duracion_minutos} min
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {servicio && (
            <Alert severity="info">
              Duración: {servicio.duracion_minutos} minutos
              {' · '}
              Precio: {formatoCRC(servicio.precio)}
            </Alert>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de la cita"
              disablePast
              format="DD/MM/YYYY"
              value={
                form.fecha
                  ? dayjs(form.fecha)
                  : null
              }
              onChange={(valor) =>
                actualizar(
                  'fecha',
                  valor?.isValid()
                    ? valor.format('YYYY-MM-DD')
                    : ''
                )
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errores.fecha,
                  helperText: errores.fecha
                }
              }}
            />
          </LocalizationProvider>

          <FormControl
            fullWidth
            error={!!errores.hora_inicio}
            disabled={
              !form.fecha ||
              !form.id_servicio ||
              cargandoHoras
            }
          >
            <InputLabel>Hora disponible</InputLabel>

            <Select
              label="Hora disponible"
              value={form.hora_inicio}
              onChange={(event) =>
                actualizar(
                  'hora_inicio',
                  event.target.value
                )
              }
            >
              {horas.map((hora) => (
                <MenuItem
                  key={hora.hora_inicio}
                  value={hora.hora_inicio}
                >
                  {hora.hora_inicio} – {hora.hora_fin}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {cargandoHoras && (
            <CircularProgress size={22} />
          )}

          {!!form.fecha &&
            !cargandoHoras &&
            !horas.length && (
              <Alert severity="warning">
                No hay horas disponibles para este servicio y fecha.
              </Alert>
            )}

          {horaElegida && (
            <Alert severity="success">
              Hora final calculada: {horaElegida.hora_fin}
            </Alert>
          )}

          {campo(
            'motivo_consulta',
            'Motivo de consulta'
          )}

          <FormControl
            fullWidth
            error={!!errores.resp_vacunas_al_dia}
          >
            <InputLabel>¿Vacunas al día?</InputLabel>

            <Select
              label="¿Vacunas al día?"
              value={form.resp_vacunas_al_dia}
              onChange={(event) =>
                actualizar(
                  'resp_vacunas_al_dia',
                  event.target.value
                )
              }
            >
              <MenuItem value="Sí">Sí</MenuItem>
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="No sabe">No sabe</MenuItem>
            </Select>
          </FormControl>

          {campo(
            'resp_sintomas',
            '¿Qué síntomas presenta?',
            true
          )}

          {campo(
            'resp_dieta_actual',
            '¿Cuál es su dieta actual?',
            true
          )}

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={alCancelar}
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={guardando || !horas.length}
            >
              {guardando
                ? 'Registrando...'
                : 'Confirmar reserva'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}