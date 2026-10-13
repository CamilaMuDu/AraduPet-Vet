import axios from 'axios';//MANTIENE LA RUTA DE LA API PARA LOS GENEROS
const BASE_URL = import.meta.env.VITE_BASE_URL + 'genre';//MANTIENE LA RUTA DE LA API PARA LOS GENEROS

class GenreService {
  //Obteniene la lista de generos
  getGenres() {
    return axios.get(BASE_URL);
  }
//Obteniene un genero por su ID
  getGenreById(GenreId) {
    return axios.get(BASE_URL + '/' + GenreId);
  }
  //Obteniene las peliculas de un genero por su ID
  getMoviesbyGenre(GenreId) {
    return axios.get(BASE_URL + '/getMoviesbyGenre/' + GenreId);
  }
}
export default new GenreService();
