// routes/notificationRoutes.js
import express from 'express';
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', createNotification);       // 🔔 เพิ่มแจ้งเตือน
router.get('/', getNotifications);          // 📋 ดูแจ้งเตือน
router.put('/:id/read', markNotificationAsRead); // ✅ กดอ่านแล้ว

export default router;
