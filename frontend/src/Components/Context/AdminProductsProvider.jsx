import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminProductsContext = createContext();

 const AdminProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

const apiUrl = import.meta.env.VITE_BACKEND_URL

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/admin/products/get`);
      console.log(res.data.products)
      if (res.data.products) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sell multiple products in one order
  const sellProducts = async (orderData) => {
    try {
      const res = await axios.post(`${apiUrl}/api/sold-items/sell`, orderData);
      if (res.data.success) {
        // Refresh products after sale
        await fetchProducts();
      }
      return res.data;
    } catch (error) {
      console.error("Error selling products:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Error processing sale" 
      };
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      const res = await axios.post(`${apiUrl}/api/admin/products/add`, productData);
      if (res.data.success) {
        await fetchProducts();
       
      }
      return {
        success: true
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Error adding product" 
      };
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const res = await axios.put(`${apiUrl}/api/admin/products/update/${id}`, productData);
      if (res.data.message) {
        await fetchProducts();
      }
      return res.data;
    } catch (error) {
      console.error("Error updating product:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Error updating product" 
      };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${apiUrl}/api/admin/products/delete/${id}`);
      if (res.data.message) {
        await fetchProducts();
      }
      return res.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Error deleting product" 
      };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminProductsContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        sellProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
};

export default AdminProductsProvider