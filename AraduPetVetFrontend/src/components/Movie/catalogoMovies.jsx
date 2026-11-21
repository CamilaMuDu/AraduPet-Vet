import React from 'react';
import { useState } from 'react';
import MovieService from '../../services/MovieService';
import { useEffect } from 'react';
import { ListCardMovies } from "./listCardMovie.jsx";

export function CatalogMovies() {//
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de peliculas
  useEffect(() => {
    MovieService.getMovies()//Llamar al servicio para obtener las peliculas
      .then((response) => {
        console.log(response);//Mostrar la respuesta en consola
        setData(response.data);//Almacenar la respuesta en el estado
        setError(response.error);//Almacenar el error en el estado
        setLoaded(true);       
      })
      .catch((error) => {
        console.log(error);//Mostrar el error en consola
        if (error instanceof SyntaxError) {
          setError(error);//Almacenar el error en el estado
          setLoaded(false);//En caso de error de sintaxis, establecer el error y marcar como no cargado
        }
      });
  }, []);

  if(!loaded) return <p>Cargando..</p>//Si no se ha cargado, mostrar mensaje de carga
  if(error) return <p>Error: {error.message}</p>//Si hay un error, mostrar mensaje de error
  return <>
    {data && 
        <ListCardMovies data={data} isShopping={false} />}//Si hay datos, mostrar la lista de peliculas
  </>
}
