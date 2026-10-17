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
            path: '/productos',
            element: <CatalogoProductos />,
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
