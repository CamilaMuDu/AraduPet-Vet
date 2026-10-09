import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            AraduPetVet
          </Typography>
        </Box>

        <Typography variant="body1">Gestión Veterinaria</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
