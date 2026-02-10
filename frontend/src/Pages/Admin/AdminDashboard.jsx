import { BarChart2, LayoutDashboard, Package, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Manage Products", icon: <Package size={20} /> },
    { path: "/admin/products/add", label: "Add Product", icon: <PlusCircle size={20} /> },
    { path: "/admin/sales", label: "Total Sales", icon: <BarChart2 size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-20 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-white border-r
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          pt-16 lg:pt-0
        `}
      >
       <h1 className="text-lg font-semibold m-4">City Pharmacy</h1>
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => {
              navigate(tab.path);
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors
              ${isActive(tab.path)
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pt-4 flex-1 w-full lg:w-auto overflow-x-hidden">
        <div className="p-4 lg:p-8 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;