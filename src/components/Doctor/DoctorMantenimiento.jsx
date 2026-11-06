import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DoctorService from '../../services/DoctorService';
import * as yup from 'yup';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const formularioInicial = {
    nombre: '',
    identificacion: '',
    telefono: '',
    correo: '',
    direccion: '',
    fecha_nacimiento: '',
    contrasena: '',
    especialidad: '',
    biografia: ''
};

const esquemaValidacion = (modoEdicion) => yup.object().shape({
    nombre: yup
        .string()
        .trim()
        .required('El nombre es obligatorio')
        .max(100, 'Máximo 100 caracteres'),

    identificacion: yup
        .string()
        .required('La identificación es obligatoria')
        .matches(/^[0-9]+$/, 'Use solo números, sin guiones ni espacios')
        .max(30, 'Máximo 30 caracteres'),

    telefono: yup
        .string()
        .required('El teléfono es obligatorio')
        .matches(/^[0-9]+$/, 'Use solo números, sin guiones ni espacios')
        .max(20, 'Máximo 20 caracteres'),

    correo: yup
        .string()
        .trim()
        .required('El correo es obligatorio')
        .email('Ingrese un correo electrónico válido')
        .max(150, 'Máximo 150 caracteres'),

    direccion: yup
        .string()
        .trim()
        .required('La dirección es obligatoria')
        .max(100, 'Máximo 100 caracteres'),

    fecha_nacimiento: yup
        .string()
        .required('La fecha de nacimiento es obligatoria')
        .test('fecha-valida', 'Ingrese una fecha válida', (valor) => {
            return valor && !isNaN(Date.parse(valor));
        })
        .test('fecha-no-futura', 'La fecha no puede ser posterior a hoy', (valor) => {
            if (!valor) return false;

            const hoy = new Date();
            const fechaHoy = [
                hoy.getFullYear(),
                String(hoy.getMonth() + 1).padStart(2, '0'),
                String(hoy.getDate()).padStart(2, '0')
            ].join('-');

            return valor <= fechaHoy;
        }),

    especialidad: yup
        .string()
        .trim()
        .required('La especialidad es obligatoria')
        .max(100, 'Máximo 100 caracteres'),

    biografia: yup
        .string()
        .trim()
        .required('La biografía profesional es obligatoria')
        .max(5000, 'Máximo 5000 caracteres'),

    contrasena: modoEdicion
        ? yup.string().test(
            'contrasena-minima',
            'La contraseña debe tener al menos 8 caracteres',
            (valor) => !valor || valor.length >= 8
        )
        : yup.string()
            .required('La contraseña es obligatoria')
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export function DoctorMantenimiento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(formularioInicial);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const modoEdicion = Boolean(id);

    const [errores, setErrores] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');

    useEffect(() => {
        const cargarDoctor = async () => {
            if (!modoEdicion) return;

            try {
                setCargando(true);
                setError('');

                const respuesta = await DoctorService.getDoctorById(id);
                console.log('ID recibido:', id);
                console.log('Respuesta completa:', respuesta);
                console.log('Datos del veterinario:', respuesta.data);
                const datos = respuesta.data;

                if (!datos || !datos.id_doctor) {
                    throw new Error('Veterinario no encontrado');
                }

                setDoctor({
                    nombre: datos.nombre || '',
                    identificacion: datos.identificacion || '',
                    telefono: datos.telefono || '',
                    correo: datos.correo || '',
                    direccion: datos.direccion || '',
                    fecha_nacimiento: datos.fecha_nacimiento || '',
                    contrasena: '',
                    especialidad: datos.especialidad || '',
                    biografia: datos.biografia || ''
                });

            } catch (err) {
                console.error('Error al cargar veterinario:', err);
                setError('No se pudieron cargar los datos del veterinario.');
            } finally {
                setCargando(false);
            }
        };

        cargarDoctor();
    }, [id, modoEdicion]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setDoctor((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setErrores({});
        setError('');

        try {
            await esquemaValidacion(modoEdicion).validate(doctor, {
                abortEarly: false
            });

            const datosEnviar = { ...doctor };

            if (modoEdicion && !datosEnviar.contrasena) {
                delete datosEnviar.contrasena;
            }

            setCargando(true);

            if (modoEdicion) {
                await DoctorService.updateDoctor(id, datosEnviar);
                setMensajeExito('¡Veterinario actualizado correctamente!');
            } else {
                await DoctorService.createDoctor(datosEnviar);
                setMensajeExito('¡Veterinario registrado correctamente!');
            }

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const nuevosErrores = {};

                err.inner.forEach((validacion) => {
                    if (validacion.path && !nuevosErrores[validacion.path]) {
                        nuevosErrores[validacion.path] = validacion.message;
                    }
                });

                setErrores(nuevosErrores);
            } else {
                console.error('Error al guardar veterinario:', err);

                const mensaje =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    'No se pudo guardar la información del veterinario.';

                setError(mensaje);
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                color="primary"
                sx={{ mb: 3 }}
            >
                {modoEdicion
                    ? 'Modificar veterinario'
                    : 'Registrar veterinario'}
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 3
                }}
            >
                <Alert severity="info" sx={{ mb: 3 }}>
                    Completa la información personal y profesional del veterinario.
                </Alert>
                {mensajeExito && (
                    <Alert
                        severity="success"
                        variant="filled"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            fontSize: '1rem',
                            alignItems: 'center'
                        }}
                    >
                        {mensajeExito}
                    </Alert>
                )}
                <Box component="form" onSubmit={manejarEnvio} noValidate>
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                label="Nombre completo"
                                name="nombre"
                                value={doctor.nombre}
                                onChange={manejarCambio}
                                error={Boolean(errores.nombre)}
                                helperText={errores.nombre || ''}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Identificación"
                                name="identificacion"
                                value={doctor.identificacion}
                                onChange={manejarCambio}
                                error={Boolean(errores.identificacion)}
                                helperText={errores.identificacion || ''}
                                slotProps={{ htmlInput: { maxLength: 30 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Teléfono"
                                name="telefono"
                                value={doctor.telefono}
                                onChange={manejarCambio}
                                error={Boolean(errores.telefono)}
                                helperText={errores.telefono || ''}
                                slotProps={{ htmlInput: { maxLength: 20 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Correo electrónico"
                                name="correo"
                                value={doctor.correo}
                                onChange={manejarCambio}
                                error={Boolean(errores.correo)}
                                helperText={errores.correo || ''}
                                slotProps={{ htmlInput: { maxLength: 150 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="es"
                            >
                                <DatePicker
                                    label="Fecha de nacimiento"
                                    value={
                                        doctor.fecha_nacimiento
                                            ? dayjs(doctor.fecha_nacimiento)
                                            : null
                                    }
                                    onChange={(nuevaFecha) => {
                                        setDoctor((anterior) => ({
                                            ...anterior,
                                            fecha_nacimiento: nuevaFecha && nuevaFecha.isValid()
                                                ? nuevaFecha.format('YYYY-MM-DD')
                                                : ''
                                        }));
                                    }}
                                    maxDate={dayjs()}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: Boolean(errores.fecha_nacimiento),
                                            helperText: errores.fecha_nacimiento || ''
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                label="Dirección"
                                name="direccion"
                                value={doctor.direccion}
                                onChange={manejarCambio}
                                error={Boolean(errores.direccion)}
                                helperText={errores.direccion || ''}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Especialidad"
                                name="especialidad"
                                value={doctor.especialidad}
                                onChange={manejarCambio}
                                error={Boolean(errores.especialidad)}
                                helperText={errores.especialidad || ''}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required={!modoEdicion}
                                type="password"
                                label={modoEdicion
                                    ? 'Nueva contraseña'
                                    : 'Contraseña'}
                                name="contrasena"
                                value={doctor.contrasena}
                                onChange={manejarCambio}
                                error={Boolean(errores.contrasena)}
                                helperText={errores.contrasena || (modoEdicion
                                    ? 'Déjala vacía si no deseas cambiarla.'
                                    : 'Debe tener al menos 8 caracteres.')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label="Biografía profesional"
                                name="biografia"
                                value={doctor.biografia}
                                onChange={manejarCambio}
                                error={Boolean(errores.biografia)}
                                helperText={errores.biografia || ''}
                                slotProps={{ htmlInput: { maxLength: 5000 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    mt: 2
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() =>
                                        navigate('/veterinarios/mantenimiento')
                                    }
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                >
                                    {modoEdicion ? 'Actualizar' : 'Registrar'}
                                </Button>
                                {mensajeExito && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate('/veterinarios/mantenimiento')}
                                    >
                                        Volver al listado
                                    </Button>
                                )}
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
