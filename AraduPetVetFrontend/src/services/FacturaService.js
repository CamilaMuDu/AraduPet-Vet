import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'factura';

class FacturaService {

  getFacturas(token) {
    return axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getFacturaById(facturaId, token) {
    return axios.get(BASE_URL + '/get/' + facturaId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export default new FacturaService();