import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ Named Import ที่ถูกต้อง

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        console.warn("🔴 No Token Found. Redirecting to /login");
        return <Navigate to="/login" />;
    }

    let userRole;
    let isSuperAdmin = false;
    try {
        const decoded = jwtDecode(token); // ✅ ตรวจสอบ Token
        console.log("🔍 Decoded Token:", decoded); // ✅ Debug ค่า Token
        userRole = decoded.role;
        isSuperAdmin = decoded.isSuperAdmin || false;
    } catch (error) {
        console.error("🔴 Error decoding token:", error);
        return <Navigate to="/login" />;
    }

    // ✅ SuperAdmin เข้าถึงทุกหน้า
    if (isSuperAdmin) {
        return <Outlet />;
    }

    // ✅ Role-based permissions
    const rolePermissions = {
        admin: ["/dashboard", "/appointments", "/queue", "/queue-entry", "/branch", "/users", "/services", "/payments", "/employee", "/queue/:id/detail"],
        manager: ["/dashboard", "/appointments", "/queue", "/queue-entry", "/branch", "/users", "/services", "/payments", "/employee"],
        staff: ["/dashboard", "/appointments", "/queue", "/queue-entry", "/branch", "/users", "/services", "/payments", "/employee"],
    };

    const allowedRoutes = rolePermissions[userRole] || [];
    //console.log("🔍 User Role:", userRole);
    //console.log("🔍 Allowed Routes:", allowedRoutes);

    // ✅ ตรวจสอบสิทธิ์
    if (!allowedRoutes.includes(location.pathname)) {
        console.warn(`🔴 Access Denied: "${location.pathname}" Not Allowed for Role "${userRole}"`);
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
