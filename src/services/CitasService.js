import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'cita';

class CitasService {
  getCitas() {
    return axios.get(BASE_URL);
  }

  getCitaById(id) {
    return axios.get(BASE_URL + '/get/' + id);
  }
}
export default new CitasService();