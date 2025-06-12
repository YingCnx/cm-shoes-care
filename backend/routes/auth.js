import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ ใช้ร่วมกับ authAdminRoutes, authEmployeeRoutes
import authAdminRoutes from "./authAdmin.js";
import authEmployeeRoutes from "./authEmployee.js";

router.use("/admin", authAdminRoutes);
router.use("/", authEmployeeRoutes);
// ✅ ตรวจสอบ session จาก JWT ใน cookie
router.get("/check", authMiddleware, (req, res) => {
  const { id, email, role, branch_id } = req.user;
  res.json({ id, email, role, branch_id });
});


// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "✅ Logout success" });
});

export default router;
