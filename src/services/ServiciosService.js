import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';

class ServicioService {
  getServicios() {
    return axios.get(BASE_URL);
  }

  getServicioById(productoId) {
    return axios.get(BASE_URL + '/get/' + productoId);
  }
}

export default new ServicioService();