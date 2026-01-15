import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { SoldItemsContext } from "./SoldItemsProvider";

export const DebtsContext = createContext();

const DebtsProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const { fetchSoldItems } = useContext(SoldItemsContext);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;


  // Make payment
  const makePayment = async (id, paymentAmount) => {
    try {
      const res = await axios.put(`${apiUrl}/api/debts/update/${id}`, {
        payment: paymentAmount,
      });

      if (res.data.success) {
        if (!res.data.debt) {
          // Debt fully paid & deleted, remove from state
          setDebts((prev) => prev.filter((d) => d._id !== id));
        } else {
          // Update partially paid debt
          setDebts((prev) =>
            prev.map((debt) => (debt._id === id ? res.data.debt : debt))
          );
        }

        // Refresh sold items
        await fetchSoldItems();
      }

      return res.data;
    } catch (error) {
      console.error("Error updating payment:", error);
      return { success: false, message: "Payment failed" };
    }
  };

  // Delete debt manually
  const deleteDebt = async (id) => {
    try {
      const res = await axios.delete(`${apiUrl}/api/debts/delete/${id}`);
      if (res.data.success) {
        setDebts((prev) => prev.filter((debt) => debt._id !== id));
      }
      return res.data;
    } catch (error) {
      console.error("Error deleting debt:", error);
      return { success: false, message: "Failed to delete debt" };
    }
  };

 


  return (
    <DebtsContext.Provider
      value={{ debts, makePayment, deleteDebt,setDebts   }}
    >
      {children}
    </DebtsContext.Provider>
  );
};

export default DebtsProvider;
