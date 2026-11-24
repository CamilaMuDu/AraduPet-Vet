import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button,
    Alert,
    CircularProgress
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

import {
    obtenerUsuarios,
    actualizarRolUsuario
} from "../../services/UsuarioService";

export default function ListaUsuarios() {

    const { token } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [guardando, setGuardando] = useState(null);
    useEffect(() => {

        const cargarUsuarios = async () => {
            try {
                setCargando(true);
                setError("");

                const resultado = await obtenerUsuarios(token);

                setUsuarios(resultado);

                const rolesIniciales = {};

                resultado.forEach((usuario) => {
                    rolesIniciales[usuario.id_usuario] = Number(usuario.id_rol);
                });

                setRoles(rolesIniciales);

            } catch (error) {
                setError(
                    error.response?.data?.result ||
                    "No se pudieron cargar los usuarios"
                );
            } finally {
                setCargando(false);
            }
        };

        if (token) {
            cargarUsuarios();
        }

    }, [token]);

    const handleCambioRol = (id, nuevoRol) => {
        setRoles((prev) => ({
            ...prev,
            [id]: Number(nuevoRol)
        }));
    };

    const handleGuardarRol = async (id) => {
        try {
            setGuardando(id);
            setError("");
            setExito("");

            const nuevoRol = roles[id];

            const resultado = await actualizarRolUsuario(
                id,
                nuevoRol,
                token
            );

            setUsuarios((prev) =>
                prev.map((usuario) =>
                    usuario.id_usuario === id
                        ? {
                            ...usuario,
                            id_rol: nuevoRol,
                            rol: nuevoRol === 2
                                ? "Encargado"
                                : "Cliente"
                        }
                        : usuario
                )
            );

            setExito(resultado);

        } catch (error) {
            setError(
                error.response?.data?.result ||
                "No se pudo actualizar el rol"
            );
        } finally {
            setGuardando(null);
        }
    };

    if (cargando) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>

            <Typography variant="h4" gutterBottom>
                Mantenimiento de usuarios
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Administración de usuarios y asignación de roles.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {exito && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {exito}
                </Alert>
            )}

            <TableContainer component={Paper} elevation={3}>
                <Table>

                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#149c4f" }}>
                            {[
                                "ID",
                                "Nombre",
                                "Identificación",
                                "Correo",
                                "Teléfono",
                                "Estado",
                                "Rol",
                                "Acciones"
                            ].map((titulo) => (
                                <TableCell
                                    key={titulo}
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {titulo}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id_usuario} hover>

                                <TableCell>
                                    {usuario.id_usuario}
                                </TableCell>

                                <TableCell>
                                    {usuario.nombre}
                                </TableCell>

                                <TableCell>
                                    {usuario.identificacion}
                                </TableCell>

                                <TableCell>
                                    {usuario.correo}
                                </TableCell>

                                <TableCell>
                                    {usuario.telefono}
                                </TableCell>

                                <TableCell>
                                    {usuario.estado}
                                </TableCell>

                                <TableCell>
                                    {Number(usuario.id_rol) === 1 ? (
                                        <Typography fontWeight="bold">
                                            Administrador
                                        </Typography>
                                    ) : (
                                        <Select
                                            size="small"
                                            value={roles[usuario.id_usuario]}
                                            disabled={guardando !== null}
                                            onChange={(e) =>
                                                handleCambioRol(
                                                    usuario.id_usuario,
                                                    e.target.value
                                                )
                                            }
                                            sx={{ minWidth: 140 }}
                                        >
                                            <MenuItem value={2}>
                                                Encargado
                                            </MenuItem>

                                            <MenuItem value={3}>
                                                Cliente
                                            </MenuItem>
                                        </Select>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {Number(usuario.id_rol) !== 1 && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            disabled={
                                                guardando !== null ||
                                                roles[usuario.id_usuario] ===
                                                Number(usuario.id_rol)
                                            }
                                            onClick={() =>
                                                handleGuardarRol(
                                                    usuario.id_usuario
                                                )
                                            }
                                        >
                                            {guardando === usuario.id_usuario
                                                ? "Guardando..."
                                                : "Guardar"}
                                        </Button>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
}

