import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Container, Typography, Box } from '@mui/material';
import ServiciosService from '../../services/ServiciosService';
import { ListCardServicios } from './ListCardServicios.jsx';

export function CatalogoServicios() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        ServiciosService.getServicio()
            .then((response) => {
                setData(response.data);
                setLoaded(true);
            })
            .catch((error) => {
                console.error(error);
                setError('No se pudieron cargar los servicios.');
                setLoaded(true);
            });
    }, []);

    if (!loaded) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary" align='left'>
                Catálogo de servicios
            </Typography>

            {Array.isArray(data) && data.length > 0 ? (
                <ListCardProductos data={data} />
            ) : (
                <Typography>No hay servicios disponibles.</Typography>
            )}
        </Container>
    );
}
