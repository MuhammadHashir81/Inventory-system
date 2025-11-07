import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminAuthContext = createContext();

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in
  const verifyAdmin = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/admin/verify`, {
        withCredentials: true,
      });
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  const login = async (name, password) => {
    const { data } = await axios.post(
      `${apiUrl}/api/admin/login`,
      { name, password },
      { withCredentials: true }
    );
    setAdmin(data.admin);
  };

  const logout = async () => {
    try {
      await axios.get(`${apiUrl}/api/admin/logout`, { withCredentials: true });
      setAdmin(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
