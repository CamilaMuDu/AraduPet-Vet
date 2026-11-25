import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ReservaService from '../../services/ReservaService';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import 'dayjs/locale/es';

const extraer = (respuesta) =>
  Array.isArray(respuesta.data?.result)
    ? respuesta.data.result
    : [];

const formato = (fecha) => {
  if (!fecha) return '';

  const partes = fecha.substring(0, 10).split('-');

  return partes.length === 3
    ? `${partes[2]}/${partes[1]}/${partes[0]}`
    : fecha;
};

export default function HistorialReservas() {
  const { usuario } = useAuth();
  const location = useLocation();

  const [citas, setCitas] = useState([]);
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    ReservaService.historial()
      .then((respuesta) => {
        setCitas(extraer(respuesta));
      })
      .catch((err) => {
        setError(
          err.response?.data?.result?.mensaje ||
          'No se pudo cargar el historial.'
        );
      });
  }, []);

  const clientes = useMemo(() => {
    return [
      ...new Map(
        citas.map((cita) => [
          cita.id_cliente,
          {
            id: cita.id_cliente,
            nombre: cita.cliente
          }
        ])
      ).values()
    ];
  }, [citas]);

  const filtradas = citas.filter((cita) => {
    const coincideCliente =
      !cliente ||
      String(cita.id_cliente) === String(cliente);

    const coincideFecha =
      !fecha || cita.fecha_cita?.substring(0, 10) === fecha;

    return coincideCliente && coincideFecha;
  });

  const personal = ['Encargado', 'Administrador'].includes(
    usuario?.rol
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
        Historial de reservas
      </Typography>

      {location.state?.mensaje && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {location.state.mensaje}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ mb: 3 }}
      >
        {personal && (
          <TextField
            select
            label="Cliente"
            value={cliente}
            onChange={(event) => setCliente(event.target.value)}
            sx={{ minWidth: 230 }}
          >
            <MenuItem value="">Todos</MenuItem>

            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}

        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="es"
        >
          <DatePicker
            label="Fecha"
            format="DD/MM/YYYY"
            value={fecha ? dayjs(fecha) : null}
            onChange={(nuevaFecha) => {
              setFecha(
                nuevaFecha?.isValid()
                  ? nuevaFecha.format('YYYY-MM-DD')
                  : ''
              );
            }}
            slotProps={{
              field: {
                clearable: true
              },
              textField: {
                size: 'medium',
                sx: {
                  width: {
                    xs: '100%',
                    md: 190
                  }
                }
              }
            }}
          />
        </LocalizationProvider>

        <Box sx={{ flex: 1 }} />

        {personal && (
          <Button
            variant="contained"
            component={Link}
            to="/citas/nueva"
            startIcon={<AddIcon />}
          >
            Nueva reserva
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                'Fecha',
                'Hora',
                'Cliente',
                'Mascota',
                'Servicio',
                'Veterinario',
                'Estado',
                'Detalle'
              ].map((columna) => (
                <TableCell key={columna}>
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtradas.map((cita) => (
              <TableRow key={cita.id_cita}>
                <TableCell>
                  {formato(cita.fecha_cita)}
                </TableCell>

                <TableCell>
                  {cita.hora_inicio?.substring(0, 5)}
                  {' – '}
                  {cita.hora_fin?.substring(0, 5)}
                </TableCell>

                <TableCell>{cita.cliente}</TableCell>
                <TableCell>{cita.mascota}</TableCell>
                <TableCell>{cita.servicio}</TableCell>
                <TableCell>{cita.doctor}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={cita.estado}
                    sx={{
                      bgcolor: cita.color || '#9e9e9e',
                      color: '#fff'
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    component={Link}
                    to={`/reservas/detalle/${cita.id_cita}`}
                  >
                    <VisibilityIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {!filtradas.length && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No se encontraron citas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}