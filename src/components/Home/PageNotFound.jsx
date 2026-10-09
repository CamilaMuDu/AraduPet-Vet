import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
      }}
    >
      <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold' }}>
        404
      </Typography>

      <Typography variant="h4" gutterBottom>
        Página no encontrada
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        La página que estás buscando no existe o ha sido movida.
      </Typography>

      <Button
        variant="contained"
        component={RouterLink}
        to="/"
        startIcon={<HomeIcon />}
      >
        Volver al inicio
      </Button>
    </Box>
  );
}

export default PageNotFound;
