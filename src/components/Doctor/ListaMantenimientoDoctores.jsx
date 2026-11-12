import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import DoctorService from '../../services/DoctorService';
import VisibilityIcon from '@mui/icons-material/Visibility';

export function ListaMantenimientoDoctores() {
    const [doctores, setDoctores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const cargarDoctores = () => {
        setCargando(true);
        setError('');

        DoctorService.getDoctores()
            .then((response) => {
                setDoctores(response.data);
                setCargando(false);
            })
            .catch((err) => {
                console.error(err);
                setError('No se pudieron cargar los veterinarios.');
                setCargando(false);
            });
    };

    const [dialogoEliminar, setDialogoEliminar] = useState(false);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [notificacion, setNotificacion] = useState({
        abierto: false,
        mensaje: '',
        tipo: 'success'
    });

    //Eliminar veterinnario
    const manejarEliminar = (id) => {
        setDoctorSeleccionado(id);
        setDialogoEliminar(true);
    };

    const cancelarEliminar = () => {
        setDialogoEliminar(false);
        setDoctorSeleccionado(null);
    };

    const confirmarEliminar = async () => {
        try {
            await DoctorService.deleteDoctor(doctorSeleccionado);

            setNotificacion({
                abierto: true,
                mensaje: 'Veterinario eliminado correctamente.',
                tipo: 'success'
            });

            setDialogoEliminar(false);
            setDoctorSeleccionado(null);

            cargarDoctores();

        } catch (error) {
            console.error('Error al eliminar veterinario:', error);

            setNotificacion({
                abierto: true,
                mensaje: error.response?.data?.mensaje ||
                    'No se pudo eliminar el veterinario.',
                tipo: 'error'
            });

            setDialogoEliminar(false);
            setDoctorSeleccionado(null);
        }
    };

    const cerrarNotificacion = () => {
        setNotificacion((prev) => ({
            ...prev,
            abierto: false
        }));
    };

    useEffect(() => {
        cargarDoctores();
    }, []);

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Typography variant="h4" component="h1" color="primary">
                    Mantenimiento de veterinarios
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/doctores/crear')}
                >
                    Registrar veterinario
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!error && doctores.length === 0 ? (
                <Alert severity="info">
                    No hay veterinarios registrados.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#E1F5FE' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Identificación</strong></TableCell>
                                <TableCell><strong>Teléfono</strong></TableCell>
                                <TableCell><strong>Correo</strong></TableCell>
                                <TableCell><strong>Especialidad</strong></TableCell>
                                <TableCell align="center">
                                    <strong>Acciones</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {doctores.map((doctor) => (
                                <TableRow key={doctor.id_doctor} hover>
                                    <TableCell>{doctor.id_doctor}</TableCell>
                                    <TableCell>{doctor.nombre}</TableCell>
                                    <TableCell>
                                        {doctor.identificacion || '—'}
                                    </TableCell>
                                    <TableCell>{doctor.telefono}</TableCell>
                                    <TableCell>{doctor.correo}</TableCell>
                                    <TableCell>{doctor.especialidad}</TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                                            <IconButton
                                                color="info"
                                                onClick={() => navigate(`/veterinarios/detalle/${doctor.id_doctor}`)}
                                                title="Ver detalle del veterinario"
                                                size="small"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>

                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/doctores/editar/${doctor.id_doctor}`)}
                                                title="Editar veterinario"
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton
                                                color="error"
                                                onClick={() => manejarEliminar(doctor.id_doctor)}
                                                title="Eliminar veterinario"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={dialogoEliminar}
                onClose={cancelarEliminar}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        ¿Seguro deseas eliminar este veterinario?
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={cancelarEliminar} color="inherit">
                        Cancelar
                    </Button>

                    <Button
                        onClick={confirmarEliminar}
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notificacion.abierto}
                autoHideDuration={4000}
                onClose={cerrarNotificacion}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={cerrarNotificacion}
                    severity={notificacion.tipo}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notificacion.mensaje}
                </Alert>
            </Snackbar>
        </Container>
    );
}
