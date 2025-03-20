import express from "express";
import { getPayouts, createPayout, updatePayout, deletePayout } from "../controllers/payoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ ดึงรายการจ่ายเงิน
router.get("/", authMiddleware, getPayouts);

// ✅ เพิ่มรายการจ่ายเงิน
router.post("/", authMiddleware, createPayout);

// ✅ อัปเดตรายการจ่ายเงิน
router.put("/:id", authMiddleware, updatePayout);

// ✅ ลบรายการจ่ายเงิน
router.delete("/:id", authMiddleware, deletePayout);

export default router;
