
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import Home from "./components/Home/Home";
import PageNotFound from "./components/Home/PageNotFound";
import Layout from "./components/Layout/Layout";
import { CatalogoProductos } from "./components/Producto/CatalogoProductos.jsx";
import { DetalleProducto } from "./components/Producto/DetalleProducto.jsx";
import { ProductoMantenimiento } from "./components/Producto/ProductoMantenimiento.jsx";
import { ListaMantenimientoProductos } from "./components/Producto/ListaMantenimientoProductos.jsx";
import { ListServicios } from "./components/Servicios/ListServicios.jsx";
import { CatalogoServicios } from "./components/Servicios/CatalogoServicios.jsx";
import { DetalleServicio } from "./components/Servicios/DetalleServicio.jsx";
import HistorialReservas from "./components/Citas/HistorialReservas.jsx";
import RegistroReservaAdmin from "./components/Citas/RegistroReservaAdmin.jsx";
import CarritoReservas from "./components/Citas/CarritoReservas.jsx";
import DetalleReserva from "./components/Citas/DetalleReserva.jsx";
import { ListaFacturas } from "./components/Factura/ListaFacturas.jsx";
import { DetalleFactura } from "./components/Factura/DetalleFactura.jsx";
import { ListaMantenimientoDoctores } from "./components/Doctor/ListaMantenimientoDoctores";
import { DoctorMantenimiento } from "./components/Doctor/DoctorMantenimiento.jsx";
import { ListaMantenimientoHorarios } from "./components/Doctor/ListaMantenimientoHorarios.jsx";
import { DetalleDoctor } from "./components/Doctor/DetalleDoctor";
import { DetalleHorario } from "./components/Doctor/DetalleHorario";
import { DetalleBloqueoHorario } from './components/Doctor/DetalleBloqueoHorario.jsx';
import Login from "./components/Usuario/Login.jsx";
import Registro from "./components/Usuario/Registro.jsx";
import RutaProtegida from "./components/Usuario/RutaProtegida.jsx";
import RutaRol from "./components/Usuario/RutaRol.jsx";
import TableMovies from "./components/Movie/TableMovies";
import { ListMovies } from "./components/Movie/listMovies.jsx";
import { DetailMovie } from "./components/Movie/detailMovie.jsx";
import { CatalogMovies } from "./components/Movie/catalogoMovies.jsx";
import ListaUsuarios from "./components/Usuario/ListaUsuarios";


const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/registro",
        element: <Registro />,
      },
      {
        element: <RutaProtegida />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: "/",
                element: <Home />,
              },
              {
                path: "/citas",
                element: <HistorialReservas />,
              },
              {
                path: "/carrito",
                element: <CarritoReservas />,
              },
              {
                path: "/reservas/detalle/:id",
                element: <DetalleReserva />,
              },
              {
                path: "/productos",
                element: <CatalogoProductos />,
              },
              {
                path: "/productos/:id",
                element: <DetalleProducto />,
              },
              {
                path: "/servicios",
                element: <CatalogoServicios />,
              },
              {
                path: "/servicios/:id",
                element: <DetalleServicio />,
              },
              {
                path: "/facturas",
                element: <ListaFacturas />,
              },
              {
                path: "/facturas/:id",
                element: <DetalleFactura />,
              },
              {
                element: (
                  <RutaRol
                    rolesPermitidos={["Administrador", "Encargado"]}
                  />
                ),
                children: [
                  {
                    path: "/citas/nueva",
                    element: <RegistroReservaAdmin />,
                  },
                  {
                    path: "/productos/mantenimiento",
                    element: <ListaMantenimientoProductos />,
                  },
                  {
                    path: "/productos/crear",
                    element: <ProductoMantenimiento />,
                  },
                  {
                    path: "/productos/editar/:id",
                    element: <ProductoMantenimiento />,
                  },
                  {
                    path: "/servicios/mantenimiento",
                    element: <ListServicios />,
                  },
                  {
                    path: "/horarios/mantenimiento",
                    element: <ListaMantenimientoHorarios />,
                  },
                  {
                    path: "/horarios/detalle/:id",
                    element: <DetalleHorario />,
                  },
                  {
                      path: '/horarios/bloqueos/detalle/:id',
                      element: <DetalleBloqueoHorario />,
                  },
                  {
                    path: "/veterinarios/mantenimiento",
                    element: <ListaMantenimientoDoctores />,
                  },
                  {
                    path: "/doctores/crear",
                    element: <DoctorMantenimiento />,
                  },
                  {
                    path: "/doctores/editar/:id",
                    element: <DoctorMantenimiento />,
                  },
                  {
                    path: "/veterinarios/detalle/:id",
                    element: <DetalleDoctor />,
                  },
                ],
              },
              {
                element: <RutaRol rolesPermitidos={["Administrador"]} />,
                children: [
                  {
                    path: "/usuarios/mantenimiento",
                    element: <ListaUsuarios />
                  }
                ]
              },
              {
                path: "/catalog-movies/",
                element: <CatalogMovies />,
              },
              {
                path: "/movie/",
                element: <ListMovies />,
              },
              {
                path: "/movie/:id",
                element: <DetailMovie />,
              },
              {
                path: "/movie-table",
                element: <TableMovies />,
              },
              {
                path: "*",
                element: <PageNotFound />,
              },
            ],
          },
        ],
      },
    ],
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
