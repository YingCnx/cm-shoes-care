import pool from "../config/database.js";

class Statuses {
  // ✅ ดึงสถานะทั้งหมด (ตาม type)
  static async getAll(type = null) {
    let query = `SELECT * FROM statuses`;
    const values = [];

    if (type) {
      query += ` WHERE type = $1`;
      values.push(type);
    }

    query += ` ORDER BY order_index ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  // ✅ ดึงสถานะตาม ID
  static async getById(id) {
    const result = await pool.query(
      `SELECT * FROM statuses WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // ✅ สร้างสถานะใหม่
  static async create({
    code,
    name_th,
    name_en,
    description,
    color_code,
    type,
    order_index = 0,
    is_active = true,
    is_final = false,
  }) {
    const result = await pool.query(
      `INSERT INTO statuses 
      (code, name_th, name_en, description, color_code, type, order_index, is_active, is_final)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        code,
        name_th,
        name_en,
        description,
        color_code,
        type,
        order_index,
        is_active,
        is_final,
      ]
    );
    return result.rows[0];
  }

  // ✅ แก้ไขสถานะ
  static async update(
    id,
    {
      code,
      name_th,
      name_en,
      description,
      color_code,
      type,
      order_index,
      is_active,
      is_final,
    }
  ) {
    const result = await pool.query(
      `UPDATE statuses SET 
        code = $1,
        name_th = $2,
        name_en = $3,
        description = $4,
        color_code = $5,
        type = $6,
        order_index = $7,
        is_active = $8,
        is_final = $9
      WHERE id = $10
      RETURNING *`,
      [
        code,
        name_th,
        name_en,
        description,
        color_code,
        type,
        order_index,
        is_active,
        is_final,
        id,
      ]
    );
    return result.rows[0];
  }

  // ✅ ลบสถานะ
  static async delete(id) {
    await pool.query(`DELETE FROM statuses WHERE id = $1`, [id]);
    return { message: "✅ ลบสถานะเรียบร้อย!" };
  }
}

export default Statuses;
