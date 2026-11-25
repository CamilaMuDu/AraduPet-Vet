import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Alert, CircularProgress,
    FormControl, InputLabel, Select, MenuItem,
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, IconButton, Card, CardContent,
    TextField, Stack, Tabs, Tab
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { useNavigate, useLocation } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as yup from 'yup';

import HorarioService from '../../services/HorarioService';
import DoctorService from '../../services/DoctorService';
import ExcepcionesHorarioService from '../../services/ExcepcionesHorarioService';

dayjs.extend(customParseFormat);

const DIAS_SEMANA = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves',
    'Viernes', 'Sábado', 'Domingo'
];

const extraerLista = (data, propiedad) => {
    const resultado = data?.results ?? data?.result ?? data;

    if (Array.isArray(resultado)) return resultado;

    if (Array.isArray(resultado?.[propiedad])) {
        return resultado[propiedad];
    }

    return [];
};

const formatearFecha = (fecha) => {
    if (!fecha) return '-';

    const partes = fecha.substring(0, 10).split('-');

    return partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : fecha;
};

const obtenerMensajeError = (error) => {
    const respuesta = error.response?.data;

    return respuesta?.mensaje ||
        respuesta?.message ||
        (typeof respuesta === 'string' ? respuesta : null) ||
        'Ocurrió un error al procesar la solicitud.';
};

const esquemaHorario = yup.object({
    dia_semana: yup.number()
        .integer()
        .min(1)
        .max(7)
        .required('Debe seleccionar un día.'),

    hora_apertura: yup.string()
        .required('Debe indicar la hora de inicio.'),

    hora_cierre: yup.string()
        .required('Debe indicar la hora de cierre.')
        .test(
            'hora-mayor',
            'La hora de cierre debe ser posterior al inicio.',
            function (valor) {
                if (!valor || !this.parent.hora_apertura) {
                    return true;
                }

                return valor > this.parent.hora_apertura;
            }
        )
});

const esquemaBloqueo = yup.object({
    id_doctor: yup.number()
        .integer()
        .positive()
        .required('Debe seleccionar un veterinario.'),

    fecha: yup.string()
        .required('Debe seleccionar una fecha.')
        .test(
            'fecha-valida',
            'La fecha no es válida.',
            (valor) => {
                return Boolean(
                    valor &&
                    dayjs(valor, 'YYYY-MM-DD', true).isValid()
                );
            }
        )
        .test(
            'fecha-vigente',
            'No se permiten fechas anteriores a hoy.',
            (valor) => {
                if (
                    !valor ||
                    !dayjs(valor, 'YYYY-MM-DD', true).isValid()
                ) {
                    return true;
                }

                return !dayjs(valor).isBefore(dayjs(), 'day');
            }
        ),

    hora_apertura: yup.string()
        .required('Debe indicar la hora de inicio.')
        .matches(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            'La hora debe tener el formato HH:MM.'
        ),

    hora_cierre: yup.string()
        .required('Debe indicar la hora de finalización.')
        .matches(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            'La hora debe tener el formato HH:MM.'
        )
        .test(
            'hora-mayor',
            'La hora final debe ser posterior a la inicial.',
            function (valor) {
                if (!valor || !this.parent.hora_apertura) {
                    return true;
                }

                return valor > this.parent.hora_apertura;
            }
        ),

    motivo: yup.string()
        .max(150, 'Máximo 150 caracteres.')
        .nullable()
});

const obtenerErroresYup = (error) => {
    const nuevosErrores = {};

    error.inner.forEach(item => {
        if (item.path && !nuevosErrores[item.path]) {
            nuevosErrores[item.path] = item.message;
        }
    });

    return nuevosErrores;
};

