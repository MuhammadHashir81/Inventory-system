import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const DebtsContext = createContext();

const DebtsProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

  const fetchDebts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/debts/get`);
      console.log(res.data)
      if (res.data.success) setDebts(res.data.debts);
    } catch (error) {
      console.error("Fetch debts error:", error);
    }
  };

  const removeDebt = async (id) => {
    try {
      const res = await axios.delete(`${apiUrl}/api/debts/${id}`);
      if (res.data.success) setDebts(debts.filter(d => d._id !== id));
      return res.data;
    } catch (error) {
      console.error("Remove debt error:", error);
      return { success: false, message: "Server error" };
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <DebtsContext.Provider value={{ debts, fetchDebts, removeDebt }}>
      {children}
    </DebtsContext.Provider>
  );
};

export default DebtsProvider;
