
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ProductoService from '../../services/ProductoService';

export function DetalleProducto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        setError('');

        ProductoService.getProductoById(id)
            .then((response) => {
                setData(response.data);
                setLoaded(true);
            })
            .catch(() => {
                setError('No se pudo cargar el producto.');
                setLoaded(true);
            });
    }, [id]);

    const formatoColones = (precio) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(precio));
    };

    if (!loaded) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <Typography color="error">
                    {error || 'Producto no encontrado.'}
                </Typography>

                <Button
                    sx={{ mt: 3 }}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/productos')}
                >
                    Regresar al catálogo
                </Button>
            </Container>
        );
    }

    return (
        <Container component="main" sx={{ mt: 6, mb: 6 }}>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                        textAlign: 'left',
                        color: '#174A5B',
                        mb: 4
                    }}
                >
                    {data.nombre}
                </Typography>

                <Grid container spacing={4} alignItems="flex-start">

                    <Grid size={{ xs: 12, md: 5 }}>
                        {data.imagen_url ? (
                            <Box
                                component="img"
                                src={data.imagen_url}
                                alt={data.nombre}
                                sx={{
                                    width: '100%',
                                    height: 350,
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 350,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#f5f5f5',
                                    borderRadius: 2
                                }}
                            >
                                <Inventory2Icon
                                    sx={{ fontSize: 100, color: '#bdbdbd' }}
                                />
                            </Box>
                        )}
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 7 }}
                        sx={{ textAlign: 'left' }}
                    >
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                        >
                            {data.marca}
                        </Typography>

                        <Typography sx={{ mt: 3 }}>
                            <strong>Categoría:</strong> {data.categoria}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Presentación:</strong> {data.presentacion}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Disponibilidad:</strong>{' '}
                            {Number(data.stock) > 0
                                ? `${data.stock} unidades disponibles`
                                : 'Agotado'}
                        </Typography>

                        <Typography sx={{ mt: 3, fontWeight: 'bold' }}>
                            Descripción
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            {data.descripcion}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                mt: 4,
                                fontWeight: 'bold',
                                color: 'success.main'
                            }}
                        >
                            {formatoColones(data.precio)}
                        </Typography>
                    </Grid>

                </Grid>
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
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/productos')}
                >
                    Regresar al catálogo
                </Button>
            </Box>
        </Container>
    );
}
