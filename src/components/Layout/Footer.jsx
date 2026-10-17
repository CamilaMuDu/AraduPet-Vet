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
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: { sm: 'absolute' },
            left: 0,
            top: '50%',
            transform: { sm: 'translateY(-50%)' },
            textAlign: 'center',
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="body2">
            Diseñado por:
          </Typography>
          <Typography variant="body2">
            Jorhan Vega Carvajal
          </Typography>
          <Typography variant="body2">
            Camila Muñoz Durán
          </Typography>
        </Box>

        {/* Textos del centro centrados perfectamente */}
        <Typography variant="body1" align="center">
          AraduPetVet - Gestión Veterinaria
        </Typography>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} AraduPetVet. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;