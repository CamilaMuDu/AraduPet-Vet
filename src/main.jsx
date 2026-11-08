import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import { RouterProvider } from "react-router";
import PageNotFound from "./components/Home/PageNotFound";
import TableMovies from "./components/Movie/TableMovies";
import { ListMovies } from "./components/Movie/listMovies.jsx";
import { DetailMovie } from "./components/Movie/detailMovie.jsx";
import { CatalogMovies } from "./components/Movie/catalogoMovies.jsx";
import Layout from './components/Layout/Layout';
import { CatalogoProductos } from "./components/Producto/CatalogoProductos.jsx";
import { DetalleProducto } from './components/Producto/DetalleProducto.jsx';
import { ProductoMantenimiento } from "./components/Producto/ProductoMantenimiento.jsx";
import Citas from "./components/Citas/Citas.jsx";
import { ListaFacturas } from './components/Factura/ListaFacturas.jsx';
import { DetalleFactura } from './components/Factura/DetalleFactura.jsx';
import DetalleCita from './components/Citas/DetalleCita';
import { ListaMantenimientoProductos } from './components/Producto/ListaMantenimientoProductos.jsx';
import { ListServicios } from './components/Servicios/ListServicios.jsx';
import { ListaMantenimientoDoctores } from './components/Doctor/ListaMantenimientoDoctores';
import { DoctorMantenimiento } from './components/Doctor/DoctorMantenimiento.jsx';
import { ListaMantenimientoHorarios } from './components/Doctor/ListaMantenimientoHorarios.jsx';
import { CatalogoServicios } from './components/Servicios/CatalogoServicios.jsx';
import { DetalleServicio } from './components/Servicios/DetalleServicio.jsx';



const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/citas',
            element: <Citas />,
          },
          {
            path: 'citas/detalle/:id',
            element: <DetalleCita />
          },
          {
            path: '/productos',
            element: <CatalogoProductos />,
          },
          {
            path: '/productos/mantenimiento',
            element: <ListaMantenimientoProductos />,
          },
          {
            path: '/productos/crear',
            element: <ProductoMantenimiento />,
          },
          {
            path: '/productos/editar/:id',
            element: <ProductoMantenimiento />,
          },
          {
            path: '/productos/:id',
            element: <DetalleProducto />,
          },
          {
            path: '/servicios',
            element: <CatalogoServicios />,
          },
          {
            path: '/servicios/:id',
            element: <DetalleServicio />,
          },
          {
            path: '/Servicios/mantenimiento',
            element: <ListServicios />,
          },
          {
            path: '/horarios/mantenimiento',
            element: <ListaMantenimientoHorarios />,
          },
          {
            path: '/facturas',
            element: <ListaFacturas />,
          },
          {
            path: '/facturas/:id',
            element: <DetalleFactura />,
          },
          {
            path: '/veterinarios/mantenimiento',
            element: <ListaMantenimientoDoctores />,
          },
          {
            path: '/doctores/crear',
            element: <DoctorMantenimiento />,
          },
          {
            path: '/doctores/editar/:id',
            element: <DoctorMantenimiento />,
          },
          {
            path: '/catalog-movies/',
            element: <CatalogMovies />,
          },
          {
            path: '/movie/',
            element: <ListMovies />,
          },
          {
            path: '/movie/:id',
            element: <DetailMovie />,
          },
          {
            path: '/movie-table',
            element: <TableMovies />,
          },
          {
            path: '*',
            element: <PageNotFound />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
);
