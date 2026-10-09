import { Box, Typography, Button, Paper, Stack } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box>
      {/* Título principal */}
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Bienvenido a AraduPetVet
      </Typography>

      {/* Descripción */}
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Sistema de gestión de citas y trámites veterinarios.
      </Typography>

      {/* Sección principal */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Administración Veterinaria
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Organiza las citas, administra los trámites y facilita la atención de
          las mascotas.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button variant="contained" component={RouterLink} to="/citas">
            Gestionar citas
          </Button>

          <Button variant="outlined" component={RouterLink} to="/tramites">
            Ver trámites
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Home;
