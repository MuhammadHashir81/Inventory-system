// frontend/src/Pages/Login.jsx
import React, { useState, useContext } from "react";
import { SupplierAuthContext } from "../Components/Context/SupplierAuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { loginSupplier } = useContext(SupplierAuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginSupplier(name, password);
      toast.success(res.message || "Login successful");
      navigate("/"); // redirect after login
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <Toaster/>
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-700 mb-6">
          Supplier <span className="text-blue-500">Login</span>
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Supplier Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter supplier name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
