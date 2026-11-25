
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import theme from './themes/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function CarritoPorUsuario({ children }) {
  const { usuario } = useAuth();
  return <CartProvider key={usuario?.id_usuario || 'invitado'}>{children}</CartProvider>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <CarritoPorUsuario><Outlet /></CarritoPorUsuario>
      </AuthProvider>

    </ThemeProvider>
  );
}

export default App;
