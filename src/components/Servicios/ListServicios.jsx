import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ServicioService from '../../services/ServiciosService';

export const ListServicios = ({ onEdit, onCreate }) => {
    // 1. Estados para los datos, la carga y los errores
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Función para cargar los servicios desde la API
    const loadServicios = async () => {
        try {
            setLoading(true);
            const response = await ServicioService.getServicios();
            // La API de PHP responde con { status: 200, results: [...] }
            setServicios(response.data.results || []);
            setError(null);
        } catch (err) {
            console.error("Error al cargar servicios:", err);
            setError("No se pudieron cargar los servicios de la veterinaria.");
        } finally {
            setLoading(false);
        }
    };

    // 3. useEffect ejecuta la carga al montar el componente
    useEffect(() => {
        loadServicios();
    }, []);

    // 4. Manejo de borrado/inactivación de un servicio
    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea desactivar este servicio?")) {
            try {
                await ServicioService.deleteServicio(id);
                // Recargamos la tabla para refrescar los datos
                loadServicios();
            } catch (err) {
                console.error("Error al eliminar servicio:", err);
                alert("Ocurrió un error al intentar desactivar el servicio.");
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    Mantenimiento de Servicios
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                >
                    Nuevo Servicio
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="tabla de servicios">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell align="right"><strong>Precio</strong></TableCell>
                            <TableCell align="center"><strong>Duración (min)</strong></TableCell>
                            <TableCell align="center"><strong>Requiere Ayuno</strong></TableCell>
                            <TableCell align="center"><strong>Cita Previa</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servicios.length > 0 ? (
                            servicios.map((servicio) => (
                                <TableRow key={servicio.id_servicio} hover>
                                    <TableCell>{servicio.nombre}</TableCell>
                                    <TableCell>{servicio.descripcion}</TableCell>
                                    <TableCell align="right">
                                        ₡{parseFloat(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell align="center">{servicio.duracion_minutos} min</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={servicio.requiere_ayuno == 1 ? "Sí" : "No"}
                                            color={servicio.requiere_ayuno == 1 ? "warning" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={servicio.requiere_cita_previa == 1 ? "Sí" : "No"}
                                            color={servicio.requiere_cita_previa == 1 ? "info" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit && onEdit(servicio)}
                                            title="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(servicio.id_servicio)}
                                            title="Desactivar"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay servicios disponibles registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};