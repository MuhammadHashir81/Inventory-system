import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { SoldItemsContext } from "./SoldItemsProvider";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
export const DebtsContext = createContext();

const DebtsProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchSoldItems } = useContext(SoldItemsContext); // get fetchSoldItems from sold items context

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
        // Update debts locally
        setDebts((prevDebts) =>
          prevDebts.map((debt) =>
            debt._id === id ? res.data.debt : debt
          )
        );

        // ✅ Refresh sold items so totals update
        await fetchSoldItems();
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
