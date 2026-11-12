import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Card, CardContent, Typography, Box, Button, 
    Divider, CircularProgress, Alert, Paper, Grid, Chip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HorarioService from '../../services/HorarioService';

const DIAS_SEMANA = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' }
];

export const DetalleHorario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHorario = async () => {
            try {
                setLoading(true);
                const response = await HorarioService.getHorarioById ? 
                    await HorarioService.getHorarioById(id) : 
                    await HorarioService.getHorarios();
                
                const dataRaw = response.data?.results || response.data?.result || response.data;
                
                if (Array.isArray(dataRaw)) {
                    const encontrado = dataRaw.find(h => String(h.id_horario || h.id_excepciones_horario) === String(id));
                    setHorario(encontrado);
                } else {
                    setHorario(dataRaw);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error al cargar detalle del horario:", err);
                setError("No se pudo obtener la información del horario.");
            } finally {
                setLoading(false);
            }
        };

        fetchHorario();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !horario) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || "Registro de horario no encontrado."}
                </Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/horarios/mantenimiento')}>
                    Volver al Mantenimiento
                </Button>
            </Container>
        );
    }

    const diaNombre = DIAS_SEMANA.find(d => Number(d.id) === Number(horario.dia_semana))?.nombre || `Día ${horario.dia_semana}`;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/horarios/mantenimiento')} 
                sx={{ mb: 3 }}
            >
                Volver al Mantenimiento
            </Button>

            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 500 }}>
                            Detalle de Horario de Atención
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Veterinario Asignado:</Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
                                    {horario.nombre_doctor || '—'}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Especialidad:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {horario.especialidad || 'Medicina General'}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
                                <CalendarMonthIcon color="info" sx={{ mb: 0.5 }} />
                                <Typography variant="subtitle2" color="text.secondary">Día de Atención:</Typography>
                                <Chip label={diaNombre} color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f1f8e9', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary">Hora de Inicio:</Typography>
                                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', mt: 0.5 }}>
                                    {horario.hora_apertura}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, textAlign: 'center' }}>
                                <Typography variant="subtitle2" color="text.secondary">Hora de Cierre:</Typography>
                                <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 'bold', mt: 0.5 }}>
                                    {horario.hora_cierre}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Container>
    );
};