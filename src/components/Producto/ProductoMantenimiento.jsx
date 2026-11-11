
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Grid
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ProductoService from '../../services/ProductoService';

const formularioInicial = {
    nombre: '',
    descripcion: '',
    id_categoria: '',
    precio: '',
    marca: '',
    presentacion: '',
    stock: "",
    imagen_url: ''
};

export function ProductoMantenimiento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(formularioInicial);
    const [errores, setErrores] = useState({});

    //validación de campos con Yup
    const esquemaValidacion = yup.object().shape({
        nombre: yup
            .string()
            .trim()
            .required('El nombre del producto es obligatorio')
            .max(100, 'Máximo 100 caracteres'),

        descripcion: yup
            .string()
            .trim()
            .required('La descripción es obligatoria'),

        id_categoria: yup
            .number()
            .typeError('Seleccione una categoría')
            .required('La categoría es obligatoria'),

        precio: yup
            .number()
            .typeError('Ingrese un precio')
            .required('El precio es obligatorio')
            .min(0, 'El precio no puede ser negativo'),

        stock: yup
            .number()
            .transform((valor, valorOriginal) =>
                valorOriginal === '' ? undefined : valor
            )
            .typeError('Ingrese un stock válido')
            .required('El stock es obligatorio')
            .integer('El stock debe ser un número entero'),

        marca: yup
            .string()
            .trim()
            .required('La marca es obligatoria')
            .max(50, 'Máximo 50 caracteres'),

        presentacion: yup
            .string()
            .trim()
            .required('La presentación es obligatoria')
            .max(50, 'Máximo 50 caracteres')
    });
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const modoEdicion = Boolean(id);

    useEffect(() => {
        if (imagenArchivo) {
            const url = URL.createObjectURL(imagenArchivo);
            setVistaPrevia(url);

            return () => URL.revokeObjectURL(url);
        }

        const imagenActual = producto.imagen_url || '';

        if (imagenActual.startsWith('http')) {
            setVistaPrevia(imagenActual);
        } else if (imagenActual) {
            setVistaPrevia(
                `http://localhost/AraduPetVet/${imagenActual.replace(/^\/+/, '')}`
            );
        } else {
            setVistaPrevia('');
        }
    }, [imagenArchivo, producto.imagen_url]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError('');

                const respuestaCategorias =
                    await ProductoService.getCategorias();

                setCategorias(respuestaCategorias.data || []);

                if (modoEdicion) {
                    const respuestaProducto =
                        await ProductoService.getProductoById(id);

                    const datos = respuestaProducto.data;

                    if (!datos) {
                        throw new Error('Producto no encontrado');
                    }
                    setProducto({
                        nombre: datos.nombre || '',
                        descripcion: datos.descripcion || '',
                        id_categoria: datos.id_categoria || '',
                        precio: datos.precio || '',
                        marca: datos.marca || '',
                        presentacion: datos.presentacion || '',
                        stock: datos.stock ?? 0,
                        imagen_url: datos.imagen_url || ''

                    });
                }
            } catch (error) {
                console.error(error);
                setError('No se pudieron cargar los datos del producto.');
            } finally {
                setCargando(false);
            }

        };
        cargarDatos();
    }, [id, modoEdicion]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setProducto((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };


    const manejarEnvio = async (e) => {
        e.preventDefault();

        setError('');
        setMensaje('');
        setErrores({});

        console.log('Botón Actualizar presionado');
        console.log('Datos del producto:', producto);
        console.log('Imagen seleccionada:', imagenArchivo);

        try {
            await esquemaValidacion.validate(producto, {
                abortEarly: false
            });

            console.log('Validación completada correctamente');

            setGuardando(true);

            const datos = new FormData();

            datos.append('nombre', producto.nombre.trim());
            datos.append('descripcion', producto.descripcion.trim());
            datos.append('id_categoria', Number(producto.id_categoria));
            datos.append('precio', Number(producto.precio));
            datos.append('stock', Number(producto.stock));
            datos.append('marca', producto.marca || '');
            datos.append('presentacion', producto.presentacion || '');

            if (imagenArchivo) {
                datos.append('imagen', imagenArchivo);
            }

            let respuesta;

            if (modoEdicion) {
                respuesta = await ProductoService.updateProducto(id, datos);
            } else {
                respuesta = await ProductoService.createProducto(datos);
            }

            console.log('Respuesta del servidor:', respuesta.data);
            if (respuesta.data?.status === 'error' || respuesta.data?.success === false) {
                throw new Error(
                    respuesta.data?.message || 'No se pudo guardar el producto.'
                );
            }

            setMensaje(
                modoEdicion
                    ? 'Producto actualizado correctamente.'
                    : 'Producto registrado correctamente.'
            );

            setImagenArchivo(null);

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                console.log('Errores de validación:', err.errors);
                const nuevosErrores = {};

                err.inner.forEach((validacion) => {
                    if (validacion.path && !nuevosErrores[validacion.path]) {
                        nuevosErrores[validacion.path] = validacion.message;
                    }
                });

                setErrores(nuevosErrores);
                console.log('Errores de Yup:', nuevosErrores);
            } else {
                console.error('Error al guardar producto:', err);

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    err.message ||
                    'No se pudo guardar el producto.'
                );
            }
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>

            <Typography
                variant="h4"
                component="h1"
                color="primary"
                sx={{ mb: 3 }}
            >
                {modoEdicion ? 'Modificar producto' : 'Registrar producto'}
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 3
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {mensaje && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {mensaje}
                    </Alert>
                )}

                <Box component="form" onSubmit={manejarEnvio}>
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Nombre del producto"
                                name="nombre"
                                value={producto.nombre}
                                onChange={manejarCambio}
                                error={Boolean(errores.nombre)}
                                helperText={errores.nombre || ''}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Descripción"
                                name="descripcion"
                                value={producto.descripcion}
                                onChange={manejarCambio}
                                error={Boolean(errores.descripcion)}
                                helperText={errores.descripcion || ''}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Categoría"
                                name="id_categoria"
                                value={producto.id_categoria}
                                onChange={manejarCambio}
                                error={Boolean(errores.id_categoria)}
                                helperText={errores.id_categoria || ''}
                            >
                                {categorias.map((categoria) => (
                                    <MenuItem
                                        key={categoria.id_categoria}
                                        value={categoria.id_categoria}
                                    >
                                        {categoria.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Precio (₡)"
                                name="precio"
                                value={producto.precio}
                                onChange={manejarCambio}
                                slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                                error={Boolean(errores.precio)}
                                helperText={errores.precio || ''}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Marca"
                                name="marca"
                                value={producto.marca}
                                onChange={manejarCambio}
                                slotProps={{ htmlInput: { maxLength: 50 } }}
                                error={Boolean(errores.marca)}
                                helperText={errores.marca || ''}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Presentación"
                                name="presentacion"
                                value={producto.presentacion}
                                onChange={manejarCambio}
                                slotProps={{ htmlInput: { maxLength: 50 } }}
                                error={Boolean(errores.presentacion)}
                                helperText={errores.presentacion || ''}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock"
                                name="stock"
                                value={producto.stock}
                                onChange={manejarCambio}
                                error={Boolean(errores.stock)}
                                helperText={errores.stock || ''}
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        step: 1
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    Seleccionar imagen
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        hidden
                                        onChange={(e) => {
                                            const archivo = e.target.files[0];
                                            if (archivo) {
                                                setImagenArchivo(archivo);
                                            }
                                        }}
                                    />
                                </Button>

                                {imagenArchivo && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Archivo seleccionado: {imagenArchivo.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        {vistaPrevia && (
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                        Vista previa de la imagen
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={vistaPrevia}
                                        alt="Vista previa del producto"
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            objectFit: 'contain',
                                            borderRadius: 2
                                        }}
                                    />
                                </Box>
                            </Grid>
                        )}

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
                                    onClick={() => navigate('/productos/mantenimiento')}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? 'Guardando...'
                                        : modoEdicion
                                            ? 'Actualizar'
                                            : 'Registrar'}
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}