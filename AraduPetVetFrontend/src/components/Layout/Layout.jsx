import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Encabezado de la aplicación */}
      <Header />

      {/* Contenido principal */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Outlet />
      </Container>

      {/* Pie de página */}
      <Footer />
    </Box>
  );
}

export default Layout;
