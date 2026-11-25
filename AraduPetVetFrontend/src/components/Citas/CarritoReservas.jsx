import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import ReservaFormulario from './ReservaFormulario';

const crcs = (valor) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC'
  }).format(Number(valor));

export default function CarritoReservas() {
  const { cart, removeItem, getTotal } = useCart();

  const [seleccionado, setSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/servicios"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Volver al catálogo
      </Button>

      <Typography
        variant="h4"
        color="primary"
        sx={{ mb: 3 }}
      >
        Carrito de servicios
      </Typography>

      {mensaje && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setMensaje('')}
        >
          {mensaje}
        </Alert>
      )}

      {seleccionado ? (
        <ReservaFormulario
          servicioInicial={seleccionado}
          alCancelar={() => setSeleccionado(null)}
          alCrear={() => {
            removeItem(seleccionado.id_servicio);

            setMensaje('Reserva registrada correctamente.');

            setSeleccionado(null);
          }}
        />
      ) : (
        <Stack spacing={2}>
          {cart.length === 0 && (
            <Alert severity="info">
              Tu carrito está vacío. Agrega un servicio desde el catálogo.
            </Alert>
          )}

          {cart.map((item) => (
            <Card key={item.id_servicio}>
              <CardContent>
                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row'
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography fontWeight="bold">
                      {item.nombre}
                    </Typography>

                    <Typography color="text.secondary">
                      {item.duracion_minutos} minutos
                      {' · '}
                      {crcs(item.precio)}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setMensaje('');
                        setSeleccionado(item);
                      }}
                    >
                      Agendar este servicio
                    </Button>

                    <IconButton
                      color="error"
                      aria-label="Quitar servicio"
                      onClick={() =>
                        removeItem(item.id_servicio)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}

          {!!cart.length && (
            <Typography
              variant="h6"
              textAlign="right"
            >
              Total estimado de servicios:
              {' '}
              {crcs(getTotal(cart))}
            </Typography>
          )}
        </Stack>
      )}
    </Container>
  );
}
