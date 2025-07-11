import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/ping", (req, res) => {
  res.send("✅ Auth API OK without login");
});

// ✅ ใช้ร่วมกับ authAdminRoutes, authEmployeeRoutes
import authAdminRoutes from "./authAdmin.js";
import authEmployeeRoutes from "./authEmployee.js";

router.use("/admin", authAdminRoutes);
router.use("/", authEmployeeRoutes);



// ✅ ตรวจสอบ session จาก session-based login
router.get("/check", authMiddleware, (req, res) => {
  const { id, email, role, branch_id } = req.session.user;
  res.json({ id, email, role, branch_id });
});

// ✅ Logout route: ล้าง session แทน cookie token
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout failed:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // ล้าง session cookie
    res.json({ message: "✅ Logout success" });
  });
});


export default router;
