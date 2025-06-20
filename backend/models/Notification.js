// models/Notification.js
import pool from '../config/database.js';

const Notification = {
  async insert({ type, message }) {
    const result = await pool.query(
      `INSERT INTO notifications (type, message) VALUES ($1, $2) RETURNING *`,
      [type, message]
    );
    return result.rows[0];
  },

  async getLatest(limit = 20) {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE read = false ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async markAsRead(id) {
    await pool.query(`UPDATE notifications SET read = TRUE WHERE id = $1`, [id]);
  }
};

export default Notification;
