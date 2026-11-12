
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'servicio';

class ServiciosService {

    // Obtener todos los servicios
    getServicios() {
        return axios.get(BASE_URL);
    }

    // Obtener servicio por ID
    getServicioById(id) {
        return axios.get(BASE_URL + '/get/' + id);
    }

    // Crear servicio con imagen
    createServicio(servicio) {
        return axios.post(BASE_URL + '/create', servicio);
    }

    // Actualizar servicio con imagen
    updateServicio(id, servicio) {
        return axios.post(BASE_URL + '/update/' + id, servicio);
    }

    // Eliminar servicio
    deleteServicio(id) {
        return axios.delete(BASE_URL + '/delete/' + id);
    }
}

export default new ServiciosService();
