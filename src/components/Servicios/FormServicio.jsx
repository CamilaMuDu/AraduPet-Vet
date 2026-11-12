
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormControlLabel,
    Switch,
    Grid,
    Alert
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ServicioService from '../../services/ServiciosService';

export const FormServicio = ({ initialData, onCancel, onSuccess }) => {

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion_minutos: 30,
        requiere_ayuno: 0,
        requiere_cita_previa: 1
    });

    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Cargar datos cuando se edita un servicio
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                precio: initialData.precio ?? '',
                duracion_minutos: initialData.duracion_minutos ?? 30,
                requiere_ayuno: Number(initialData.requiere_ayuno ?? 0),
                requiere_cita_previa: Number(initialData.requiere_cita_previa ?? 1)
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                duracion_minutos: 30,
                requiere_ayuno: 0,
                requiere_cita_previa: 1
            });
        }

        setImagenArchivo(null);
        setError(null);
    }, [initialData]);

    // Generar vista previa de imagen nueva o existente
    useEffect(() => {
        if (imagenArchivo) {
            const url = URL.createObjectURL(imagenArchivo);
            setVistaPrevia(url);

            return () => URL.revokeObjectURL(url);
        }

        if (initialData?.imagen_url) {
            const ruta = initialData.imagen_url;

            const url = /^https?:\/\//i.test(ruta)
                ? ruta
                : `http://localhost/AraduPetVet/${ruta.replace(/^\/+/, '')}`;

            setVistaPrevia(url);
        } else {
            setVistaPrevia('');
        }
    }, [imagenArchivo, initialData]);

    // Actualizar campos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (checked ? 1 : 0)
                : value
        }));
    };

    // Seleccionar imagen
    const handleImagenChange = (e) => {
        const archivo = e.target.files?.[0];

        if (!archivo) return;

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            setError('Solo se permiten imágenes JPG, PNG o WebP.');
            e.target.value = '';
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setError('La imagen no puede superar los 5 MB.');
            e.target.value = '';
            return;
        }

        setImagenArchivo(archivo);
        setError(null);
    };

    // Guardar servicio
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (
            !formData.nombre.trim() ||
            formData.precio === '' ||
            !formData.duracion_minutos
        ) {
            setError(
                'Complete los campos obligatorios: Nombre, Precio y Duración.'
            );
            return;
        }

        const datos = new FormData();

        datos.append('nombre', formData.nombre);
        datos.append('descripcion', formData.descripcion);
        datos.append('precio', formData.precio);
        datos.append('duracion_minutos', formData.duracion_minutos);
        datos.append('requiere_ayuno', formData.requiere_ayuno);
        datos.append('requiere_cita_previa', formData.requiere_cita_previa);

        if (imagenArchivo) {
            datos.append('imagen', imagenArchivo);
        }

        try {
            setSubmitting(true);

            let respuesta;

            if (initialData?.id_servicio) {
                respuesta = await ServicioService.updateServicio(
                    initialData.id_servicio,
                    datos
                );
            } else {
                respuesta = await ServicioService.createServicio(datos);
            }

            if (
                respuesta.data?.status !== 200 &&
                respuesta.data?.status !== 201
            ) {
                throw new Error('No se pudo guardar el servicio.');
            }

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error('Error al guardar el servicio:', err);

            setError(
                err.response?.data?.results ||
                err.message ||
                'Ocurrió un error al guardar el servicio.'
            );

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 3 }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="primary"
                sx={{ mb: 3 }}
            >
                {initialData
                    ? 'Editar Servicio Veterinario'
                    : 'Nuevo Servicio Veterinario'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre del Servicio *"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            inputProps={{ maxLength: 100 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Precio (₡) *"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            inputProps={{ step: '0.01', min: '0' }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Duración (minutos) *"
                            name="duracion_minutos"
                            value={formData.duracion_minutos}
                            onChange={handleChange}
                            inputProps={{ min: '1', step: '1' }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="requiere_ayuno"
                                    checked={formData.requiere_ayuno === 1}
                                    onChange={handleChange}
                                    color="warning"
                                />
                            }
                            label="¿Requiere Ayuno Previo?"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="requiere_cita_previa"
                                    checked={formData.requiere_cita_previa === 1}
                                    onChange={handleChange}
                                    color="info"
                                />
                            }
                            label="¿Requiere Cita Previa?"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="subtitle1"
                            sx={{ mb: 1, fontWeight: 'bold' }}
                        >
                            Imagen del servicio
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Seleccionar imagen

                            <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImagenChange}
                            />
                        </Button>

                        <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1 }}
                        >
                        </Typography>
                    </Grid>

                    {vistaPrevia && (
                        <Grid item xs={12}>
                            <Box
                                component="img"
                                src={vistaPrevia}
                                alt="Vista previa del servicio"
                                sx={{
                                    width: '100%',
                                    maxWidth: 300,
                                    height: 220,
                                    objectFit: 'contain',
                                    borderRadius: 2,
                                    border: '1px solid #ddd'
                                }}
                            />
                        </Grid>
                    )}

                    <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent="space-between"
                        mt={2}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            disabled={submitting}
                        >
                            {submitting
                                ? 'Guardando...'
                                : 'Guardar Servicio'}
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
    );
};
