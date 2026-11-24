
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from "@mui/material";

import { registrarUsuario } from "../../services/UsuarioService";

export default function Registro() {

    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        nombre: "",
        identificacion: "",
        telefono: "",
        correo: "",
        direccion: "",
        fecha_nacimiento: "",
        contrasena: "",
        confirmarContrasena: ""
    });

    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setDatos((anteriores) => ({
            ...anteriores,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setExito("");

        if (datos.contrasena.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (datos.contrasena !== datos.confirmarContrasena) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);

        try {
            const { confirmarContrasena, ...datosRegistro } = datos;

            const resultado = await registrarUsuario(datosRegistro);

            setExito(resultado);

        } catch (error) {
            setError(
                error.response?.data?.result ||
                "No se pudo registrar el usuario"
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 650,
                    p: 4,
                    borderRadius: 3
                }}
            >
                <Typography
                    variant="h4"
                    color="primary"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold"
                    }}
                >
                    AraduPet
                </Typography>

                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", mb: 3 }}
                >
                    Crear cuenta
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

                <Box component="form" onSubmit={handleSubmit}>

                    <TextField
                        label="Nombre completo"
                        name="nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Identificación"
                        name="identificacion"
                        value={datos.identificacion}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        value={datos.telefono}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Correo electrónico"
                        name="correo"
                        type="email"
                        value={datos.correo}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Dirección"
                        name="direccion"
                        value={datos.direccion}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={2}
                        margin="normal"
                    />

                    <TextField
                        label="Fecha de nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={datos.fecha_nacimiento}
                        onChange={handleChange}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        value={datos.contrasena}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        helperText="Mínimo 8 caracteres"
                    />

                    <TextField
                        label="Confirmar contraseña"
                        name="confirmarContrasena"
                        type="password"
                        value={datos.confirmarContrasena}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={cargando || Boolean(exito)}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {cargando ? (
                            <CircularProgress
                                size={24}
                                color="inherit"
                            />
                        ) : (
                            "Registrarse"
                        )}
                    </Button>

                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/user/login")}
                    >
                        ¿Ya tienes una cuenta? Iniciar sesión
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}
