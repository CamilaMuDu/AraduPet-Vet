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
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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

export const ListaMantenimientoHorarios = () => {
    const [horarios, setHorarios] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para controlar el formulario interno
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        dia_semana: 1,
        hora_apertura: '08:00',
        hora_cierre: '17:00'
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const resHorarios = await HorarioService.getHorarios();
            const dataHorarios = resHorarios.data?.results || resHorarios.data || [];

            setHorarios(Array.isArray(dataHorarios) ? dataHorarios : []);
            setError(null);
        } catch (err) {
            console.error("Error al cargar horarios:", err);
            setError("No se pudieron cargar los registros de horarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleCreate = () => {
        setEditId(null);
        setFormData({ dia_semana: 1, hora_apertura: '08:00', hora_cierre: '17:00' });
        setShowForm(true);
    };

    const handleEdit = (horario) => {
        setEditId(horario.id_excepciones_horario);
        setFormData({
            dia_semana: horario.dia_semana,
            hora_apertura: horario.hora_apertura,
            hora_cierre: horario.hora_cierre
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.hora_apertura >= formData.hora_cierre) {
            alert("La hora de inicio debe ser anterior a la hora de cierre.");
            return;
        }

        try {
            if (editId) {
                await HorarioService.updateHorario(editId, formData);
            } else {
                await HorarioService.createHorario(formData);
            }
            setShowForm(false);
            loadData();
        } catch (err) {
            console.error("Error al guardar el horario:", err);
            alert("Ocurrió un error al guardar el horario.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este registro de horario?")) {
            try {
                await HorarioService.deleteHorario(id);
                loadData();
            } catch (err) {
                console.error("Error al eliminar horario:", err);
                alert("Error al eliminar el registro.");
            }
        }
    };

    // Extraer lista única de doctores a partir de los horarios cargados
    const doctoresUnicos = Array.from(
        new Set(horarios.map(h => h.id_doctor))
    ).map(id => {
        return horarios.find(h => h.id_doctor === id);
    }).filter(Boolean);

    // Filtrar la lista de horarios según el doctor seleccionado
    const horariosFiltrados = selectedDoctor
        ? horarios.filter(h => h.id_doctor == selectedDoctor)
        : horarios;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    Mantenimiento de Horarios por Veterinario
                </Typography>
                {!showForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        Nuevo Horario
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Formulario de Creación / Edición */}
            {showForm ? (
                <Card elevation={3} sx={{ mb: 4, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6" mb={2}>
                            {editId ? "Modificar Horario" : "Registrar Nuevo Horario"}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Día de la semana</InputLabel>
                                        <Select
                                            value={formData.dia_semana}
                                            label="Día de la semana"
                                            onChange={(e) => setFormData({ ...formData, dia_semana: e.target.value })}
                                        >
                                            {DIAS_SEMANA.map((d) => (
                                                <MenuItem key={d.id} value={d.id}>
                                                    {d.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Hora de Inicio"
                                        type="time"
                                        value={formData.hora_apertura}
                                        onChange={(e) => setFormData({ ...formData, hora_apertura: e.target.value })}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Hora de Cierre"
                                        type="time"
                                        value={formData.hora_cierre}
                                        onChange={(e) => setFormData({ ...formData, hora_cierre: e.target.value })}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                /* Filtro por Doctor */
                <Box sx={{ mb: 3, maxWidth: 400 }}>
                    <FormControl fullWidth>
                        <InputLabel>Filtrar por Veterinario / Doctor</InputLabel>
                        <Select
                            value={selectedDoctor}
                            label="Filtrar por Veterinario / Doctor"
                            onChange={handleDoctorChange}
                        >
                            <MenuItem value="">-- Mostrar Todos los Doctores --</MenuItem>
                            {doctoresUnicos.map((doc) => (
                                <MenuItem key={doc.id_doctor} value={doc.id_doctor}>
                                    {doc.nombre_doctor || `Doctor #${doc.id_doctor}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {/* Tabla de Horarios */}
            {!showForm && (
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabla de horarios">
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Veterinario</strong></TableCell>
                                <TableCell><strong>Especialidad</strong></TableCell>
                                <TableCell align="center"><strong>Día de Atención</strong></TableCell>
                                <TableCell align="center"><strong>Hora Inicio</strong></TableCell>
                                <TableCell align="center"><strong>Hora Cierre</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {horariosFiltrados.length > 0 ? (
                                horariosFiltrados.map((horario) => {
                                    const diaNombre = DIAS_SEMANA.find(d => d.id == horario.dia_semana)?.nombre || `Día ${horario.dia_semana}`;
                                    return (
                                        <TableRow key={horario.id_excepciones_horario} hover>
                                            <TableCell>{horario.nombre_doctor || 'Asignado en perfil'}</TableCell>
                                            <TableCell>{horario.especialidad || 'General'}</TableCell>
                                            <TableCell align="center">{diaNombre}</TableCell>
                                            <TableCell align="center">{horario.hora_apertura}</TableCell>
                                            <TableCell align="center">{horario.hora_cierre}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(horario)}
                                                    title="Editar"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(horario.id_excepciones_horario)}
                                                    title="Eliminar"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No hay registros de horarios disponibles para el filtro seleccionado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};