  import React, { useContext } from "react";
  import { Navigate } from "react-router-dom";
  import { AdminAuthContext } from "../Components/Context/AdminAuthProvider";

  const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useContext(AdminAuthContext);
    console.log("this is admin", admin)

    // While checking admin login state, you can show a loader
    if (loading) {  
      return (      
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      );
    }

    // If admin is not logged in, redirect to admin login
      return admin ? children : <Navigate to="/admin-login" replace />;
    // If admin is logged in, render the protected component
  };

  export default ProtectedRoute;
