import pool from "../config/database.js";
import LockerSlotModel from './LockerSlot.js';

class Locker {
  // 📌 ดึงตู้ทั้งหมด พร้อมชื่อสาขา
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT l.*, b.name AS branch_name
        FROM lockers l
        LEFT JOIN branches b ON l.branch_id = b.id
        ORDER BY l.id ASC
      `);
      return result.rows;
    } catch (error) {
      console.error("🔴 Error fetching lockers:", error);
      throw error;
    }
  }

  // 📌 ดึงตู้ตามสาขา
  static async getByBranch(branch_id) {
    try {
      const result = await pool.query(`
        SELECT l.*, b.name AS branch_name
        FROM lockers l
        LEFT JOIN branches b ON l.branch_id = b.id
        WHERE l.branch_id = $1
        ORDER BY l.id ASC
      `, [branch_id]);
      return result.rows;
    } catch (error) {
      console.error("🔴 Error fetching lockers by branch:", error.message);
      throw new Error(`❌ ไม่สามารถดึงข้อมูล lockers สำหรับ branch_id = ${branch_id}`);
    }
  }

  // 📌 เพิ่มตู้ใหม่ พร้อมสร้าง slot
  static async create(data) {
    const {
      code, name, branch_id, address, latitude, longitude,
      sim_number, device_serial, firmware_version, note, slot_count
    } = data;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertLocker = await client.query(`
        INSERT INTO lockers (
          code, name, branch_id, address, latitude, longitude,
          sim_number, device_serial, firmware_version, note, slot_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        code, name, branch_id, address,
        parseFloat(latitude), // ✅ แปลงเป็นตัวเลข ป้องกัน "หก" หรือ string
        parseFloat(longitude),
        sim_number, device_serial, firmware_version, note, slot_count
      ]);

      const lockerId = insertLocker.rows[0]?.id;
      if (!lockerId) throw new Error("❌ ไม่สามารถสร้าง Locker ได้");

      console.log("📦 Locker ID ที่สร้าง:", lockerId);

      await LockerSlotModel.createBulk(lockerId, slot_count, client);
      
      await client.query('COMMIT');
      return { id: lockerId };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("🔴 Error creating locker with slots:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // 📌 อัปเดตตู้
  static async update(id, data) {
    const {
      code, name, branch_id, address, latitude, longitude,
      sim_number, device_serial, firmware_version, note, slot_count
    } = data;

    try {
      const result = await pool.query(`
        UPDATE lockers SET
          code = $1,
          name = $2,
          branch_id = $3,
          address = $4,
          latitude = $5,
          longitude = $6,
          sim_number = $7,
          device_serial = $8,
          firmware_version = $9,
          note = $10,
          slot_count = $11,
          updated_at = NOW()
        WHERE id = $12
        RETURNING *
      `, [
        code, name, branch_id, address,
        parseFloat(latitude),
        parseFloat(longitude),
        sim_number, device_serial, firmware_version, note, slot_count,
        id
      ]);

      return result.rows[0] || null;
    } catch (error) {
      console.error("🔴 Error updating locker:", error);
      throw error;
    }
  }

  // 📌 ลบตู้
  static async delete(id) {
    try {
      const result = await pool.query(
        "DELETE FROM lockers WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("🔴 Error deleting locker:", err);
      throw err;
    }
  }

  // 📌 อัปเดตสถานะออนไลน์
  static async updateStatus(id, is_online) {
    try {
      const result = await pool.query(
        `UPDATE lockers
         SET is_online = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [is_online, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("🔴 Error in Locker.updateStatus:", error);
      throw error;
    }
  }
}

export default Locker;
