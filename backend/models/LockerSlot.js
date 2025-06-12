import pool from "../config/database.js";

class LockerSlot {
  // 📌 ดึง slot ทั้งหมดของ locker
static async getByLocker(lockerId) {
  const result = await pool.query(
    `SELECT id, slot_number, locker_id, status, created_at, updated_at 
     FROM locker_slots 
     WHERE locker_id = $1 
     ORDER BY slot_number ASC`,
    [lockerId]
  );
  return result.rows;
}


  static async createBulk(lockerId, slotCount, client) {
    const values = [];
    for (let i = 1; i <= slotCount; i++) {
      values.push(`(${lockerId}, ${i}, 'available')`);
    }
    const query = `
      INSERT INTO locker_slots (locker_id, slot_number, status)
      VALUES ${values.join(", ")}
    `;
    await client.query(query);
  }


  // 📌 ลบ slot ทั้งหมดของ locker (กรณีลบตู้)
  static async deleteByLocker(lockerId) {
    await pool.query(`DELETE FROM locker_slots WHERE locker_id = $1`, [lockerId]);
  }

  // 📌 อัปเดตสถานะ slot
  static async update(slotId, status) {
    const result = await pool.query(
      `UPDATE locker_slots SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, slotId]
    );
    return result.rows[0] || null;
  }
}

export default LockerSlot;
