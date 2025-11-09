import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Your backend URL
export const DebtsContext = createContext();

const DebtsProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all debts
  const fetchDebts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/debts/get`);
      if (res.data.success) {
        setDebts(res.data.debts);
      }
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
    setLoading(false);
  };

  // Make a partial payment
  const makePayment = async (id, paymentAmount) => {
    try {
      const res = await axios.put(`${apiUrl}/api/debts/update/${id}`, {
        payment: paymentAmount,
      });

      if (res.data.success) {
        // Update local debts state
        setDebts((prevDebts) =>
          prevDebts.map((debt) =>
            debt._id === id ? res.data.debt : debt
          )
        );
      }

      return res.data;
    } catch (error) {
      console.error("Error updating payment:", error);
      return { success: false, message: "Payment failed" };
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <DebtsContext.Provider
      value={{
        debts,
        loading,
        fetchDebts,
        makePayment,
      }}
    >
      {children}
    </DebtsContext.Provider>
  );
};

export default DebtsProvider;
