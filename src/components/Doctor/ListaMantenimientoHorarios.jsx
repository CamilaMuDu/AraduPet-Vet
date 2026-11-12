import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Typography, Box, Button, CircularProgress, Alert,
    FormControl, InputLabel, Select, MenuItem, TextField, Grid, Card, CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import HorarioService from '../../services/HorarioService';
import DoctorService from '../../services/DoctorService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const DIAS_SEMANA = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' }
];

export function ListaMantenimientoHorarios() {
    const [horarios, setHorarios] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            const [resHorarios, resDoctores] = await Promise.all([
                HorarioService.getHorarios(),
                DoctorService.getDoctores()
            ]);

            console.log("Respuesta raw de Horarios:", resHorarios.data);
            console.log("Respuesta raw de Doctores:", resDoctores.data);

            // Extraer datos asegurando compatibilidad con la envoltura del Response PHP
            const rawHorarios = resHorarios.data?.results || resHorarios.data?.result || resHorarios.data || [];
            const rawDoctores = resDoctores.data?.results || resDoctores.data?.result || resDoctores.data || [];

            const dataHorarios = Array.isArray(rawHorarios) ? rawHorarios : [];
            const dataDoctores = Array.isArray(rawDoctores) ? rawDoctores : [];

            setHorarios(dataHorarios);
            setDoctores(dataDoctores);

            // Seleccionar al primer doctor si aún no se ha seleccionado ninguno
            if (dataDoctores.length > 0 && !selectedDoctor) {
                setSelectedDoctor(String(dataDoctores[0].id_doctor));
            }

            setError(null);
        } catch (err) {
            console.error("Error al cargar mantenimientos de horarios:", err);
            setError("No se pudieron cargar los registros de horarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = () => {
        setEditId(null);
        setFormData({ dia_semana: 1, hora_apertura: '08:00', hora_cierre: '17:00' });
        setShowForm(true);
    };

    const handleEdit = (horario) => {
        const idClave = horario.id_horario || horario.id_excepciones_horario;
        setEditId(idClave);
        setFormData({
            dia_semana: horario.dia_semana,
            hora_apertura: horario.hora_apertura,
            hora_cierre: horario.hora_cierre
        });
        setShowForm(true);
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
                await HorarioService.createHorario({ ...formData, id_doctor: selectedDoctor });
            }
            setShowForm(false);
            loadData();
        } catch (err) {
            console.error("Error al guardar horario:", err);
            alert("Ocurrió un error al guardar el horario.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Desea eliminar este registro de horario?")) {
            try {
                await HorarioService.deleteHorario(id);
                loadData();
            } catch (err) {
                console.error("Error al eliminar horario:", err);
            }
        }
    };

    const doctorActual = doctores.find(d => String(d.id_doctor) === String(selectedDoctor));

    // Filtrado robusto por id_doctor
    const horariosFiltrados = horarios.filter(h => {
        if (!selectedDoctor) return true;
        return String(h.id_doctor) === String(selectedDoctor);
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" color="primary">
                    Mantenimiento de Horarios por Veterinario
                </Typography>
                {!showForm && (
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
                        Nuevo Horario
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {showForm ? (
                <Card elevation={3} sx={{ mb: 4, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6" mb={2}>
                            {editId ? "Modificar Horario" : `Registrar Nuevo Horario para: ${doctorActual?.nombre || ''}`}
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
                                                <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
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
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Hora de Cierre"
                                        type="time"
                                        value={formData.hora_cierre}
                                        onChange={(e) => setFormData({ ...formData, hora_cierre: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={() => setShowForm(false)}>
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
                <Box sx={{ mb: 4, maxWidth: 400 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Seleccionar Veterinario / Doctor</InputLabel>
                        <Select
                            value={selectedDoctor}
                            label="Seleccionar Veterinario / Doctor"
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            {doctores.map((doc) => (
                                <MenuItem key={doc.id_doctor} value={doc.id_doctor}>
                                    {doc.nombre} {doc.especialidad ? `(${doc.especialidad})` : ''}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {!showForm && (
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#E1F5FE' }}>
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
                                horariosFiltrados.map((horario, index) => {
                                    const diaNombre = DIAS_SEMANA.find(d => Number(d.id) === Number(horario.dia_semana))?.nombre || `Día ${horario.dia_semana}`;
                                    const idRegistro = horario.id_horario || horario.id_excepciones_horario || index;
                                    return (
                                        <TableRow key={idRegistro} hover>
                                            <TableCell>{doctorActual?.nombre || horario.nombre_doctor}</TableCell>
                                            <TableCell>{doctorActual?.especialidad || horario.especialidad}</TableCell>
                                            <TableCell align="center">{diaNombre}</TableCell>
                                            <TableCell align="center">{horario.hora_apertura}</TableCell>
                                            <TableCell align="center">{horario.hora_cierre}</TableCell>
                                            <TableCell align="center">
                                                <IconButton 
                                                    color="info" 
                                                    onClick={() => navigate(`/horarios/detalle/${idRegistro}`)} 
                                                    title="Ver detalle del horario"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton color="primary" onClick={() => handleEdit(horario)} title="Editar horario">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDelete(idRegistro)} title="Eliminar horario">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No hay registros de horarios cargados para este veterinario.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}