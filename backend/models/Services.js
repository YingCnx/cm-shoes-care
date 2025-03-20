import pool from "../config/database.js";

class Services {
    // ✅ ดึงรายการบริการทั้งหมด
    static async getAll() {
        const result = await pool.query(`
          SELECT s.*, b.name AS branch_name 
          FROM services s
          LEFT JOIN branches b ON s.branch_id = b.id
          ORDER BY s.id ASC
        `);
        return result.rows;
      }
    
      static async getByBranch(branch_id) {
        const result = await pool.query(`
          SELECT * FROM services WHERE branch_id = $1 ORDER BY id ASC
        `, [branch_id]);
        return result.rows;
      }
    

    // ✅ ดึงข้อมูลบริการตาม ID
    static async getServiceById(id) {
        const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
        return result.rows[0] || null;
    }

    // ✅ เพิ่มบริการใหม่

    static async create(service_name, base_price, description, branch_id) {
        const result = await pool.query(`
          INSERT INTO services (service_name, base_price, description, branch_id)
          VALUES ($1, $2, $3, $4) RETURNING *
        `, [service_name, base_price, description, branch_id]);
        return result.rows[0];
      }

    // ✅ แก้ไขข้อมูลบริการ

    static async update(id, service_name, base_price, description, branch_id) {
        const result = await pool.query(`
          UPDATE services 
          SET service_name = $1, base_price = $2, description = $3, branch_id = $4 
          WHERE id = $5 RETURNING *
        `, [service_name, base_price, description, branch_id, id]);
        return result.rows[0];
      }

    // ✅ ลบบริการ
    static async delete(id) {
        await pool.query(`DELETE FROM services WHERE id = $1`, [id]);
        return { message: "✅ ลบบริการเรียบร้อย!" };
    }
}

export default Services;
