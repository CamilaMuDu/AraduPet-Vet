import axios from 'axios';

const BASE_URL =
    import.meta.env.VITE_BASE_URL + 'excepcionesHorario';

class ExcepcionesHorarioService {

    // Obtener todos los bloqueos
    getBloqueos() {
        return axios.get(BASE_URL);
    }

    // Obtener bloqueos de un veterinario
    getBloqueosByDoctor(idDoctor) {
        return axios.get(
            BASE_URL + '/getByDoctor/' + idDoctor
        );
    }

    // Obtener detalle de un bloqueo
    getBloqueoById(id) {
        return axios.get(BASE_URL + '/get/' + id);
    }

    // Registrar bloqueo
    createBloqueo(bloqueo) {
        return axios.post(
            BASE_URL + '/create',
            bloqueo
        );
    }

    // Eliminar bloqueo
    deleteBloqueo(id) {
        return axios.delete(
            BASE_URL + '/delete/' + id
        );
    }
}

export default new ExcepcionesHorarioService();
