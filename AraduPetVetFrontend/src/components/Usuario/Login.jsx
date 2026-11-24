
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { loginUsuario } from "../../services/UsuarioService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const resultado = await loginUsuario(correo, contrasena);
      login(resultado);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.result ||
        "No se pudo iniciar sesión. Inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          AraduPet
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Iniciar sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={cargando}
            sx={{ mt: 3, py: 1.5 }}
          >
            {cargando ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Ingresar"
            )}
          </Button>
          <Button
            type="button"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/user/registro")}
          >
            ¿No tienes una cuenta? Registrarse
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
