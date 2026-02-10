import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminProductsContext = createContext();

const AdminProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getLowStockProducts, setLowStockProducts] = useState([]);
  const [totalPages,setTotalPages] = useState(1)
  const [homeTotalPages,setHomeTotalPages] = useState(1)
  const [totalProducts,setTotalProducts] = useState(0)
  const [totalLowStockProducts,setTotalLowStockProducts] = useState(0)
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  

  // Get low products with pagination
  const lowProducts = async (page = 1, limit = 3) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/products/low-stock-products?page=${page}&limit=${limit}`);
      setLowStockProducts(response.data.getProducts);
      setTotalPages(response.data.totalPages)
      setTotalLowStockProducts(response.data.totalCount)

      console.log("these are total pages ",totalPages)
      console.log("these are low stock products", response.data.getProducts);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    }
  };

  // Fetch all products
  const fetchProducts = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/admin/products/get?page=${page}&limit=${limit}`);
      console.log(res.data.products);
      if (res.data.products) {
        setProducts([...res.data.products]);
        setHomeTotalPages(res.data.totalPages)
        setTotalProducts(res.data.totalCount)
      }
      return res.data.products;
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
      };
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
        lowProducts,
        getLowStockProducts,
        totalPages,
        homeTotalPages,
        totalProducts,
        totalLowStockProducts
       }}

    >
      {children}
    </AdminProductsContext.Provider>
  );
};

export default AdminProductsProvider;