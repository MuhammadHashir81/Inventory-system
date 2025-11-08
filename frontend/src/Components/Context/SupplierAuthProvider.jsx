// frontend/src/Components/Context/SupplierAuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SupplierAuthContext = createContext();


const apiUrl = import.meta.env.VITE_BACKEND_URL;

const SupplierAuthProvider = ({ children }) => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check supplier authentication on load
  useEffect(() => {
    const verifySupplier = async () => {
      try {
        const res = await axios.get(` ${apiUrl}/api/supplier/verify`, { withCredentials: true });
        setSupplier(res.data.supplier);
      } catch {
        setSupplier(null);
      } finally {
        setLoading(false);
      }
    };
    verifySupplier();
  }, []);

  // ✅ Login supplier
  const loginSupplier = async (name, password) => {
    const res = await axios.post(
      `${apiUrl}/api/supplier/login`,
      { name, password },
      { withCredentials: true }
    );
    setSupplier(res.data.supplier || { name }); // set supplier
    return res.data;
  };

  // ✅ Logout supplier
  const logoutSupplier = async () => {
    await axios.post(`${apiUrl}/api/supplier/logout`, {}, { withCredentials: true });
    setSupplier(null);
  };

  return (
    <SupplierAuthContext.Provider value={{ supplier, loginSupplier, logoutSupplier, loading }}>
      {children}
    </SupplierAuthContext.Provider>
  );
};


export default SupplierAuthProvider