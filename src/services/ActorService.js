import axios from 'axios';
//MANTIENE LA RUTA DE LA API PARA LOS ACTORES 
const BASE_URL = import.meta.env.VITE_BASE_URL + 'actor';  

class ActorService {
//Lista de actores
  getActors() {
    return axios.get(BASE_URL);
  }
//Lista de actores por película
  getActorById(ActorId) {
    return axios.get(BASE_URL + '/' + ActorId);
  }
}
export default new ActorService();
