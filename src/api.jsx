import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/", // Cambia la URL si despliegas en producción
});

// Configurar el token para las solicitudes autenticadas
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;