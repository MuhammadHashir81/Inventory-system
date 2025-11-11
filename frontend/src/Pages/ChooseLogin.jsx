import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../Components/Context/AdminAuthProvider";
import { SupplierAuthContext } from "../Components/Context/SupplierAuthProvider"; // Adjust path if needed

const ChooseLogin = () => {
  const navigate = useNavigate();
  const { admin, loading: adminLoading } = useContext(AdminAuthContext);
  const { supplier, loading: supplierLoading } = useContext(SupplierAuthContext); // Assuming you have this

  // Redirect already logged-in users
  useEffect(() => {
    if (!adminLoading || !supplierLoading) {
      if (admin) {
        navigate("/admin/dashboard", { replace: true });
      } else if (supplier) {
        navigate("/home", { replace: true });
      }
    }
  }, [admin, supplier, adminLoading, supplierLoading, navigate]);

  // Show loading while checking authentication
  if (adminLoading || supplierLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const handleLoginChoice = (role) => {
    if (role === "supplier") {
      navigate("/login");
    } else if (role === "admin") {
      navigate("/admin-login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Choose Login Type
        </h1>
        <button
          onClick={() => handleLoginChoice("supplier")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-4 transition-all"
        >
          Login as Supplier
        </button>
        <button
          onClick={() => handleLoginChoice("admin")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

export default ChooseLogin;