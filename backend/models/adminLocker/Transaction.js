import pool from "../../config/database.js";

class Transaction {
  static async getById(id) {
    const result = await pool.query(` 
    SELECT 
    t.*, 
    l.name AS locker_name,
    s.slot_number
  FROM transactions t
  LEFT JOIN lockers l ON t.locker_id = l.id
  LEFT JOIN locker_slots s ON t.slot_id = s.id WHERE t.id = $1`, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    await pool.query(`UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id]);
  }
}

export default Transaction;
