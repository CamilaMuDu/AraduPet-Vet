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
    Alert,
    Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ServicioService from '../../services/ServiciosService';
import { FormServicio } from './FormServicio';

export const ListServicios = () => {
    // 1. Estados para los datos, la carga y los errores
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Estados locales para controlar el formulario y la edición
    const [showForm, setShowForm] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);
    // Mensajes de confirmación
    const [mensaje, setMensaje] = useState({
        open: false,
        texto: '',
        severity: 'success'
    });

    const cerrarMensaje = () => {
        setMensaje((prev) => ({
            ...prev,
            open: false
        }));
    };

    // 3. Función para cargar los servicios desde la API
    // 3. Función para cargar los servicios desde la API
    const loadServicios = async () => {
        try {
            setLoading(true);
            const response = await ServicioService.getServicios();

            // Leemos response.data.results si viene en objeto, o response.data si viene como arreglo directo
            const dataArray = response.data?.results || response.data || [];

            setServicios(Array.isArray(dataArray) ? dataArray : []);
            setError(null);
        } catch (err) {
            console.error("Error al cargar servicios:", err);
            setError("No se pudieron cargar los servicios de la veterinaria.");
        } finally {
            setLoading(false);
        }
    };

    // 4. useEffect ejecuta la carga al montar el componente
    useEffect(() => {
        loadServicios();
    }, []);

    // 5. Manejadores para abrir/cerrar el Formulario
    const handleCreate = () => {
        setSelectedServicio(null);
        setShowForm(true);
    };

    const handleEdit = (servicio) => {
        setSelectedServicio(servicio);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedServicio(null);
    };

    const handleSuccess = () => {
        const esEdicion = Boolean(selectedServicio?.id_servicio);

        setMensaje({
            open: true,
            texto: esEdicion
                ? 'Servicio actualizado correctamente.'
                : 'Servicio creado correctamente.',
            severity: 'success'
        });

        setShowForm(false);
        setSelectedServicio(null);
        loadServicios();
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de que desea desactivar este servicio?")) {
            try {
                await ServicioService.deleteServicio(id);

                setMensaje({
                    open: true,
                    texto: 'Servicio desactivado correctamente.',
                    severity: 'success'
                });

                loadServicios();

            } catch (err) {
                console.error("Error al eliminar servicio:", err);

                setMensaje({
                    open: true,
                    texto: 'Ocurrió un error al intentar desactivar el servicio.',
                    severity: 'error'
                });
            }
        }
    };

    const notificacion = (
        <Snackbar
            open={mensaje.open}
            autoHideDuration={4000}
            onClose={cerrarMensaje}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
        >
            <Alert
                onClose={cerrarMensaje}
                severity={mensaje.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {mensaje.texto}
            </Alert>
        </Snackbar>
    );

    if (showForm) {
        return (
            <Box sx={{ p: 3 }}>
                {notificacion}

                <FormServicio
                    initialData={selectedServicio}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                />
            </Box>
        );
    }

    // Si showForm es false, se muestra la tabla con tu diseño intacto

    return (
        <Box sx={{ p: 3 }}>
            {notificacion}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" component="h1" color="primary">
                    Mantenimiento de Servicios
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
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
                                            onClick={() => handleEdit(servicio)}
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