import express from "express";
import { 
  createQueue, 
  getAllQueues, 
  getQueueById, 
  updateQueueStatus, 
  updateQueue,
  deleteQueue,
  generateInvoice,
} from "../controllers/queueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ เพิ่มคิวใหม่
router.post("/", authMiddleware, createQueue);

// ✅ ดึงคิวทั้งหมด
router.get("/", authMiddleware, getAllQueues);

// ✅ ดึงคิวตาม ID
router.get("/:id", authMiddleware, getQueueById);

// ✅ อัปเดตคิวตาม ID
router.put("/:id", authMiddleware, updateQueue);

// ✅ อัปเดตสถานะคิว
router.put("/:id/status", authMiddleware, updateQueueStatus);

// ✅ ลบคิว (เฉพาะที่ยังไม่ส่งสำเร็จ)
router.delete("/:id", authMiddleware, deleteQueue);

// ✅ สร้างใบแจ้งราคาจาก Queue
router.post('/:queue_id/generate-invoice', authMiddleware, generateInvoice);


export default router;
