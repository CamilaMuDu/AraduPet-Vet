
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    stock: 0,
    imagen_url: ''
};

export function ProductoMantenimiento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(formularioInicial);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const modoEdicion = Boolean(id);

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

        if (
            !producto.nombre.trim() ||
            !producto.descripcion.trim() ||
            !producto.id_categoria ||
            producto.precio === ''
        ) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (Number(producto.precio) < 0) {
            setError('El precio no puede ser negativo.');
            return;
        }

        if (!Number.isInteger(Number(producto.stock)) ||
            Number(producto.stock) < 0) {
            setError('El stock debe ser un número entero mayor o igual a cero.');
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                ...producto,
                id_categoria: Number(producto.id_categoria),
                precio: Number(producto.precio),
                stock: Number(producto.stock)
            };

            if (modoEdicion) {
                await ProductoService.updateProducto(id, datos);
                setMensaje('Producto actualizado correctamente.');
            } else {
                await ProductoService.createProducto(datos);
                setMensaje('Producto registrado correctamente.');
            }

            navigate('/productos');
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                'No se pudo guardar el producto. Verifica los datos e inténtalo nuevamente.'
            );
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
                                required
                                label="Nombre del producto"
                                name="nombre"
                                value={producto.nombre}
                                onChange={manejarCambio}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={3}
                                label="Descripción"
                                name="descripcion"
                                value={producto.descripcion}
                                onChange={manejarCambio}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Categoría"
                                name="id_categoria"
                                value={producto.id_categoria}
                                onChange={manejarCambio}
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
                                required
                                type="number"
                                label="Precio (₡)"
                                name="precio"
                                value={producto.precio}
                                onChange={manejarCambio}
                                inputProps={{ min: 0, step: '0.01' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Marca"
                                name="marca"
                                value={producto.marca}
                                onChange={manejarCambio}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Presentación"
                                name="presentacion"
                                value={producto.presentacion}
                                onChange={manejarCambio}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Stock"
                                name="stock"
                                value={producto.stock}
                                onChange={manejarCambio}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="URL de imagen"
                                name="imagen_url"
                                value={producto.imagen_url}
                                onChange={manejarCambio}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>

                        {producto.imagen_url && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Vista previa de la imagen
                                </Typography>

                                <Box
                                    component="img"
                                    src={producto.imagen_url}
                                    alt="Vista previa"
                                    sx={{
                                        width: 180,
                                        height: 160,
                                        objectFit: 'contain'
                                    }}
                                />
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
                                    onClick={() => navigate('/productos')}
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