import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'director';//MANTIENE LA RUTA DE LA API PARA LOS DIRECTORES

class DirectorService {
  //Obteniene la lista de directores
  getDirectores() {
    return axios.get(BASE_URL);
  }
//Obteniene un director por su ID
  getDirectorById(DirectorId) {
    return axios.get(BASE_URL + '/' + DirectorId);
  }
  //Obteniene las peliculas de un director por su ID
  getMoviesbyDirector(DirectorId) {
    return axios.get(BASE_URL + '/getMoviesbyDirector/' + DirectorId);
  }
}
export default new DirectorService();
