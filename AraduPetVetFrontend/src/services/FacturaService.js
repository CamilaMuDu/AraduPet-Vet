import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'factura';

class FacturaService {
  getFacturas() {
    return axios.get(BASE_URL);
  }

  getFacturaById(facturaId) {
    return axios.get(BASE_URL + '/get/' + facturaId);
  }
}

export default new FacturaService();
