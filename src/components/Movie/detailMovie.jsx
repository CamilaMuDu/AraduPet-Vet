import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Grid from '@mui/material/Grid';
import MovieService from '../../services/MovieService';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

//Componente para mostrar el detalle de una pelicula
export function DetailMovie() {
  const routeParams = useParams();//Obtener los parámetros de la ruta, en este caso el id de la pelicula
  console.log(routeParams);//Mostrar los parámetros en consola
  const navigate = useNavigate();//Función para volver a la página anterior
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL+'uploads'//MANTIENE LA RUTA DE LA API PARA LAS IMAGENES
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);//Resultado de consumo del API, respuesta
  //Error del API
  const [error, setError] = useState('');//Error del API
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);//Llamar al API y obtener una pelicula
  //Llamar al API y obtener una pelicula
  useEffect(() => {
    //Llamar al API y obtener una pelicula
    MovieService.getMovieById(routeParams.id)//Llamar al servicio para obtener una pelicula por su id
      .then((response) => {
        setData(response.data);//Almacenar la respuesta en el estado
        console.log(response.data);//Mostrar la respuesta en consola
        setError(response.error);//Almacenar el error en el estado
        setLoaded(true);//Marcar como cargado
      })
      .catch((error) => {
        console.log(error);//Mostrar el error en consola
        setError(error);//Almacenar el error en el estado
        throw new Error('Respuesta no válida del servidor');//En caso de error, lanzar un nuevo error con un mensaje personalizado
      });
  }, [routeParams.id]);//El efecto se ejecuta cada vez que el id de la pelicula en los parámetros de la ruta cambia

  if (!loaded) return <p>Cargando...</p>;//Si no se ha cargado, mostrar mensaje de carga
  if (error) return <p>Error: {error.message}</p>;//Si hay un error, mostrar mensaje de error
  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          <Grid size={5}>
            <Box
              component="img"
              sx={{
                borderRadius: '4%',
                maxWidth: '100%',
                height: 'auto',
              }}
              alt="Ticket pelicula"
              src={`${BASE_URL}/${data.imagen?.image}`}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.title}
            </Typography>
            <Typography variant="subtitle1" component="h1" gutterBottom>
              {data.year}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Tiempo: {data.time}
              </Box>{' '}
              minutos
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Idioma:
              </Box>{' '}
              {data.lang}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Director:
              </Box>{' '}
              {data.director.fname} {data.director.lname}
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Generos:</Box>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                {data.genres.map((item) => (
                  <ListItemButton key={item.id}>
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                ))}
              </List>
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Actores:</Box>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                {data.actors.map((item) => (
                  <ListItemButton key={item.id}>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${item.fname} ${item.lname}`} />
                  </ListItemButton>
                ))}
              </List>
            </Typography>
          </Grid>
        </Grid>
      )}
      <Box
        sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
        }}
        >
        <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
        >
            Regresar
        </Button>
        </Box>
    </Container>
  );
}
