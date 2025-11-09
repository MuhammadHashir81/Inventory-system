import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
export const DebtsContext = createContext();

const DebtsProvider = ({ children }) => {
  
  return (
    <DebtsContext.Provider>
      {children}
    </DebtsContext.Provider>
  );
};

export default DebtsProvider;