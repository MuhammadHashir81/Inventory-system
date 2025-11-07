import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AdminAuthContext } from "../Components/Context/AdminAuthProvider";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const AdminLogin = () => {
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AdminAuthContext);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(adminName, adminPassword);
      toast.success("✅ Admin logged in successfully!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      // if backend sends error message
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <Toaster/>
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-700 mb-6">
          Admin <span className="text-blue-500">Login</span>
        </h2>

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
          {/* Admin Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Admin Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Enter admin name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Admin Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base font-medium`}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs sm:text-sm mt-5">
          Not an admin?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Go to User Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
