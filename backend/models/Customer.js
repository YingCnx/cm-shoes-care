import pool from "../config/database.js";

class Customer {

static async create({ name, phone, address, notes, branch_id, origin_source }) {
  const insertResult = await pool.query(
    `INSERT INTO customers (name, phone, address, notes, branch_id, status, origin_source)
     VALUES ($1, $2, $3, $4, $5, 'active', $6)
     RETURNING id, branch_id`,
    [name, phone, address, notes, branch_id, origin_source || 'manual']
  );
  
    const newCustomer = insertResult.rows[0];
  
    const customerCode = `C${newCustomer.branch_id}${String(newCustomer.id).padStart(3, '0')}`;
  
    // อัปเดต customer_code ทันทีหลัง insert
    await pool.query(
      `UPDATE customers SET customer_code = $1 WHERE id = $2`,
      [customerCode, newCustomer.id]
    );
  
    // ส่งข้อมูลกลับ (พร้อม customer_code ใหม่)
    const { rows } = await pool.query(`SELECT * FROM customers WHERE id = $1`, [newCustomer.id]);
    return rows[0];
  }

  static async getByBranch(branchId) {
    const { rows } = await pool.query(
      "SELECT * FROM customers WHERE branch_id = $1 ORDER BY id DESC",
      [branchId]
    );
    return rows;
  }

  static async getAll() {
    const { rows } = await pool.query("SELECT * FROM customers ORDER BY id DESC");
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
    return rows[0];
  }

static async update(id, { name, phone, address, status, notes, branch_id, origin_source }) {
  const { rows } = await pool.query(
    `UPDATE customers
     SET name = $1,
         phone = $2,
         address = $3,
         status = $4,
         notes = $5,
         branch_id = $6,
         origin_source = $7
     WHERE id = $8
     RETURNING *`,
    [name, phone, address, status, notes, branch_id, origin_source, id]
  );
  return rows[0];
}

  static async delete(id) {
    const { rows } = await pool.query("DELETE FROM customers WHERE id = $1 RETURNING *", [id]);
    return rows[0];
  }

    static async isPhoneDuplicate(phone, branch_id) {
    const { rows } = await pool.query(
      `SELECT id FROM customers WHERE phone = $1 AND branch_id = $2`,
      [phone, branch_id]
    );
    return rows.length > 0;
  }
}

export default Customer;
