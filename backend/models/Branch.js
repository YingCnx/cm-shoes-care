import pool from "../config/database.js";

class Branch {
  // 📌 ดึงข้อมูลทุกสาขา (สำหรับ Admin)
  static async getAll() {
    const result = await pool.query("SELECT * FROM branches ORDER BY name ASC");
    //console.log("📌 Debug: Branches from DB", result.rows);
    return result.rows;
  }

  // 📌 ดึงข้อมูลสาขาตาม ID
  static async getById(id) {
    const result = await pool.query("SELECT * FROM branches WHERE id = $1", [id]);
    return result.rows[0];
  }

  // 📌 สร้างสาขาใหม่
  static async create({ name, location, phone }) {
    await pool.query(
      `INSERT INTO branches (name, location, phone) VALUES ($1, $2, $3)`,
      [name, location, phone]
    );
  }

  // 📌 อัปเดตข้อมูลสาขา
  static async update(id, { name, location, phone }) {
    await pool.query(
      `UPDATE branches SET name = $1, location = $2, phone = $3 WHERE id = $4`,
      [name, location, phone, id]
    );
  }

  // 📌 ลบสาขา
  static async delete(id) {
    await pool.query("DELETE FROM branches WHERE id = $1", [id]);
  }



}

export default Branch;
