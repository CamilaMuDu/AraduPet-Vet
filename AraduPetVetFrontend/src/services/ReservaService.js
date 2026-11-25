
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'reserva';

class ReservaService {

  // Obtener el historial de reservas
  historial() {
    return axios.get(BASE_URL, this.getOpciones());
  }

  // Obtener el detalle de una reserva por ID
  detalle(id) {
    return axios.get(
      BASE_URL + '/get/' + id,
      this.getOpciones()
    );
  }

  // Obtener los clientes registrados
  clientes() {
    return axios.get(
      BASE_URL + '/clientes',
      this.getOpciones()
    );
  }

  // Obtener las mascotas de un cliente
  mascotas(idCliente) {
    return axios.get(
      BASE_URL + '/mascotas/' + idCliente,
      this.getOpciones()
    );
  }

  // Consultar las horas disponibles
  disponibilidad(idServicio, fecha) {
    return axios.get(
      BASE_URL + '/disponibilidad/' + idServicio + '/' + fecha,
      this.getOpciones()
    );
  }

  // Registrar una nueva reserva
  crear(datos) {
    return axios.post(
      BASE_URL + '/create',
      datos,
      this.getOpciones()
    );
  }

  // Obtener las opciones de autenticación
  getOpciones() {
    const token = sessionStorage.getItem('token');

    return {
      headers: {
        Authorization: 'Bearer ' + (token || '')
      }
    };
  }
}

export default new ReservaService();
