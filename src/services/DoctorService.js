import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'doctor';

class DoctorService {

    //Lista veterinarios
    getDoctores() {
        return axios.get(BASE_URL);
    }

    //consultar veterinario por ID
    getDoctorById(doctorId) {
        return axios.get(BASE_URL + '/get/' + doctorId);
    }

    //Registrar veterinario
    createDoctor(doctor) {
        return axios.post(BASE_URL + '/create', doctor);
    }

    //Actualizar veterinario
    updateDoctor(doctorId, doctor) {
        return axios.put(BASE_URL + '/update/' + doctorId, doctor);
    }
}

export default new DoctorService();