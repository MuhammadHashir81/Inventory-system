import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageProducts from "./Pages/Admin/ManageProducts";
import AddProduct from "./Pages/Admin/AddProduct";
// import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="admin-login" element={<AdminLogin />} />
          </Route>

          {/* Admin Dashboard with nested routes */}
          <Route path="/admin/dashboard" element={
            // <ProtectedRoute>
              <AdminDashboard />
            // </ProtectedRoute>
          }>
            <Route index element={<ManageProducts />} />
            {/* <Route path="add-product" element={<AddProduct />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
