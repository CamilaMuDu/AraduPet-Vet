import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'horario';

class HorarioService {
    // Obtener todos los horarios registrados
    getHorarios() {
        return axios.get(BASE_URL);
    }

    // Obtener el horario por ID de doctor
    getHorarioByDoctor(idDoctor) {
        return axios.get(BASE_URL + '/get/' + idDoctor);
    }

    // Crear un nuevo horario
    createHorario(horario) {
        return axios.post(BASE_URL + '/create', horario);
    }

    // Actualizar un horario existente
    updateHorario(id, horario) {
        return axios.put(BASE_URL + '/update/' + id, horario);
    }

    // Eliminar un horario
    deleteHorario(id) {
        return axios.delete(BASE_URL + '/delete/' + id);
    }
}

export default new HorarioService();