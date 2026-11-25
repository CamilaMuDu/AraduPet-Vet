import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams } from 'react-router-dom';
import ReservaService from '../../services/ReservaService';

export default function DetalleReserva() {
  const { id } = useParams();

  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;

    setCargando(true);
    setError('');

    ReservaService.detalle(id)
      .then((respuesta) => {
        if (vigente) {
          setCita(respuesta.data?.result || null);
        }
      })
      .catch((err) => {
        if (vigente) {
          setError(
            err.response?.data?.result?.mensaje ||
            'No se pudo consultar el detalle de la reserva.'
          );
        }
      })
      .finally(() => {
        if (vigente) {
          setCargando(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, [id]);

  const mostrarValor = (valor) => {
    if (valor === null || valor === undefined || valor === '') {
      return 'No registrado';
    }

    return valor;
  };

  const formatoFecha = (fecha) => {
    if (!fecha) return 'No registrada';

    const partes = fecha.substring(0, 10).split('-');

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatoHora = (hora) => {
    return hora ? hora.substring(0, 5) : '--:--';
  };

  const campo = (etiqueta, valor, contenidoEspecial = null) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {etiqueta}
      </Typography>

      {contenidoEspecial || (
        <Typography fontWeight="medium">
          {mostrarValor(valor)}
        </Typography>
      )}
    </Box>
  );

  const respuesta = (pregunta, valor) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography fontWeight="medium" sx={{ mb: 0.5 }}>
        {pregunta}
      </Typography>

      <Typography color="text.secondary">
        {valor || 'Sin respuesta'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Button
        component={Link}
        to="/citas"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Volver al historial
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {cargando && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!cargando && !error && !cita && (
        <Alert severity="warning">
          No se encontró la reserva solicitada.
        </Alert>
      )}

      {!cargando && cita && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Detalle de la Reserva N.º {cita.id_cita}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))'
              },
              columnGap: 4,
              rowGap: 3
            }}
          >
            {campo('Cliente', cita.cliente)}

            {campo('Correo electrónico', cita.correo_cliente)}

            {campo('Veterinario', cita.doctor)}

            {campo('Mascota', cita.mascota)}

            {campo('Servicio', cita.servicio)}

            {campo('Fecha', formatoFecha(cita.fecha_cita))}

            {campo(
              'Horario',
              `${formatoHora(cita.hora_inicio)} - ${formatoHora(cita.hora_fin)}`
            )}

            {campo(
              'Estado',
              null,
              <Chip
                label={cita.estado || 'Sin estado'}
                sx={{
                  bgcolor: cita.color || '#9e9e9e',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            color="primary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Información de la Consulta
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))'
              },
              columnGap: 4,
              rowGap: 3
            }}
          >
            {campo('Motivo de consulta', cita.motivo_consulta)}

            {campo('Observaciones', cita.observaciones)}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            color="primary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Cuestionario de la Reserva
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5
            }}
          >
            {respuesta(
              '¿La mascota tiene las vacunas al día?',
              cita.resp_vacunas_al_dia
            )}

            {respuesta(
              '¿Qué síntomas presenta la mascota?',
              cita.resp_sintomas
            )}

            {respuesta(
              '¿Cuál es la dieta actual de la mascota?',
              cita.resp_dieta_actual
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            color="primary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Información de Facturación
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            {campo(
              'Proforma / Factura',
              cita.id_factura
                ? `N.º ${cita.id_factura} - ${cita.estado_factura}`
                : 'Sin factura asociada'
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}