import pool from "../../config/database.js";

class LockerDrop {
  static async getPendingByBranch(branch_id) {
    const result = await pool.query(`
    SELECT 
        t.id, 
        t.phone, 
        t.branch_id, 
        t.locker_id, 
        l.name AS locker_name, 
        t.slot_id, 
        s.slot_number, 
        t.slot_type, 
        t.status, 
        t.created_at, 
        t.updated_at, 
        t.queue_id
    FROM 
        transactions t
    LEFT JOIN 
        lockers l ON t.locker_id = l.id
    LEFT JOIN 
        locker_slots s ON t.slot_id = s.id
    WHERE 
        t.branch_id = $1
    ORDER BY 
        t.locker_id
    `, [branch_id]);

    return result.rows;
  }

  static async updateStatusById(id, status) {
    const result = await pool.query(`
      UPDATE locker_drop
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(`
      SELECT ld.*, t.phone, l.name AS locker_name, s.slot_number
      FROM locker_drop ld
      JOIN transactions t ON ld.transaction_id = t.id
      JOIN lockers l ON ld.locker_id = l.id
      JOIN locker_slots s ON ld.slot_id = s.id
      WHERE ld.id = $1
    `, [id]);

    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(`
      SELECT ld.*, t.phone, l.name AS locker_name, s.slot_number
      FROM locker_drop ld
      JOIN transactions t ON ld.transaction_id = t.id
      JOIN lockers l ON ld.locker_id = l.id
      JOIN locker_slots s ON ld.slot_id = s.id
      ORDER BY ld.created_at DESC
    `);

    return result.rows;
  }
}

export default LockerDrop;
