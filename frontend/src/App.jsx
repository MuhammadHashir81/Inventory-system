import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Components/Layout";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import SupplierProtectedRoute from "./ProtectedRoute/SupplierProtectedRoute";


// lazy pages
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const ChooseLogin = lazy(() => import("./Pages/ChooseLogin"));
const Debts = lazy(() => import("./Pages/Debts"));

// admin lazy pages
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const ManageProducts = lazy(() => import("./Pages/Admin/ManageProducts"));
const AddProduct = lazy(() => import("./Pages/Admin/AddProduct"));
const TotalSales = lazy(() => import("./Pages/Admin/TotalSales"));
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
        <Toaster
                position="bottom-center"
              />
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
        <Routes>

          {/* entry */}
          <Route path="/" element={<ChooseLogin />} />

          {/* supplier protected */}
          <Route
            path="/home"
            element={
              <SupplierProtectedRoute>
                <Layout />
              </SupplierProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="debts" element={<Debts />} />
          </Route>

          {/* public */}
          <Route path="login" element={<ChooseLogin />} />
          <Route path="admin-login" element={<ChooseLogin />} />

          {/* admin protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="sales" element={<TotalSales />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
