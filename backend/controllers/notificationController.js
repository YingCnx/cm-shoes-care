// 📁 controllers/notificationController.js
import Notification from '../models/Notification.js';

export const createNotification = async (req, res) => {
  try {
    const { type, message, branch_id = null } = req.body; // ✅ รองรับส่ง branch_id

    const io = req.app.get('io');

    // 🟢 บันทึก + ส่ง socket ภายใน insert()
    const notification = await Notification.insert({ type, message, branch_id, io });

    // ✅ ตอบกลับ client
    res.json(notification);
  } catch (err) {
    console.error('❌ createNotification error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างแจ้งเตือน' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ message: 'ไม่ได้รับอนุญาต' });
    }

    let result;
    if (user.isSuperAdmin) {
      result = await Notification.getLatestAll(); // 🟢 ดึงทั้งหมด
    } else if (user.branch_id) {
      result = await Notification.getLatest(user.branch_id); // 🔵 เฉพาะสาขา
    } else {
      return res.status(400).json({ message: 'ไม่พบ branch_id' });
    }

    res.json(result);
  } catch (err) {
    console.error("🔴 Notification Error:", err);
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
