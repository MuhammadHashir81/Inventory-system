import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminProductsContext = createContext();
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/admin/products/get`);
      setProducts(data.products);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      const { data } = await axios.post(`${apiUrl}/api/admin/products/add`, productData, {
        headers: { "Content-Type": "application/json" },
      });
      setProducts((prev) => [...prev, data.product]);
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/api/admin/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  // Update product
  const updateProduct = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`${apiUrl}/api/admin/products/update/${id}`, updatedData);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product : p))
      );
      return { success: true, message: data.message };
    } catch (error) {
      console.error(error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Server error" };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminProductsContext.Provider
      value={{ products, addProduct, deleteProduct, updateProduct }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
};

export default AdminProductsProvider;
