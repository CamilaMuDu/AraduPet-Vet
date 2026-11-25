import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import PetsIcon from "@mui/icons-material/Pets";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";

export default function Header() {

  const navigate = useNavigate();

  const { usuario, logout } = useAuth();
  const { cart, getCountItems } = useCart();
  const esAdministrador = usuario?.rol === "Administrador";

  const esEncargado = usuario?.rol === "Encargado";

  const esCliente = usuario?.rol === "Cliente";

  const puedeGestionar = esAdministrador || esEncargado;

  const [anchorElUser, setAnchorEl] = React.useState(null);

  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);

  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);

  const [anchorElMantenimientos, setAnchorElMantenimientos] = React.useState(null);

  const handleOpenMantenimientos = (event) => {
    setAnchorElMantenimientos(event.currentTarget);
  };

  const handleCloseMantenimientos = () => {
    setAnchorElMantenimientos(null);
  };


  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };

  const handleLogout = () => {
    logout();

    handleUserMenuClose();

    navigate("/user/login", { replace: true });
  };

  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };

  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };

  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const navItems = [
    { name: "Productos", link: "/productos" },
    { name: "Servicios", link: "/servicios/" },
    { name: "Citas", link: "/citas" },
    { name: "Factura", link: "/facturas" },
  ];

  const mantenimientoItems = [
    { name: "Productos", link: "/productos/mantenimiento" },
    { name: "Servicios", link: "/servicios/mantenimiento" },
    { name: "Veterinarios", link: "/veterinarios/mantenimiento" },
    { name: "Horarios", link: "/horarios/mantenimiento" },

    ...(esAdministrador
      ? [{ name: "Usuarios", link: "/usuarios/mantenimiento" }]
      : [])
  ];

  const menuIdPrincipal = "menu-appbar";

  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
      {navItems.slice(0, 2).map((item, index) => (
        <Button
          key={index}
          component={Link}
          to={item.link}
          color="primary"
        >
          <Typography sx={{ textAlign: "center" }}>
            {item.name}
          </Typography>
        </Button>
      ))}

      {puedeGestionar && (
        <>
          <Button
            color="primary"
            onClick={handleOpenMantenimientos}
            endIcon={<ArrowDropDownIcon />}
          >
            <Typography sx={{ textAlign: "center" }}>
              Mantenimientos
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorElMantenimientos}
            open={Boolean(anchorElMantenimientos)}
            onClose={handleCloseMantenimientos}
          >
            {mantenimientoItems.map((item) => (
              <MenuItem
                key={item.name}
                component={item.link !== "#" ? Link : "li"}
                to={item.link !== "#" ? item.link : undefined}
                disabled={item.link === "#"}
                onClick={handleCloseMantenimientos}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      {navItems.slice(2).map((item, index) => (
        <Button
          key={index}
          component={Link}
          to={item.link}
          color="primary"
        >
          <Typography textAlign="center">{item.name}</Typography>
        </Button>
      ))}
    </Box>
  );

  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
    </MenuItem>
  ));

  const userMenuId = "user-menu";
  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="Usuario conectado"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id={userMenuId}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {usuario?.nombre}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {usuario?.correo}
          </Typography>

          <Typography variant="body2" color="primary">
            Rol: {usuario?.rol}
          </Typography>
        </Box>

        <MenuItem onClick={handleLogout}>
          <Typography color="error">
            Cerrar sesión
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  const menuOpcionesId = "badge-menu-mobile";

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem onClick={() => { handleOpcionesMenuClose(); navigate('/carrito'); }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={getCountItems(cart)}
            color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>

          <Tooltip title="AraduPet-Vet Inicio">
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              aria-label="AraduPet-Vet Inicio"
              color="primary"
            >
              <PetsIcon />
            </IconButton>
          </Tooltip>

          {menuPrincipal}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit" aria-label="Ir al carrito" onClick={() => navigate('/carrito')}>
              <Badge badgeContent={getCountItems(cart)} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
