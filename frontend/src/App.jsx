import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminLogin from "./Pages/AdminLogin";
const Dashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const ManageProducts = lazy(()=> import ("./Pages/Admin/ManageProducts"));
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
const Debts = lazy(()=> import("./Pages/Debts"));
import SupplierProtectedRoute from "./ProtectedRoute/SupplierProtectedRoute";
import ChooseLogin from "./Pages/ChooseLogin";
import AdminProductsProvider from './Components/Context/AdminProductsProvider';
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* entry route */}
        <Route path='/' element={<ChooseLogin />} />
        {/* Supplier Protected Layout */}
        <Route
          path="/home"
          element={
            <SupplierProtectedRoute>
              <Layout />
            </SupplierProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="debts" element={ 
            <Suspense fallback={<div>Loading...</div>}>

            <Debts />
            </Suspense>
            } />
        </Route>

        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={
            <Suspense fallback>

            <ManageProducts fallback={<div>Loading...</div>}/>
            </Suspense>
            } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
