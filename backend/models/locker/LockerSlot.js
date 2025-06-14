class LockerSlot {
  /**
   * 📌 หาช่องว่างของตู้ที่ระบุ (โดยใช้ locker_id)
   */
  static async findAvailableSlot(locker_id) {
    const result = await pool.query(
      `SELECT id, locker_id, slot_number 
       FROM locker_slots 
       WHERE status = 'available' AND locker_id = $1
       ORDER BY slot_number ASC 
       LIMIT 1`,
      [locker_id]
    );
    return result.rows[0] || null;
  }

  /**
   * 📌 อัปเดตสถานะ is_closed (เช่น เปิด-ปิดประตูช่อง)
   */
  static async updateSlotIsClosed(slotId, isClosed) {
    await pool.query(
      `UPDATE locker_slots SET is_closed = $1 WHERE id = $2`,
      [isClosed, slotId]
    );
  }

  /**
   * 📌 ตรวจสอบ is_closed ของ slot_number (อาจต้องเพิ่ม locker_id ถ้ามีหลายตู้)
   */
  static async checkSlotClosed(slotNumber) {
    const result = await pool.query(
      `SELECT is_closed FROM locker_slots WHERE slot_number = $1`,
      [slotNumber]
    );
    return result.rows[0] || null;
  }

  /**
   * 📌 อัปเดต status เป็น 'used' (สำหรับกรณีใช้งานหลังฝากรองเท้า)
   */
  static async updateSlotStatus(slot_id) {
    await pool.query(
      `UPDATE locker_slots SET status = 'used' WHERE id = $1`,
      [slot_id]
    );
  }

  /**
   * 📌 ตั้งค่า status ช่องตู้เป็นค่าใดก็ได้ (เช่น 'available', 'used', 'error')
   */
  static async setSlotStatus(slot_id, status) {
    await pool.query(
      `UPDATE locker_slots SET status = $1 WHERE id = $2`,
      [status, slot_id]
    );
  }

  /**
   * 📌 ตรวจสอบว่าช่องยังว่าง และประตูไม่ได้ปิดล็อกอยู่
   */
  static async isSlotAvailableAndOpen(slot_id) {
    const result = await pool.query(
      `SELECT status, is_closed FROM locker_slots WHERE id = $1`,
      [slot_id]
    );
    const slot = result.rows[0];
    return slot && slot.status === 'available' && slot.is_closed === false;
  }
}

export default LockerSlot;
