
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import theme from './themes/theme';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <Outlet />
      </AuthProvider>

    </ThemeProvider>
  );
}

export default App;
