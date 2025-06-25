import express from "express";
import {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
} from "../controllers/statusController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ ดึงทั้งหมด พร้อม query filter ?type=queue
router.get("/", authMiddleware, getAllStatuses);

// ✅ ดึงสถานะตัวเดียวตาม id
router.get("/:id", authMiddleware, getStatusById);

// ✅ สร้างสถานะใหม่
router.post("/", authMiddleware, createStatus);

// ✅ แก้ไขสถานะเดิม
router.put("/:id", authMiddleware, updateStatus);

// ✅ ลบสถานะ
router.delete("/:id", authMiddleware, deleteStatus);

export default router;
