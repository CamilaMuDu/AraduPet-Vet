
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useParams } from 'react-router-dom';
import CitasService from '../../services/CitasService';

export default function DetalleCita() {
  const { id } = useParams();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    CitasService.getCitaById(id)
      .then((response) => {
        setCita(response.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Error al cargar la cita: {error}
        </Alert>
      </Box>
    );
  }

  if (!cita) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          No se encontró la cita.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Button
        component={RouterLink}
        to="/citas"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Volver a citas
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Detalle de la Cita N.º {cita.id_cita}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary">
              Doctor
            </Typography>
            <Typography fontWeight="bold">
              {cita.doctor || 'No asignado'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary">
              Mascota
            </Typography>
            <Typography fontWeight="bold">
              {cita.mascota || 'No registrada'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary">
              Servicio
            </Typography>
            <Typography fontWeight="bold">
              {cita.servicio || 'No registrado'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary">
              Fecha
            </Typography>
            <Typography fontWeight="bold">
              {cita.fecha_cita}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary">
              Horario
            </Typography>
            <Typography fontWeight="bold">
              {cita.hora_inicio} - {cita.hora_fin}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Estado
            </Typography>
            <Chip
              label={cita.estado || 'Sin estado'}
              sx={{
                backgroundColor: cita.color || '#9e9e9e',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Cuestionario de la Reserva
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography fontWeight="bold">
            ¿La mascota tiene las vacunas al día?
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {cita.resp_vacunas_al_dia || 'Sin respuesta'}
          </Typography>

          <Typography fontWeight="bold">
            ¿Qué síntomas presenta la mascota?
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {cita.resp_sintomas || 'Sin respuesta'}
          </Typography>

          <Typography fontWeight="bold">
            ¿Cuál es la dieta actual de la mascota?
          </Typography>
          <Typography>
            {cita.resp_dieta_actual || 'Sin respuesta'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
