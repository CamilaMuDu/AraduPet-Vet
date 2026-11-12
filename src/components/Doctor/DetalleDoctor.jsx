import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Card, CardContent, Typography, Box, Button,
    Divider, CircularProgress, Alert, Paper, Grid, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DoctorService from '../../services/DoctorService';

export const DetalleDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const response = await DoctorService.getDoctorById(id);
                const data = response.data?.results || response.data || response.data?.result;
                
                if (!data) {
                    throw new Error("Veterinario no encontrado");
                }
                setDoctor(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar detalle del veterinario:", err);
                setError("No se pudo obtener la información del veterinario.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !doctor) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || "Veterinario no encontrado."}
                </Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/veterinarios/mantenimiento')}>
                    Volver al Mantenimiento
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/veterinarios/mantenimiento')} 
                sx={{ mb: 3 }}
            >
                Volver al Mantenimiento
            </Button>

            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <Avatar 
                            sx={{ 
                                width: 90, 
                                height: 90, 
                                bgcolor: '#008b45',
                                fontSize: '2.5rem'
                            }}
                        >
                            <MedicalServicesIcon sx={{ fontSize: 45 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 500 }}>
                                {doctor.nombre}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                {doctor.especialidad}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Identificación:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{doctor.identificacion || '—'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Teléfono de contacto:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{doctor.telefono}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Correo electrónico:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{doctor.correo}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Fecha de Nacimiento:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{doctor.fecha_nacimiento || '—'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Dirección:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{doctor.direccion}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Biografía Profesional:</Typography>
                                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
                                    {doctor.biografia || 'Sin información bibliográfica cargada.'}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Container>
    );
};