export function ListaMantenimientoHorarios() {
    const navigate = useNavigate();
    const location = useLocation();

    const [vista, setVista] = useState(
        location.state?.vista === 'bloqueos' ? 1 : 0
    );

    const [doctores, setDoctores] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);

    const [selectedDoctor, setSelectedDoctor] = useState(
        location.state?.idDoctor || ''
    );

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState(
        location.state?.mensaje || ''
    );
    const [errores, setErrores] = useState({});

    const [showForm, setShowForm] = useState(null);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        dia_semana: 1,
        hora_apertura: '08:00',
        hora_cierre: '17:00'
    });

    const [formBloqueo, setFormBloqueo] = useState({
        id_doctor: '',
        fecha: '',
        hora_apertura: '',
        hora_cierre: '',
        motivo: ''
    });

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError('');

            const [resHorarios, resDoctores, resBloqueos] =
                await Promise.all([
                    HorarioService.getHorarios(),
                    DoctorService.getDoctores(),
                    ExcepcionesHorarioService.getBloqueos()
                ]);

            const listaHorarios = extraerLista(
                resHorarios.data, 'horarios'
            );

            const listaDoctores = extraerLista(
                resDoctores.data, 'doctores'
            );

            const listaBloqueos = extraerLista(
                resBloqueos.data, 'bloqueos'
            );

            setHorarios(listaHorarios);
            setDoctores(listaDoctores);
            setBloqueos(listaBloqueos);

            setSelectedDoctor(actual => {
                const existe = listaDoctores.some(
                    d => String(d.id_doctor) === String(actual)
                );

                if (existe) return actual;

                return listaDoctores.length > 0
                    ? String(listaDoctores[0].id_doctor)
                    : '';
            });

        } catch (err) {
            console.error('Error al cargar horarios:', err);
            setError(obtenerMensajeError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const doctorActual = doctores.find(
        d => String(d.id_doctor) === String(selectedDoctor)
    );

    const horariosFiltrados = horarios.filter(
        h => String(h.id_doctor) === String(selectedDoctor)
    );

    const bloqueosFiltrados = bloqueos.filter(
        b => String(b.id_doctor) === String(selectedDoctor)
    );

    const actualizarHorario = (campo, valor) => {
        setFormData(actual => ({
            ...actual,
            [campo]: valor
        }));

        setErrores(actual => ({
            ...actual,
            [campo]: ''
        }));
    };

    const actualizarBloqueo = (campo, valor) => {
        setFormBloqueo(actual => ({
            ...actual,
            [campo]: valor
        }));

        setErrores(actual => ({
            ...actual,
            [campo]: ''
        }));

        setError('');
    };

    const crearHorario = () => {
        setEditId(null);

        setFormData({
            dia_semana: 1,
            hora_apertura: '08:00',
            hora_cierre: '17:00'
        });

        setErrores({});
        setError('');
        setMensaje('');
        setShowForm('horario');
    };

    const editarHorario = (horario) => {
        setEditId(horario.id_horario);

        setFormData({
            dia_semana: Number(horario.dia_semana),
            hora_apertura: horario.hora_apertura.substring(0, 5),
            hora_cierre: horario.hora_cierre.substring(0, 5)
        });

        setErrores({});
        setError('');
        setMensaje('');
        setShowForm('horario');
    };

    const crearBloqueo = () => {
        setFormBloqueo({
            id_doctor: Number(selectedDoctor),
            fecha: '',
            hora_apertura: '',
            hora_cierre: '',
            motivo: ''
        });

        setErrores({});
        setError('');
        setMensaje('');
        setShowForm('bloqueo');
    };

    const cancelarFormulario = () => {
        setShowForm(null);
        setErrores({});
        setError('');
    };

    const guardarHorario = async (event) => {
        event.preventDefault();

        if (guardando) return;

        setError('');
        setErrores({});

        try {
            await esquemaHorario.validate(formData, {
                abortEarly: false
            });

            setGuardando(true);

            if (editId !== null) {
                await HorarioService.updateHorario(
                    editId,
                    formData
                );
            } else {
                await HorarioService.createHorario({
                    ...formData,
                    id_doctor: Number(selectedDoctor)
                });
            }

            await cargarDatos();

            setShowForm(null);
            setMensaje('Horario guardado correctamente.');

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setErrores(obtenerErroresYup(err));
            } else {
                setError(obtenerMensajeError(err));
            }
        } finally {
            setGuardando(false);
        }
    };

    const guardarBloqueo = async (event) => {
        event.preventDefault();

        if (guardando) return;

        setError('');
        setErrores({});

        try {
            await esquemaBloqueo.validate(formBloqueo, {
                abortEarly: false
            });

            setGuardando(true);

            await ExcepcionesHorarioService.createBloqueo({
                ...formBloqueo,
                id_doctor: Number(selectedDoctor)
            });

            await cargarDatos();

            setShowForm(null);
            setVista(1);
            setMensaje('Bloqueo registrado correctamente.');

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setErrores(obtenerErroresYup(err));
            } else {
                setError(obtenerMensajeError(err));
            }
        } finally {
            setGuardando(false);
        }
    };

    const eliminarHorario = async (id) => {
        if (!window.confirm('¿Desea eliminar este horario?')) {
            return;
        }

        try {
            setError('');

            await HorarioService.deleteHorario(id);
            await cargarDatos();

            setMensaje('Horario eliminado correctamente.');

        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    const eliminarBloqueo = async (id) => {
        if (!window.confirm(
            '¿Desea eliminar este bloqueo de horario?'
        )) {
            return;
        }

        try {
            setError('');

            await ExcepcionesHorarioService.deleteBloqueo(id);
            await cargarDatos();

            setMensaje('Bloqueo eliminado correctamente.');

        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    const verDetalleBloqueo = (id) => {
        navigate(`/horarios/bloqueos/detalle/${id}`, {
            state: {
                idDoctor: selectedDoctor,
                vista: 'bloqueos'
            }
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, mb: 4 }}>

            {/* Título principal del mantenimiento */}
            <Typography
                variant="h4"
                component="h1"
                color="primary"
                sx={{
                    mb: 4,
                    textAlign: 'left'
                }}
            >
                Mantenimiento de Horarios por Veterinario
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {mensaje && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setMensaje('')}
                >
                    {mensaje}
                </Alert>
            )}

            {showForm === null ? (
                <>
                    {/* Filtro de veterinarios */}
                    <Box sx={{ maxWidth: 400, mb: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>
                                Seleccionar Veterinario / Doctor
                            </InputLabel>

                            <Select
                                value={selectedDoctor}
                                label="Seleccionar Veterinario / Doctor"
                                onChange={(e) => {
                                    setSelectedDoctor(String(e.target.value));
                                    setError('');
                                    setMensaje('');
                                }}
                            >
                                {doctores.map(doc => (
                                    <MenuItem
                                        key={doc.id_doctor}
                                        value={String(doc.id_doctor)}
                                    >
                                        {doc.nombre}
                                        {doc.especialidad
                                            ? ` (${doc.especialidad})`
                                            : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Pestañas compactas a la izquierda */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 3
                        }}
                    >
                        <Tabs
                            value={vista}
                            onChange={(_, nuevaVista) => {
                                setVista(nuevaVista);
                                setError('');
                                setMensaje('');
                            }}
                            variant="standard"
                            sx={{
                                width: 'fit-content',
                                maxWidth: '100%',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500
                                }
                            }}
                        >
                            <Tab label="Horarios de atención" />
                            <Tab label="Bloqueos de horario" />
                        </Tabs>
                    </Box>

                    {/* Botón de creación alineado a la derecha */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mb: 3
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            disabled={!selectedDoctor}
                            onClick={
                                vista === 0
                                    ? crearHorario
                                    : crearBloqueo
                            }
                        >
                            {vista === 0
                                ? 'Nuevo Horario'
                                : 'Nuevo Bloqueo'}
                        </Button>
                    </Box>

                    {/* Listado de horarios de atención */}
                    {vista === 0 && (
                        <TableContainer
                            component={Paper}
                            elevation={3}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#E1F5FE' }}>
                                        {[
                                            'Veterinario',
                                            'Especialidad',
                                            'Día de Atención',
                                            'Hora Inicio',
                                            'Hora Cierre',
                                            'Acciones'
                                        ].map(columna => (
                                            <TableCell
                                                key={columna}
                                                align={
                                                    columna === 'Veterinario' ||
                                                    columna === 'Especialidad'
                                                        ? 'left'
                                                        : 'center'
                                                }
                                            >
                                                <strong>
                                                    {columna}
                                                </strong>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {horariosFiltrados.map(horario => (
                                        <TableRow
                                            key={horario.id_horario}
                                            hover
                                        >
                                            <TableCell>
                                                {doctorActual?.nombre ||
                                                    horario.nombre_doctor}
                                            </TableCell>

                                            <TableCell>
                                                {doctorActual?.especialidad ||
                                                    horario.especialidad}
                                            </TableCell>

                                            <TableCell align="center">
                                                {DIAS_SEMANA[
                                                    Number(
                                                        horario.dia_semana
                                                    ) - 1
                                                ] || '-'}
                                            </TableCell>

                                            <TableCell align="center">
                                                {horario.hora_apertura}
                                            </TableCell>

                                            <TableCell align="center">
                                                {horario.hora_cierre}
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    color="info"
                                                    title="Ver detalle"
                                                    onClick={() =>
                                                        navigate(
                                                            `/horarios/detalle/${horario.id_horario}`
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>

                                                <IconButton
                                                    color="primary"
                                                    title="Editar horario"
                                                    onClick={() =>
                                                        editarHorario(horario)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    title="Eliminar horario"
                                                    onClick={() =>
                                                        eliminarHorario(
                                                            horario.id_horario
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {horariosFiltrados.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                align="center"
                                            >
                                                No hay horarios registrados
                                                para este veterinario.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Listado de bloqueos */}
                    {vista === 1 && (
                        <TableContainer
                            component={Paper}
                            elevation={3}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#E1F5FE' }}>
                                        {[
                                            'Veterinario',
                                            'Fecha',
                                            'Día',
                                            'Hora Inicio',
                                            'Hora Fin',
                                            'Motivo',
                                            'Acciones'
                                        ].map(columna => (
                                            <TableCell
                                                key={columna}
                                                align="center"
                                            >
                                                <strong>
                                                    {columna}
                                                </strong>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {bloqueosFiltrados.map(bloqueo => (
                                        <TableRow
                                            key={
                                                bloqueo.id_excepciones_horario
                                            }
                                            hover
                                        >
                                            <TableCell align="center">
                                                {bloqueo.nombre_doctor}
                                            </TableCell>

                                            <TableCell align="center">
                                                {formatearFecha(
                                                    bloqueo.fecha
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {DIAS_SEMANA[
                                                    Number(
                                                        bloqueo.dia_semana
                                                    ) - 1
                                                ] || '-'}
                                            </TableCell>

                                            <TableCell align="center">
                                                {bloqueo.hora_apertura}
                                            </TableCell>

                                            <TableCell align="center">
                                                {bloqueo.hora_cierre}
                                            </TableCell>

                                            <TableCell align="center">
                                                {bloqueo.motivo ||
                                                    'Sin motivo'}
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton
                                                    color="info"
                                                    title="Ver detalle"
                                                    onClick={() =>
                                                        verDetalleBloqueo(
                                                            bloqueo.id_excepciones_horario
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    title="Eliminar bloqueo"
                                                    onClick={() =>
                                                        eliminarBloqueo(
                                                            bloqueo.id_excepciones_horario
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {bloqueosFiltrados.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                align="center"
                                            >
                                                No hay bloqueos registrados
                                                para este veterinario.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            ) : (
                
                <Card
                    elevation={3}
                    sx={{
                        borderRadius:
                            showForm === 'horario' ? 2 : 3,
                        maxWidth:
                            showForm === 'horario'
                                ? '100%'
                                : 850,
                        mx: 'auto'
                    }}
                >
                    <CardContent
                        sx={{
                            p: 4,
                            '&:last-child': {
                                pb: 4
                            }
                        }}
                    >

                        {/* Título específico del formulario */}
                        <Typography
                            variant="h5"
                            sx={{
                                mb: showForm === 'horario' ? 2 : 3,
                                textAlign: 'center',
                                color:
                                    showForm === 'bloqueo'
                                        ? 'primary.main'
                                        : 'text.primary'
                            }}
                        >
                            {showForm === 'bloqueo'
                                ? 'Registrar Nuevo Bloqueo'
                                : editId !== null
                                    ? `Modificar Horario para: ${doctorActual?.nombre || ''}`
                                    : `Registrar Nuevo Horario para: ${doctorActual?.nombre || ''}`}
                        </Typography>

                        {/* El bloqueo mantiene el nombre separado */}
                        {showForm === 'bloqueo' && (
                            <Typography
                                sx={{
                                    mb: 3,
                                    textAlign: 'center'
                                }}
                            >
                                <strong>Veterinario:</strong>{' '}
                                {doctorActual?.nombre || '-'}
                            </Typography>
                        )}

                        {/* Formulario de horarios */}
                        {showForm === 'horario' && (
                            <Box
                                component="form"
                                onSubmit={guardarHorario}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    <FormControl
                                        sx={{ width: 100 }}
                                        error={Boolean(
                                            errores.dia_semana
                                        )}
                                    >
                                        <InputLabel>
                                            Día de la semana
                                        </InputLabel>

                                        <Select
                                            label="Día de la semana"
                                            value={formData.dia_semana}
                                            onChange={(e) =>
                                                actualizarHorario(
                                                    'dia_semana',
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {DIAS_SEMANA.map((dia, index) => (
                                                <MenuItem
                                                    key={index + 1}
                                                    value={index + 1}
                                                >
                                                    {dia}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Hora de Inicio"
                                        type="time"
                                        sx={{ width: 115 }}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        value={formData.hora_apertura}
                                        onChange={(e) =>
                                            actualizarHorario(
                                                'hora_apertura',
                                                e.target.value
                                            )
                                        }
                                        error={Boolean(
                                            errores.hora_apertura
                                        )}
                                        helperText={
                                            errores.hora_apertura
                                        }
                                    />

                                    <TextField
                                        label="Hora de Cierre"
                                        type="time"
                                        sx={{ width: 115 }}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        value={formData.hora_cierre}
                                        onChange={(e) =>
                                            actualizarHorario(
                                                'hora_cierre',
                                                e.target.value
                                            )
                                        }
                                        error={Boolean(
                                            errores.hora_cierre
                                        )}
                                        helperText={
                                            errores.hora_cierre
                                        }
                                    />

                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<CancelIcon />}
                                        onClick={cancelarFormulario}
                                        disabled={guardando}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={guardando}
                                    >
                                        Guardar
                                    </Button>
                                </Stack>
                            </Box>
                        )}

                        {/* Formulario de bloqueos */}
                        {showForm === 'bloqueo' && (
                            <Box
                                component="form"
                                onSubmit={guardarBloqueo}
                            >
                                <Stack spacing={3}>

                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker
                                            label="Fecha del Bloqueo"
                                            format="DD/MM/YYYY"
                                            disablePast
                                            value={
                                                formBloqueo.fecha
                                                    ? dayjs(
                                                        formBloqueo.fecha
                                                    )
                                                    : null
                                            }
                                            onChange={(fecha) =>
                                                actualizarBloqueo(
                                                    'fecha',
                                                    fecha?.isValid()
                                                        ? fecha.format(
                                                            'YYYY-MM-DD'
                                                        )
                                                        : ''
                                                )
                                            }
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: Boolean(
                                                        errores.fecha
                                                    ),
                                                    helperText:
                                                        errores.fecha
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>

                                    <Stack
                                        direction={{
                                            xs: 'column',
                                            sm: 'row'
                                        }}
                                        spacing={2}
                                    >
                                        <TextField
                                            fullWidth
                                            type="time"
                                            label="Hora de Inicio"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                            value={
                                                formBloqueo.hora_apertura
                                            }
                                            onChange={(e) =>
                                                actualizarBloqueo(
                                                    'hora_apertura',
                                                    e.target.value
                                                )
                                            }
                                            error={Boolean(
                                                errores.hora_apertura
                                            )}
                                            helperText={
                                                errores.hora_apertura
                                            }
                                        />

                                        <TextField
                                            fullWidth
                                            type="time"
                                            label="Hora de Finalización"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                            value={
                                                formBloqueo.hora_cierre
                                            }
                                            onChange={(e) =>
                                                actualizarBloqueo(
                                                    'hora_cierre',
                                                    e.target.value
                                                )
                                            }
                                            error={Boolean(
                                                errores.hora_cierre
                                            )}
                                            helperText={
                                                errores.hora_cierre
                                            }
                                        />
                                    </Stack>

                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Motivo (Opcional)"
                                        value={formBloqueo.motivo}
                                        onChange={(e) =>
                                            actualizarBloqueo(
                                                'motivo',
                                                e.target.value
                                            )
                                        }
                                        error={Boolean(
                                            errores.motivo
                                        )}
                                        helperText={
                                            errores.motivo ||
                                            `${formBloqueo.motivo.length}/150 caracteres`
                                        }
                                    />

                                    <Alert severity="info">
                                        El bloqueo debe estar dentro del
                                        horario de atención del veterinario.
                                        No se permitirá si existen citas
                                        pendientes o confirmadas en ese rango.
                                    </Alert>

                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        spacing={2}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<CancelIcon />}
                                            onClick={cancelarFormulario}
                                            disabled={guardando}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={guardando}
                                        >
                                            {guardando
                                                ? 'Guardando...'
                                                : 'Guardar Bloqueo'}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}