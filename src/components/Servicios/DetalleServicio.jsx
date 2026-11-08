import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Card, CardContent, Typography, Box, Button, 
    Divider, Chip, CircularProgress, Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ServicioService from '../../services/ServiciosService';

export const DetalleServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                setLoading(true);
                const response = await ServicioService.getServicioById(id);
                const data = response.data?.results || response.data || response.data?.result;
                setServicio(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar detalle del servicio:", err);
                setError("No se pudo obtener la información del servicio.");
            } finally {
                setLoading(false);
            }
        };

        fetchServicio();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !servicio) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || "Servicio no encontrado."}
                </Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/servicios')}>
                    Volver al Catálogo
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/servicios')} 
                sx={{ mb: 3 }}
            >
                Volver al Catálogo
            </Button>

            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: 320
                    }}
                >
                    {/* Sección Izquierda: Imagen / Icono fijo */}
                    <Box 
                        sx={{ 
                            width: { xs: '100%', md: 280 },
                            minWidth: { md: 280 },
                            backgroundColor: '#fafafa', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: 3,
                            borderRight: { md: '1px solid #e0e0e0' }
                        }}
                    >
                        {servicio.imagen_url ? (
                            <img 
                                src={servicio.imagen_url} 
                                alt={servicio.nombre} 
                                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }} 
                            />
                        ) : (
                            <MedicalServicesIcon sx={{ fontSize: 110, color: '#bdbdbd' }} />
                        )}
                    </Box>

                    {/* Sección Derecha: Información detallada */}
                    <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 500 }}>
                            {servicio.nombre}
                        </Typography>

                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000', mb: 2 }}>
                            ₡{parseFloat(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Descripción del servicio:
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                            {servicio.descripcion}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Duración estimada:</strong> {servicio.duracion_minutos} minutos
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Requiere ayuno previo:</strong>
                                </Typography>
                                <Chip 
                                    label={servicio.requiere_ayuno == 1 ? "Sí" : "No"} 
                                    color={servicio.requiere_ayuno == 1 ? "warning" : "default"} 
                                    size="small" 
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Requiere cita previa:</strong>
                                </Typography>
                                <Chip 
                                    label={servicio.requiere_cita_previa == 1 ? "Sí" : "No"} 
                                    color={servicio.requiere_cita_previa == 1 ? "info" : "default"} 
                                    size="small" 
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        </Container>
    );
};