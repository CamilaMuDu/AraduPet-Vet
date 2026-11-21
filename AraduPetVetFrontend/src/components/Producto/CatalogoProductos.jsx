
import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Container, Typography, Box } from '@mui/material';
import ProductoService from '../../services/ProductoService';
import { ListCardProductos } from './ListCardProductos.jsx';

export function CatalogoProductos() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        ProductoService.getProductos()
            .then((response) => {
                setData(response.data);
                setLoaded(true);
            })
            .catch((error) => {
                console.error(error);
                setError('No se pudieron cargar los productos.');
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
                Catálogo de productos
            </Typography>

            {Array.isArray(data) && data.length > 0 ? (
                <ListCardProductos data={data} />
            ) : (
                <Typography>No hay productos disponibles.</Typography>
            )}
        </Container>
    );
}
