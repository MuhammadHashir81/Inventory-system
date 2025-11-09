import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Your backend URL
export const AdminProductsContext = createContext();

const AdminProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/products/get`);
      if (res.data.products) setProducts(res.data.products);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  // Sell a product
  const sellProduct = async (productId, data) => {
    try {
      const res = await axios.post(`${apiUrl}/api/sold-items/sell`, { productId, ...data });
      if (res.data.success) {

        // setProducts(products.map(p => 
        //   p._id === productId ? res.data.updatedProduct : p
        // ));

        fetchProducts()
      }
      return res.data;
    } catch (error) {
      console.error("Sell product error:", error);
      return { success: false, message: "Server error" };
    }
  };

  // Add a new product
  const addProduct = async (data) => {
    try {
      const res = await axios.post(`${apiUrl}/api/admin/products/add`, data);
      if (res.data.product) {
        setProducts(prev => [...prev, res.data.product]);
        
      }
      return { success: true, message: res.data.message || "Product added successfully!" };
    } catch (error) {
      console.error("Add product error:", error);
      return { success: false, message: "Server error" };
    }
  };

  // Update an existing product
  const updateProduct = async (productId, data) => {
    try {
      const res = await axios.put(`${apiUrl}/api/admin/products/update/${productId}`, data);
      if (res.data.product) {
        setProducts(products.map(p => 
          p._id === productId ? res.data.product : p
        ));
      }
      return res.data;
    } catch (error) {
      console.error("Update product error:", error);
      return { success: false, message: "Server error" };
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      const res = await axios.delete(`${apiUrl}/api/admin/products/delete/${productId}`);
      if (res.data.message === "Product deleted successfully") {
        setProducts(products.filter(p => p._id !== productId));
      }
      return res.data;
    } catch (error) {
      console.error("Delete product error:", error);
      return { success: false, message: "Server error" };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminProductsContext.Provider
      value={{
        products,
        fetchProducts,
        sellProduct,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
};

export default AdminProductsProvider;
