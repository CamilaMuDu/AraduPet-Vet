import axios from 'axios';

//const BASE_URL = import.meta.env.VITE_BASE_URL + 'servicio';
//    || 'http://localhost:81/AraduPetVet/AraduPetVetFrontend'
const BASE_URL = import.meta.env.VITE_BASE_URL  + 'servicio';

class ServiciosService {
    // Obtener todos los servicios (llama al método index() del controlador)
    getServicios() {
        return axios.get(BASE_URL);
    }

    // Obtener un servicio por ID (llama al método get($id) del controlador)
    getServicioById(id) {
        return axios.get(BASE_URL + '/get/' + id);
    }

    // Crear un nuevo servicio (llama al método create() del controlador)
    createServicio(servicio) {
        return axios.post(BASE_URL + '/create', servicio);
    }

    // Actualizar un servicio (llama al método update($id) del controlador)
    updateServicio(id, servicio) {
        return axios.put(BASE_URL + '/update/' + id, servicio);
    }

    // Eliminar/Inactivar un servicio (llama al método delete($id) del controlador)
    deleteServicio(id) {
        return axios.delete(BASE_URL + '/delete/' + id);
    }
}

export default new ServiciosService();