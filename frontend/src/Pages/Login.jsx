import React, { useState } from "react";
import { NavLink } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add login logic here (API call, authentication, etc.)
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-md p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-700 mb-6">
          Login to <span className="text-blue-500">Pharmacy</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base font-medium"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mt-5">
          Don’t have an account?{" "}
          <NavLink
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
