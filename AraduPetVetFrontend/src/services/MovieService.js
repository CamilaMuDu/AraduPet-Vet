import axios from 'axios';
//Definición para Llamar al API y obtener el listado de películas
const BASE_URL = import.meta.env.VITE_BASE_URL + 'movie';
class MovieService {
  //Listas peliculas
  //localhost:81/apinombreproyecto/movie
  getMovies() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //localhost:81/apinombreproyecto/movie/1
  getMovieById(MovieId){
    return axios.get(BASE_URL+'/'+MovieId);
  }
  //Obtener peliculas por tienda
  //localhost:81/ apinombreproyecto/movie/moviesByShopRental/1
  getMovieByShopRental(ShopRentalId){
    return axios.get(BASE_URL+'/moviesByShopRental/'+ShopRentalId);
  }
}
export default new MovieService();
