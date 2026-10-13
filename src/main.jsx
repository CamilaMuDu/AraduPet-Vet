import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import { ListMovies } from "./components/Movie/ListMovies";
import { DetailMovie } from "./components/Movie/DetailMovie";
import TableMovies from "./components/Movie/TableMovies";
import { CatalogMovies } from './components/Movie/CatalogMovies.jsx';

const rutas=createBrowserRouter(
  [
    {
      element: <App />,
      children:[
        {
          path:'/',
          element: <Home />
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        {
          path: '/catalog-movies/',
          element: <CatalogMovies />,
        },
        {
          path:'/movie/',
          element: <ListMovies />
        },
        {
          path:'/movie/:id',
          element: <DetailMovie />
        },
        {
          path:'/movie-table',
          element: <TableMovies />
        },
      ]
    }
  ]
)

createRoot(document.getElementById("root")).render(
  <StrictMode> 
  <RouterProvider router={rutas} /> 
</StrictMode>, 
);
