import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FacturaService from '../../services/FacturaService';
import { useAuth } from '../../context/AuthContext';

const formatoColones = (valor) => {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(valor));
};

const formatoFecha = (valor) => {
    if (!valor) return 'No registrada';

    const fecha = new Date(valor.replace(' ', 'T'));

    return new Intl.DateTimeFormat('es-CR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(fecha);
};

export function DetalleFactura() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setFactura(null);
            setError('Debe iniciar sesión.');
            setLoading(false);
            return;
        }

        let activo = true;

        setLoading(true);
        setError('');
        setFactura(null);

        FacturaService.getFacturaById(id, token)
            .then((response) => {
                if (activo) {
                    setFactura(response.data);
                }
            })
            .catch((error) => {
                if (!activo) return;

                if (error.response?.status === 404) {
                    setError('La factura solicitada no está disponible.');
                } else {
                    setError(
                        error.response?.data?.result ||
                        'No se pudo cargar la factura.'
                    );
                }
            })
            .finally(() => {
                if (activo) {
                    setLoading(false);
                }
            });

        return () => {
            activo = false;
        };

    }, [id, token]);

    const colorEstado = (estado) => {
        switch (String(estado).trim().toLowerCase()) {
            case 'facturado':
            case 'pagada':
                return 'success';

            case 'proforma':
                return 'info';

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

    if (error || !factura) {
        return (
            <Container sx={{ mt: 6 }}>
                <Alert severity="error">
                    {error || 'Factura no encontrada.'}
                </Alert>
                <Button
                    sx={{ mt: 3 }}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/facturas')}
                >
                    Regresar
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 6 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 4
                    }}
                >
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                color: '#174A5B',
                                fontWeight: 'bold'
                            }}
                        >
                            {factura.estado === 'Proforma' ? 'Proforma' : 'Factura'}
                            {' N.º '}{factura.id_factura}
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', mt: 1 }}
                        >
                            AraduPet Veterinaria
                        </Typography>
                    </Box>

                    <Box
                        component="img"
                        src="/imagen/logo/logoAradupet.jpeg"
                        alt="Logo de AraduPet Veterinaria"
                        sx={{
                            width: 190,
                            maxHeight: 150,
                            objectFit: 'contain'
                        }}
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3} sx={{ textAlign: 'left' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Cliente:</strong> {factura.cliente}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Identificación:</strong> {factura.identificacion}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Teléfono:</strong> {factura.telefono}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Correo:</strong> {factura.correo}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Veterinario:</strong> {factura.doctor || 'No asignado'}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Encargado:</strong>{' '}
                            {factura.encargado || 'No registrado'}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Dirección:</strong> {factura.direccion}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={{ mb: 1 }}>
                            <strong>Fecha:</strong> {formatoFecha(factura.fecha)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight="bold">Estado:</Typography>
                            <Chip
                                label={factura.estado}
                                color={colorEstado(factura.estado)}
                                size="small"
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 2
                        }}>
                            <Typography fontWeight="bold">
                                Estado de pago:
                            </Typography>

                            <Chip
                                label={factura.estado_pago || 'No aplica'}
                                color={colorEstado(factura.estado_pago)}
                                size="small"
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        color: '#174A5B',
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }}
                >
                    Productos y servicios
                </Typography>

                <TableContainer>
                    <Table sx={{ minWidth: 780 }}>
                        <TableHead sx={{ backgroundColor: '#81D4FA' }}>
                            <TableRow>
                                <TableCell><strong>Código</strong></TableCell>
                                <TableCell><strong>Descripción</strong></TableCell>
                                <TableCell align="center"><strong>Cantidad</strong></TableCell>
                                <TableCell align="right"><strong>Precio unitario</strong></TableCell>
                                <TableCell align="right"><strong>Subtotal</strong></TableCell>
                                <TableCell align="right"><strong>IVA</strong></TableCell>
                                <TableCell align="right"><strong>Total</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(factura.detalles) &&
                                factura.detalles.length > 0 ? (
                                factura.detalles.map((detalle) => {
                                    const codigo = detalle.id_producto != null
                                        ? `P-${detalle.id_producto}`
                                        : `S-${detalle.id_servicio}`;

                                    return (
                                        <TableRow key={detalle.id_detalle}>
                                            <TableCell>{codigo}</TableCell>
                                            <TableCell>{detalle.nombre}</TableCell>
                                            <TableCell align="center">
                                                {detalle.cantidad}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatoColones(detalle.precio_unitario)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatoColones(detalle.subtotal)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatoColones(detalle.impuesto)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatoColones(detalle.total)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No hay productos o servicios registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    sx={{
                        mt: 4,
                        ml: 'auto',
                        maxWidth: 350,
                        textAlign: 'right'
                    }}
                >
                    <Typography sx={{ mb: 1 }}>
                        <strong>Subtotal:</strong>{' '}
                        {formatoColones(factura.subtotal)}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        <strong>IVA:</strong>{' '}
                        {formatoColones(factura.impuesto)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'success.main',
                            fontWeight: 'bold'
                        }}
                    >
                        Total: {formatoColones(factura.total)}
                    </Typography>
                </Box>
            </Paper>

            <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/facturas')}
                >
                    Regresar a facturas
                </Button>
            </Box>
        </Container>
    );
}
