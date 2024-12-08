import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Si usas React Router
import api, { setAuthToken } from "../api";

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate(); // Hook para navegación

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica de formulario
    if (!formData.email || !formData.password) {
      setMessage("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true); // Activar carga

    try {
      const response = await api.post("/login", formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token); // Configura el token en Axios
      setIsAuthenticated(true);
      setMessage("Inicio de sesión exitoso.");
      navigate("/dashboard"); // Redirigir a Dashboard
    } catch (error) {
      setMessage("Error al iniciar sesión.");
      setError(error.response?.data?.message || "Error desconocido");
    } finally {
      setLoading(false); // Desactivar carga
    }
  };

  const handleRegister = () => {
    // Redirigir a la página de registro
    navigate("/register");
  };

  return (
    <div className="select-none flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <div className="mb-4">
          <input
            type="text"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          disabled={loading} // Deshabilitar el botón mientras se está cargando
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="w-full p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Registrar usuario
        </button>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("exitoso") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Login;