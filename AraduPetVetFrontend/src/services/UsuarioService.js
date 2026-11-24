import axios from "axios";

const API_URL = "http://localhost/AraduPetVet";

export const loginUsuario = async (correo, contrasena) => {
  const response = await axios.post(`${API_URL}/usuario/login`, {
    correo,
    contrasena,
  });

  return response.data.result;
};

export const registrarUsuario = async (datos) => {
  const response = await axios.post(
    `${API_URL}/usuario/registrar`,
    datos
  );

  return response.data.result;
};


export const obtenerUsuarios = async (token) => {
  const response = await axios.get(`${API_URL}/usuario`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.result;
};

export const actualizarRolUsuario = async (id, idRol, token) => {
  const response = await axios.put(
    `${API_URL}/usuario/update/${id}`,
    {
      id_rol: idRol
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data.result;
};

