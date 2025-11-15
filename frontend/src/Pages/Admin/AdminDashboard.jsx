import React, { useState, useContext } from "react";
import { LayoutDashboard, Package, PlusCircle, LogOut, BarChart2, Menu, X } from "lucide-react"; // Import Menu and X icons
import ManageProducts from "./ManageProducts";
import AddProduct from "./AddProduct";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../Components/Context/AdminAuthProvider";
import TotalSales from "./TotalSales";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden w-full bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="cursor-pointer flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            Admin
          </span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X size={20} className="text-gray-700" />
          ) : (
            <Menu size={20} className="text-gray-700" />
          )}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-40 
            w-80 lg:w-72 h-screen
            bg-white border-r border-gray-200
            flex flex-col
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    text-left font-medium transition-all duration-200
                    group relative
                    ${activeTab === tab.key
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
                    ${activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                    }
                  `}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>

                  {activeTab === tab.key && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                <LogOut size={16} className="text-red-600" />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto overflow-x-hidden">
          <div className="p-4 lg:p-8 max-w-full">
            {/* Mobile Content Header */}
            <header className="lg:hidden mb-6 bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === "manage"
                  ? "Manage Products"
                  : activeTab === "add"
                    ? "Add Product"
                    : "Sales Analytics"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "manage"
                  ? "Manage your product catalog"
                  : activeTab === "add"
                    ? "Add new inventory items"
                    : "Track sales performance"}
              </p>
            </header>

            {/* Content Area */}
            <div className="w-full">
              {activeTab === "manage" && <ManageProducts />}
              {activeTab === "add" && <AddProduct />}
              {activeTab === "sales" && <TotalSales />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;