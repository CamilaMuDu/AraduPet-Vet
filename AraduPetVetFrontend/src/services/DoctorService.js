import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'doctor';

class DoctorService {

    getDoctores() {
        return axios.get(BASE_URL);
    }

    getDoctorById(doctorId) {
        return axios.get(BASE_URL + '/get/' + doctorId);
    }

    createDoctor(doctor) {
        return axios.post(BASE_URL + '/create', doctor);
    }

    updateDoctor(doctorId, doctor) {
        return axios.put(BASE_URL + '/update/' + doctorId, doctor);
    }

    deleteDoctor(doctorId) {
    return axios.delete(BASE_URL + '/delete/' + doctorId);
    }
}

export default new DoctorService();