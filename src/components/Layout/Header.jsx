import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import PetsIcon from "@mui/icons-material/Pets";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Header() {

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

  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

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

      <Button
        color="primary"
        onClick={handleOpenMantenimientos}
        endIcon={<ArrowDropDownIcon />}
      >
        <Typography sx={{ textAlign: 'center' }}>Mantenimientos</Typography>
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

      {navItems.slice(2).map((item, index) => (
        <Button
          key={index}
          component={Link}
          to={item.link}
          color="primary"
        >
          <Typography sx={{ textAlign: 'center' }}>{item.name}</Typography>
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
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
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
        <MenuItem>
          <Typography variant="subtitle1" gutterBottom>
            Email usuario
          </Typography>
        </MenuItem>

        {userItems.map((setting, index) => {
          return (
            <MenuItem key={index} component={Link} to={setting.link}>
              <Typography sx={{ textAlign: "center" }}>
                {setting.name}
              </Typography>
            </MenuItem>
          );
        })}
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
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4}
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
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="primary">
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
