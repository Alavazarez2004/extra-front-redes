import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [newProduct, setNewProduct] = useState({ nombre: "", precio: ""});
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos.");
      }
    };

    fetchProducts();
  }, []);

  // Agregar un nuevo producto
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    // Asegurarse de que el precio sea un número
    const precio = parseFloat(newProduct.precio);
    if (!newProduct.nombre || isNaN(precio)) {
      alert("El nombre y el precio deben ser válidos");
      return;
    }
  
    setLoading(true);
    try {
      const response = await api.post("/api/products", {
        nombre: newProduct.nombre,
        precio: precio, // Asegurándote de que el precio sea un número
      });
      setProductos((prevProductos) => [...prevProductos, response.data.producto]);
      setNewProduct({ nombre: "", precio: "" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Actualizar un producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Usar el id del producto para la actualización
      const response = await api.put(`/api/products/${editProduct._id}`, editProduct);
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === editProduct._id ? response.data.producto : producto
        )
      );
      setEditProduct(null); // Cerrar el formulario de edición
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Eliminar un producto
  const handleDeleteProduct = async (productName) => {
    setLoading(true);
    try {
      await api.delete(`/api/products/${productName}`);
      setProductos((prevProductos) =>
        prevProductos.filter((product) => product.nombre !== productName)
      );
    } catch (error) {
      console.error("Error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar productos
  const filteredProducts = productos.filter(
    (product) =>
      product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) // Verifica si product y product.nombre existen
  );  

  return (
    <div className="bg-gray-100 min-h-screen select-none">
      {isAuthenticated && <Navbar />} {/* Muestra el Navbar solo si está autenticado */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">
          Productos
        </h1>

        {/* Formulario para agregar productos */}
        <form onSubmit={handleAddProduct} className="bg-white p-4 shadow-lg rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Agregar nuevo producto</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Precio"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "Cargando..." : "Agregar Producto"}
          </button>
        </form>

        {/* Buscar productos */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300">Nombre</th>
                <th className="px-4 py-2 border border-gray-300">Precio</th>
                <th className="px-4 py-2 border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.nombre}>
                  <td className="px-4 py-2 border border-gray-300">{product.nombre}</td>
                  <td className="px-4 py-2 border border-gray-300">${product.precio}</td>
                  <td className="px-4 py-2 border border-gray-300 space-x-2">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.nombre)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario para editar un producto */}
        {editProduct && (
          <form onSubmit={handleUpdateProduct} className="bg-white p-4 shadow-lg rounded-lg mt-6">
            <h2 className="text-lg font-semibold mb-4">Modificar producto</h2>
            <div className="mb-4">
              <input
                type="text"
                value={editProduct.nombre}
                onChange={(e) => setEditProduct({ ...editProduct, nombre: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                value={editProduct.precio}
                onChange={(e) => setEditProduct({ ...editProduct, precio: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setEditProduct(null)}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Dashboard;