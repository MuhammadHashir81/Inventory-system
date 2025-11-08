import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageProducts from "./Pages/Admin/ManageProducts";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Debts from "./Pages/Debts";
import SupplierProtectedRoute from "./ProtectedRoute/SupplierProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Supplier Protected Layout */}
        <Route
          path="/"
          element={
            <SupplierProtectedRoute>
              <Layout />
            </SupplierProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="debts" element={<Debts />} />
        </Route>

        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManageProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
