import express from "express";
import {
  getPendingLockerDrops,
  updateLockerDropStatus,
  getLockerDropById,
  getAllLockerDrops,
  createLockerDrop
} from "../controllers/lockerDropController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔍 ดึงรายการที่ยัง pending ตามสาขา
router.get("/pending", authMiddleware, getPendingLockerDrops);

// 📋 ดึงทั้งหมด (เช่น ใช้ในหน้า admin)
router.get("/", authMiddleware, getAllLockerDrops);

// 🔍 ดูรายละเอียดรายการฝากรายตัว
router.get("/:id(\\d+)", authMiddleware, getLockerDropById);

// 🛠️ อัปเดตสถานะ เช่น 'received', 'processing'
router.put("/:id/status", authMiddleware, updateLockerDropStatus);

//--------------งานจากฝั่ง Locker--------------//

// POST /api/locker-drop
router.post('/', createLockerDrop);

export default router;
