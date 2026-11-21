import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: 8,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* fondo con la imagen transparente */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/imagen/logo/logoAradupet.jpeg')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          opacity: 0.15, 
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Título principal */}
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          gutterBottom
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
    </Box>
  );
}

export default Home;