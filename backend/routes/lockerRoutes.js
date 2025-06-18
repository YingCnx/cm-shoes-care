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
  updateStatusWithImage,
  updateLockerDropQueueId,
} from "../controllers/lockerController.js";
import upload from '../middleware/upload.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ต้อง login ทุก route
router.use(authMiddleware);

// ========== Locker ========== //
router.get("/", getAllLockers);
router.post("/", createLocker);
router.put("/:id", updateLocker);
router.put("/:id/status", updateLockerStatus);
router.delete("/:id", deleteLocker);

// ========== Slots ========== //
router.get("/:lockerId/slots", getLockerSlots);
router.put("/slots/:slotId", updateSlot);

// ========== Locker Drop ========== //
router.get("/locker-drop/pending", getPendingLockerDrops);
router.get("/locker-drop", getAllLockerDrops);
router.get("/locker-drop/:id(\\d+)", getLockerDropById);
router.put("/locker-drop/:id/status", updateLockerDropStatus);
router.put('/locker-drop/:id/status-with-image', upload.single("proof_image"), updateStatusWithImage);

router.put('/locker-drop/:id/queue-id', updateLockerDropQueueId);

export default router;
