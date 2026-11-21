import VisibilityIcon from '@mui/icons-material/Visibility';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CitasService from '../../services/CitasService';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState('todos');
  const doctores = [...new Set(
    citas.map((cita) => cita.doctor).filter(Boolean)
  )].sort();

  const citasFiltradas = doctorSeleccionado === 'todos'
    ? citas
    : citas.filter((cita) => cita.doctor === doctorSeleccionado);

  useEffect(() => {
    CitasService.getCitas()
      .then((response) => {
        setCitas(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ p: 4 }}><Typography>Cargando citas...</Typography></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">Error al cargar: {error}</Alert></Box>;

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
        Historial de Reservas por Doctor
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 280 }}>
          <InputLabel id="filtro-doctor-label">
            Filtrar por veterinario
          </InputLabel>

          <Select
            labelId="filtro-doctor-label"
            value={doctorSeleccionado}
            label="Filtrar por veterinario"
            onChange={(event) => setDoctorSeleccionado(event.target.value)}
          >
            <MenuItem value="todos">
              Todos los veterinarios
            </MenuItem>

            {doctores.map((doctor) => (
              <MenuItem key={doctor} value={doctor}>
                {doctor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Fecha y Horario</TableCell>
              <TableCell>Mascota</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Detalle</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {citasFiltradas.length > 0 ? (
              citasFiltradas.map((cita) => (
                <TableRow key={cita.id_cita} hover>
                  {/* Doctor */}
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {cita.doctor || 'Dr. No asignado'}
                    </Typography>
                  </TableCell>

                  {/* Fecha y Horario */}
                  <TableCell>
                    {cita.fecha_cita}
                    <Typography variant="body2" color="text.secondary">
                      {cita.hora_inicio} - {cita.hora_fin}
                    </Typography>
                  </TableCell>

                  {/* Mascota */}
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {cita.mascota}
                    </Typography>
                  </TableCell>

                  {/* Servicio */}
                  <TableCell>
                    {cita.servicio}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Chip
                      label={cita.estado}
                      size="small"
                      sx={{
                        backgroundColor: cita.color || '#e0e0e0',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>

                  {/* Detalle */}
                  <TableCell>
                    <Button
                      component={RouterLink}
                      to={`/citas/detalle/${cita.id_cita}`}
                      color="primary"
                      size="small"
                      aria-label={`Ver detalle de la cita ${cita.id_cita}`}
                      sx={{ minWidth: 'auto' }}
                    >
                      <VisibilityIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay reservas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}