import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useNavigate } from 'react-router-dom';
import ProductoService from '../../services/ProductoService';

export function ListaMantenimientoProductos() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const cargarProductos = () => {
        setCargando(true);
        setError('');

        ProductoService.getProductos()
            .then((response) => {
                setProductos(response.data);
                setCargando(false);
            })
            .catch((err) => {
                console.error(err);
                setError('No se pudieron cargar los productos.');
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarProductos();
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
                    Mantenimiento de productos
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/productos/crear')}
                >
                    Registrar producto
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!error && productos.length === 0 ? (
                <Alert severity="info">
                    No hay productos registrados.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#E1F5FE' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Categoría</strong></TableCell>
                                <TableCell><strong>Precio</strong></TableCell>
                                <TableCell><strong>Marca</strong></TableCell>
                                <TableCell><strong>Existencias</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {productos.map((producto) => (
                                <TableRow key={producto.id_producto} hover>
                                    <TableCell>{producto.id_producto}</TableCell>
                                    <TableCell>{producto.nombre}</TableCell>
                                    <TableCell>
                                        {producto.categoria?.nombre ||
                                            producto.nombre_categoria ||
                                            producto.categoria ||
                                            '—'}
                                    </TableCell>
                                    <TableCell>
                                        ₡{Number(producto.precio).toLocaleString('es-CR')}
                                    </TableCell>
                                    <TableCell>{producto.marca || '—'}</TableCell>
                                    <TableCell>{producto.stock}</TableCell>

                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            onClick={() =>
                                                navigate(`/productos/${producto.id_producto}`)
                                            }
                                            title="Ver detalle"
                                        >
                                            <VisibilityIcon />
                                        </Button>

                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                navigate(`/productos/editar/${producto.id_producto}`)
                                            }
                                            title="Editar producto"
                                        >
                                            <EditIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}