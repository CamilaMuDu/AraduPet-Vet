import React, { useEffect, useState } from 'react';

import {
    Box, Typography, Card, Button,
    CircularProgress, Alert, Divider,
    Stack, Paper, Container, Chip
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import ExcepcionesHorarioService from '../../services/ExcepcionesHorarioService';

const DIAS_SEMANA = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves',
    'Viernes', 'Sábado', 'Domingo'
];

const formatearFecha = (fecha) => {
    if (!fecha) return '-';

    const partes = fecha.substring(0, 10).split('-');

    return partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : fecha;
};

export function DetalleBloqueoHorario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [bloqueo, setBloqueo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const volver = () => {
        navigate('/horarios/mantenimiento', {
            state: {
                vista: 'bloqueos',
                idDoctor: location.state?.idDoctor ||
                    (bloqueo?.id_doctor
                        ? String(bloqueo.id_doctor)
                        : '')
            }
        });
    };

    useEffect(() => {
        const cargarBloqueo = async () => {
            try {
                setLoading(true);
                setError('');

                const response =
                    await ExcepcionesHorarioService.getBloqueoById(id);

                const data =
                    response.data?.results ??
                    response.data?.result ??
                    response.data;

                const registro = Array.isArray(data)
                    ? data[0]
                    : data;

                if (!registro ||
                    !registro.id_excepciones_horario
                ) {
                    setError('El bloqueo no fue encontrado.');
                    return;
                }

                setBloqueo(registro);

            } catch (err) {
                console.error('Error al cargar bloqueo:', err);

                setError(
                    err.response?.data?.mensaje ||
                    err.response?.data?.message ||
                    'No se pudo obtener el detalle del bloqueo.'
                );

            } finally {
                setLoading(false);
            }
        };

        cargarBloqueo();
    }, [id]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                my={5}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !bloqueo) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={volver}
                    sx={{ mb: 3 }}
                >
                    Volver al Mantenimiento
                </Button>

                <Alert severity="error">
                    {error || 'Bloqueo no encontrado.'}
                </Alert>
            </Container>
        );
    }

    const diaNombre =
        DIAS_SEMANA[Number(bloqueo.dia_semana) - 1] || '-';

    const seccion = {
        p: 2,
        borderRadius: 2,
        textAlign: 'left',
        height: '100%'
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>

            {/* Botón superior para regresar */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={volver}
                sx={{ mb: 3 }}
            >
                Volver al Mantenimiento
            </Button>

            <Card
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: { xs: 2, sm: 4 } }}>

                    <Typography
                        variant="h4"
                        component="h1"
                        color="primary"
                        sx={{
                            fontWeight: 500,
                            textAlign: 'left',
                            mb: 2
                        }}
                    >
                        Detalle del Bloqueo de Horario
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr'
                            },
                            gap: 3,
                            mb: 3
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                ...seccion,
                                bgcolor: '#f8f9fa'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Veterinario Asignado:
                            </Typography>

                            <Typography
                                variant="h6"
                                color="primary"
                                sx={{ fontWeight: 500 }}
                            >
                                {bloqueo.nombre_doctor || '-'}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                ...seccion,
                                bgcolor: '#e3f2fd'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Fecha del Bloqueo:
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 500, mb: 1 }}
                            >
                                {formatearFecha(bloqueo.fecha)}
                            </Typography>

                            <Chip
                                label={diaNombre}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Paper>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr'
                            },
                            gap: 3,
                            mb: 3
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                ...seccion,
                                bgcolor: '#f1f8e9'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Hora de Inicio:
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#2e7d32',
                                    fontWeight: 'bold'
                                }}
                            >
                                {bloqueo.hora_apertura}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                ...seccion,
                                bgcolor: '#fff3e0'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Hora de Finalización:
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#e65100',
                                    fontWeight: 'bold'
                                }}
                            >
                                {bloqueo.hora_cierre}
                            </Typography>
                        </Paper>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            ...seccion,
                            bgcolor: '#f8f9fa',
                            mb: 1
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Motivo del Bloqueo:
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                overflowWrap: 'anywhere',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {bloqueo.motivo ||
                                'No se registró un motivo.'}
                        </Typography>
                    </Paper>

                </Box>
            </Card>
        </Container>
    );
}
