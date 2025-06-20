// controllers/notificationController.js
import Notification from '../models/Notification.js';

export const createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    const notification = await Notification.insert({ type, message });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างแจ้งเตือน' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const result = await Notification.getLatest();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงรายการแจ้งเตือนได้' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.markAsRead(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถอัปเดตสถานะแจ้งเตือนได้' });
  }
};
