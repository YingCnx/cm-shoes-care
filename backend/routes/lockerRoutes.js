import express from "express";
import {
  getAllLockers,
  createLocker,
  updateLocker,
  deleteLocker,
  getLockerSlots,
  updateSlot,
  updateLockerStatus,
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

export default router;
