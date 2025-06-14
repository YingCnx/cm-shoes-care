import express from "express";
import {
  getAllLockers,
  createLocker,
  updateLocker,
  deleteLocker,
  getLockerSlots,
  updateSlot,
  updateLockerStatus,
  getPendingLockerDrops,
  getAllLockerDrops,
  getLockerDropById,
  updateLockerDropStatus,
} from "../controllers/lockerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ต้องมี auth ก่อน
router.use(authMiddleware);

// 🎯 จัดการ Locker
router.get("/", getAllLockers);
router.post("/", createLocker);
router.put("/:id/status", updateLockerStatus);
router.put("/:id", updateLocker);
router.delete("/:id", deleteLocker);

// 🎯 จัดการ Slot ของ Locker
router.get("/:lockerId/slots", getLockerSlots); 
router.put('/slots/:slotId', updateSlot);


// 🔍 ดึงรายการที่ยัง pending ตามสาขา
 router.get("/locker-drop/pending", authMiddleware, getPendingLockerDrops);
 
 // 📋 ดึงทั้งหมด (เช่น ใช้ในหน้า admin)
router.get("/locker-drop/", authMiddleware, getAllLockerDrops);

// 🔍 ดูรายละเอียดรายการฝากรายตัว
router.get("/locker-drop/:id(\\d+)", authMiddleware, getLockerDropById);

// 🛠️ อัปเดตสถานะ เช่น 'received', 'processing'
router.put("/locker-drop/:id/status", authMiddleware, updateLockerDropStatus);


export default router;
