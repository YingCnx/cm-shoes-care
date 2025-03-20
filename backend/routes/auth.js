import express from "express";
import authAdminRoutes from "./authAdmin.js";  // ✅ นำเข้า API Admin
import authEmployeeRoutes from "./authEmployee.js";  // ✅ นำเข้า API Employee

const router = express.Router();

// ✅ แยก API ของ Admin และ Employee
router.use("/admin", authAdminRoutes);  // 🔹 API สำหรับ Admin -> `/api/auth/admin/...`
router.use("/", authEmployeeRoutes);  // 🔹 API สำหรับ Employee -> `/api/auth/login`

export default router;
