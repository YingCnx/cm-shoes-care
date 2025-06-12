import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkSession } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const user = await checkSession();
      setIsAuthenticated(!!user);
      setChecking(false);
    };
    verify();
  }, []);

  if (checking) return null; // หรือ loading spinner

  // ✅ ป้องกัน redirect ซ้ำกันระหว่าง /login กับ /dashboard
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
