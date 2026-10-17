
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FacturaService from '../../services/FacturaService';

const formatoColones = (valor) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(valor));
};

export function ListaFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    FacturaService.getFacturas()
      .then((response) => {
        const resultado = response.data;

        if (Array.isArray(resultado)) {
          const ordenadas = [...resultado].sort((a, b) => {
            const fechaA = String(a.fecha).replace(' ', 'T');
            const fechaB = String(b.fecha).replace(' ', 'T');

            const diferencia =
              new Date(fechaB).getTime() - new Date(fechaA).getTime();

            return diferencia ||
              Number(b.id_factura) - Number(a.id_factura);
          });

          setFacturas(ordenadas);
        } else {
          setFacturas([]);
        }
      })
      .catch(() => {
        setError('No se pudieron cargar las facturas.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const colorEstado = (estado) => {
    switch (String(estado).trim().toLowerCase()) {
      case 'pagada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'anulada':
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#174A5B',
          textAlign: 'left'
        }}
      >
        Listado de Facturas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && facturas.length === 0 ? (
        <Alert severity="info">
          No hay facturas registradas.
        </Alert>
      ) : !error && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#81D4FA' }}>
              <TableRow>
                <TableCell><strong>N.º Factura</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Detalle</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {facturas.map((factura) => (
                <TableRow hover key={factura.id_factura}>
                  <TableCell>{factura.id_factura}</TableCell>
                  <TableCell>{factura.fecha}</TableCell>
                  <TableCell>{factura.cliente}</TableCell>

                  <TableCell>
                    <Chip
                      label={factura.estado}
                      color={colorEstado(factura.estado)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    {formatoColones(factura.total)}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/facturas/${factura.id_factura}`}
                      color="success"
                      aria-label={`Ver detalle de factura ${factura.id_factura}`}
                      title="Ver detalle"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
