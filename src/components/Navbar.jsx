import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token"); // Eliminar el token
    navigate("/"); // Redirigir al login
  };

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi Aplicación</h1>
        <button
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;