// frontend/src/ProtectedRoute/SupplierProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SupplierAuthContext } from "../Components/Context/SupplierAuthProvider";

const SupplierProtectedRoute = ({ children }) => {
  const { supplier, loading } = useContext(SupplierAuthContext);

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;

  return supplier ? children : <Navigate to="/login" replace />;
};

export default SupplierProtectedRoute;
