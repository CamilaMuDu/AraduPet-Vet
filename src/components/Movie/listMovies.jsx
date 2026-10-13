import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardMovies } from './ListCardMovies';
import MovieService from '../../services/MovieService';
//Componente para mostrar la lista de peliculas de una tienda
export function ListMovies() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  let idShopRental = 1;
  //Llamar al API y obtener la lista de peliculas de una tienda
  useEffect(() => {
    MovieService.getMovieByShopRental(idShopRental)//Llamar al servicio para obtener las peliculas de una tienda por su id
      .then((response) => {
        console.log(response);//Mostrar la respuesta en consola
        setData(response.data);//Almacenar la respuesta en el estado
        setError(response.error);//Almacenar el error en el estado
        setLoaded(true);       //Marcar como cargado
      })
      .catch((error) => {//Mostrar el error en consola
        console.log(error);//Almacenar el error en el estado
        if (error instanceof SyntaxError) {//En caso de error de sintaxis, establecer el error y marcar como no cargado
          setError(error);//En caso de error de sintaxis, establecer el error y marcar como no cargado
          setLoaded(false);//En caso de error de sintaxis, establecer el error y marcar como no cargado
        }
      });
  }, [idShopRental]);//El efecto se ejecuta cada vez que el id de la tienda de alquiler cambia
  if(!loaded) return <p>Cargando..</p>//Si no se ha cargado, mostrar mensaje de carga
  if(error) return <p>Error: {error.message}</p>//Si hay un error, mostrar mensaje de error
  return <>
        	{data && 
            // muestra la lista de peliculas en formato tarjeta, con la propiedad isShopping en true para mostrar el precio de las peliculas en el contexto de compra
            <ListCardMovies data={data} isShopping={true} />}
    </>
}
