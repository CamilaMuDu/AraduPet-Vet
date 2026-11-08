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
import ServicioService from "../../services/ServiciosService";

export const FormServicio = ({ initialData, onCancel, onSuccess }) => {
    // 1. Estado inicial del formulario (vacío o con datos para editar)
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion_minutos: 30,
        requiere_ayuno: 0,
        requiere_cita_previa: 1
    });

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // 2. Si recibimos datos iniciales (edición), los cargamos en el estado
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                precio: initialData.precio || '',
                duracion_minutos: initialData.duracion_minutos || 30,
                requiere_ayuno: initialData.requiere_ayuno ?? 0,
                requiere_cita_previa: initialData.requiere_cita_previa ?? 1
            });
        }
    }, [initialData]);

    // 3. Manejador unificado de inputs y switches
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    // 4. Enviar el formulario a PHP via Axios
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validaciones en el Frontend
        if (!formData.nombre.trim() || !formData.precio || !formData.duracion_minutos) {
            setError('Por favor complete los campos obligatorios: Nombre, Precio y Duración.');
            return;
        }

        try {
            setSubmitting(true);
            if (initialData && initialData.id_servicio) {
                // Modo Edición (PUT)
                await ServicioService.updateServicio(initialData.id_servicio, formData);
            } else {
                // Modo Creación (POST)
                await ServicioService.createServicio(formData);
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error al guardar el servicio:", err);
            setError("Ocurrió un error al guardar el servicio en el servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ mb: 3 }}>
                {initialData ? 'Editar Servicio Veterinicio' : 'Nuevo Servicio Veterinario'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
                            inputProps={{ step: "0.01", min: "0" }}
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
                            inputProps={{ min: "5" }}
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

                    <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
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
                            {submitting ? 'Guardando...' : 'Guardar Servicio'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};