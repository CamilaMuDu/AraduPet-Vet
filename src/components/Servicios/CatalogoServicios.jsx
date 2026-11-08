import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress, Alert, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ServicioService from '../../services/ServiciosService';
import { ListCardServicios } from './ListCardServicios';

export const CatalogoServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadServicios = async () => {
        try {
            setLoading(true);
            const response = await ServicioService.getServicios();
            const data = response.data?.results || response.data || [];
            setServicios(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Error al cargar el catálogo de servicios:", err);
            setError("No se pudieron cargar los servicios del catálogo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServicios();
    }, []);

    const serviciosFiltrados = servicios.filter(s =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.descripcion && s.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
            {/* Título alineado a la izquierda idéntico al de productos */}
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                color="primary" 
                sx={{ fontWeight: 500, mb: 3, textAlign: 'left' }}
            >
                Catálogo de servicios
            </Typography>

            {/* Buscador alineado a la izquierda con separación inferior */}
            <Box sx={{ mb: 4, maxWidth: 400 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar servicio por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                    size="small"
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Grid de 3 columnas alineado y uniforme */}
            <Box 
                sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    }, 
                    gap: 3 
                }}
            >
                {serviciosFiltrados.length > 0 ? (
                    serviciosFiltrados.map((servicio) => (
                        <ListCardServicios key={servicio.id_servicio} servicio={servicio} />
                    ))
                ) : (
                    <Box gridColumn="1 / -1">
                        <Typography variant="body1" align="center" color="text.secondary">
                            No se encontraron servicios que coincidan con la búsqueda.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};