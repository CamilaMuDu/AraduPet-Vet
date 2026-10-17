import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="left" sx={{ mb: 2, pl: 2 }}>
          Diseñado por: Jorhan Vega Carvajal y Camila Muñoz Durán
        </Typography>

        <Typography variant="body1" align="center">
          AraduPetVet - Gestión Veterinaria
        </Typography>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} AraduPetVet. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
