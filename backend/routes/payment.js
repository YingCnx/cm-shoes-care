import express from "express";
import {
    getCompletedQueues,
    createPayment,
    getPaymentByQueueId,
    cancelPayment 
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ เพิ่ม middleware

const router = express.Router();

router.get("/completed-queues", authMiddleware, getCompletedQueues); // ✅ ป้องกัน API ด้วย authMiddleware
router.post("/", authMiddleware, createPayment);
router.get("/:queue_id", authMiddleware, getPaymentByQueueId);
router.delete("/cancel/:queue_id", cancelPayment);
export default router;
