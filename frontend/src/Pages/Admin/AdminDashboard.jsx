import React, { useState, useContext } from "react";
import { LayoutDashboard, Package, PlusCircle, LogOut, BarChart2, Menu, X } from "lucide-react"; // Import Menu and X icons
import ManageProducts from "./ManageProducts";
import AddProduct from "./AddProduct";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../Components/Context/AdminAuthProvider";
import TotalSales from "./TatalSales";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility
  const navigate = useNavigate();
  const { logout } = useContext(AdminAuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setIsSidebarOpen(false); // Close sidebar when a tab is clicked on mobile
  };

  const tabs = [
    { key: "manage", label: "Manage Products", icon: <Package size={20} /> },
    { key: "add", label: "Add Product", icon: <PlusCircle size={20} /> },
    { key: "sales", label: "Total Sales", icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header for Button */}
      <header className="lg:hidden w-full bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h2 onClick={()=>navigate('/admin/dashboard')} className="cursor-pointer text-xl font-bold text-blue-600 flex items-center gap-1">
          <LayoutDashboard size={24} />
          Admin Panel
        </h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Sidebar - Conditional classes for mobile visibility */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-2xl p-6 flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        } lg:relative lg:flex lg:w-64 lg:rounded-r-3xl lg:rounded-bl-none lg:shadow-lg`}
      >
        <div>
          <h2 onClick={()=>navigate('/admin/dashboard')} className="cursor-pointer text-2xl font-bold text-center mb-10 text-blue-600 flex items-center justify-center gap-2 lg:mt-0 mt-4">
            <LayoutDashboard size={28} />
            Admin Panel
          </h2>

          <nav className="flex flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)} // Use new handler
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => {
            handleLogout();
            setIsSidebarOpen(false); // Close sidebar after logout on mobile
          }}
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-red-600 hover:bg-red-100 font-medium transition-all mt-6 lg:mt-0 shadow-sm"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Overlay for mobile view when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Header */}
        <header className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            {activeTab === "manage"
              ? "Manage Products"
              : activeTab === "add"
              ? "Add New Product"
              : "Total Sales"}
          </h1>
          <p className="text-gray-500 text-sm lg:text-base">
            {activeTab === "manage"
              ? "View, edit, and delete your products here"
              : activeTab === "add"
              ? "Add new products to your inventory"
              : "Review your total sales and performance"}
          </p>
        </header>

        {/* Content Box */}
        <div className="bg-gray-50 p-6 rounded-3xl shadow-inner min-h-[60vh] lg:min-h-[70vh] transition-all overflow-auto">
          {activeTab === "manage" && <ManageProducts />}
          {activeTab === "add" && <AddProduct />}
          {activeTab === "sales" && <TotalSales />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;