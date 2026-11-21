import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccessTime from '@mui/icons-material/AccessTime';
import Language from '@mui/icons-material/Language';
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';

//Componente para mostrar la lista de peliculas en formato tarjeta
ListCardMovies.propTypes = {
  data: PropTypes.array,//Propiedad data, un array de objetos con la información de las peliculas
  isShopping: PropTypes.bool.isRequired,//Propiedad isShopping, un booleano que indica si se muestra la lista en el contexto de compra o no
};

export function ListCardMovies({ data, isShopping }) {//Componente para mostrar la lista de peliculas en formato tarjeta
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';//MANTIENE LA RUTA DE LA API PARA LAS IMAGENES
  //Resultado de consumo del API, respuesta
  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {/* ()=>{} */}
      {data &&
        data.map((item) => (
          <Grid size={4} key={item.id}>
            {/* se crea la tarjeta para cada pelicula, con la información obtenida del API */}
            <Card>
                {/* encabezado de la tarjeta con el título y año de la pelicula, con un fondo de color secundario y texto blanco */}
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.common.white,
                }}
                style={{ textAlign: 'center' }}
                title={item.title}
                subheader={item.year}
              />
                {/* imagen de la pelicula, obtenida del API, con un estilo de borde redondeado */}
              <CardMedia
                component="img"
                image={`${BASE_URL}/${item.imagen?.image}`}
                alt={item.title}
              />
              {/* contenido de la tarjeta con el tiempo y el idioma de la pelicula, y si se muestra en el contexto de compra, también se muestra el precio */}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <AccessTime /> Tiempo: {item.time} minutos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Language /> Idioma: {item.lang}
                </Typography>
                {isShopping && (
                  <Typography variant="h6" align="right" gutterBottom>
                    &cent;{item.price}
                  </Typography>
                )}
              </CardContent>
                {/* acciones de la tarjeta, con un botón para ver el detalle de la pelicula, y si se muestra en el contexto de compra, también se muestra un botón para agregar al carrito */}
              <CardActions
                disableSpacing
                sx={{
                  backgroundColor: (theme) => theme.palette.action.focus,
                  color: (theme) => theme.palette.common.white,
                }}
              >
                {/* icono de información para ver el detalle de la pelicula, con un enlace a la ruta del detalle de la pelicula */}
                <IconButton
                  component={Link}
                  to={`/movie/${item.id}`}
                  aria-label="Detalle"
                  sx={{ ml: 'auto' }}
                >
                  <Info />
                </IconButton>
                {isShopping && (
                  <IconButton
                    aria-label="Comprar"
                    sx={{ ml: 'auto' }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
