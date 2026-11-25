import { useState } from 'react';
import { Alert, Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReservaFormulario from './ReservaFormulario';
export default function RegistroReservaAdmin() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  return <Container maxWidth="lg" sx={{ py: 3 }}>
    {mensaje && <Alert severity="success">{mensaje}</Alert>}
    <ReservaFormulario administrativo alCancelar={() => navigate('/citas')}
      alCrear={datos => { setMensaje(`Reserva ${datos.id_cita} registrada con proforma ${datos.id_factura}.`); navigate('/citas', { state: { mensaje: `Reserva #${datos.id_cita} creada correctamente.` } }); }} />
    <Box sx={{ textAlign: 'center' }}><Button onClick={() => navigate('/citas')}>Volver al historial</Button></Box>
  </Container>;
}
