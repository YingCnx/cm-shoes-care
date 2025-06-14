import pool from '../../config/database.js';

class LockerDrop {
  /**
   * 📌 เพิ่มข้อมูลธุรกรรมการฝากของ (transactions)
   */
  static async insertTransaction({
    phone,
    branch_id,
    locker_id,
    slot_id,
    slot_type
  }) {
    const result = await pool.query(
      `INSERT INTO transactions (phone, branch_id, locker_id, slot_id, slot_type, status)
       VALUES ($1, $2, $3, $4, $5, 'dropped') RETURNING *`,
      [phone, branch_id, locker_id, slot_id, slot_type]
    );
    return result.rows[0];
  }

  /**
   * 📌 เพิ่มรายการฝากของลงในตาราง locker_drop
   */
  static async insertLockerDrop({
    transaction_id,
    locker_id,
    slot_id,
    service_type,
    total_pairs
  }) {
    await pool.query(
      `INSERT INTO locker_drop (transaction_id, locker_id, slot_id, status, service_type, total_pairs)
       VALUES ($1, $2, $3, 'pending_pickup', $4, $5)`,
      [transaction_id, locker_id, slot_id, service_type, total_pairs]
    );
  }
}

export default LockerDrop;
