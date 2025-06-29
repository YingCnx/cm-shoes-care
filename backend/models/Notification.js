// models/Notification.js
import pool from '../config/database.js';

const Notification = {
  // ✅ เพิ่ม Notification และ broadcast ผ่าน io ถ้ามี
  async insert({ type, message, branch_id = null, io = null }) {
    const result = await pool.query(
      `INSERT INTO notifications (type, message, branch_id) VALUES ($1, $2, $3) RETURNING *`,
      [type, message, branch_id]
    );

    const newNotification = result.rows[0];

    if (io && branch_id) {
      io.to(`branch-${branch_id}`).emit('new-notification', newNotification); // ✅ ส่งเฉพาะสาขา
    } else if (io) {
      io.emit('new-notification', newNotification); // fallback: ส่งทุกคน
    }

    return newNotification;
  },

  // ✅ ดึงรายการแจ้งเตือนล่าสุด
  async getLatest(branchId, limit = 20) {
  const result = await pool.query(
    `SELECT * FROM notifications 
     WHERE read = false AND branch_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [branchId, limit]
  );
  return result.rows;
},

// ✅ ดึงรายการแจ้งเตือนทั้งหมด (ไม่ระบุสาขา)
async  getLatestAll(limit = 50) {
  const result = await pool.query(
    `SELECT * FROM notifications 
     WHERE read = false 
     ORDER BY created_at DESC 
     LIMIT $1`,
    [limit]
  );
  return result.rows;
},

  // ✅ ตั้งค่าแจ้งเตือนว่าอ่านแล้ว
  async markAsRead(id) {
    await pool.query(`UPDATE notifications SET read = TRUE WHERE id = $1`, [id]);
  }
};

export default Notification;
