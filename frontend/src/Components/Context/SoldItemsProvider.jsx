import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const SoldItemsContext = createContext();

const SoldItemsProvider = ({ children }) => {
  const [soldItems, setSoldItems] = useState([]);

  const fetchSoldItems = async () => {
  try {
    const res = await axios.get(`${apiUrl}/api/sold-items/get`);
    console.log(res.data);
    if (res.data.success) setSoldItems(res.data.soldItems); // <-- changed from items to soldItems
  } catch (error) {
    console.error("Fetch sold items error:", error);
  }
};

  const addSoldItem = async (item) => {
    try {
      const res = await axios.post(`${apiUrl}/api/sold-items/add`, item);

      if (res.data.success) setSoldItems([res.data.item, ...soldItems]);
      return res.data;
    } catch (error) {
      console.error("Add sold item error:", error);
      return { success: false, message: "Server error" };
    }
  };

  useEffect(() => {
    fetchSoldItems();
  }, []);

  return (
    <SoldItemsContext.Provider value={{ soldItems, fetchSoldItems, addSoldItem }}>
      {children}
    </SoldItemsContext.Provider>
  );
};

export default SoldItemsProvider;
