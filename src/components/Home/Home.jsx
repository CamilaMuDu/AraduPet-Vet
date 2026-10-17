import { Box, Typography, Button, Paper, Stack } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box>
      {/* Título principal */}
      <Typography 
      variant="h3" component="h1" align="center" gutterBottom
      color="primary"
      >
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
    </Box>
  );
}

export default Home;
