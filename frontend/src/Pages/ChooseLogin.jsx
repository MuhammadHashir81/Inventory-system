import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../Components/Context/AdminAuthProvider";
import { SupplierAuthContext } from "../Components/Context/SupplierAuthProvider";

const Login = lazy(() => import("../Pages/Login"));
const AdminLogin = lazy(() => import("../Pages/AdminLogin"));

const ChooseLogin = () => {

  const [activeTab, setActiveTab] = useState("supplier");


  return (
    <div className=" flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h1 className="capitalize text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">
          {activeTab} Login
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("supplier")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "supplier"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Supplier
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "bg-green-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Tab Content */}
        <Suspense fallback={<p className="text-center text-gray-500">Loading form...</p>}>
          {activeTab === "supplier" && <Login />}
          {activeTab === "admin" && <AdminLogin />}
        </Suspense>
      </div>
    </div>
  );
};

export default ChooseLogin;
