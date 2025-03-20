import pool from "../config/database.js";

class Appointment {
  static async getAll() {
    const result = await pool.query("SELECT * FROM appointments ORDER BY appointment_date ASC");
    return result.rows;
  }

  static async getByBranch(branch_id) {
    try {
        console.log("📌 Debug: ดึงข้อมูล appointments สำหรับ branch_id =", branch_id);
        const result = await pool.query(`
            SELECT * FROM appointments
            WHERE branch_id = $1
            ORDER BY appointment_date ASC
        `, [branch_id]);

        return result.rows;
    } catch (error) {
        console.error("🔴 Error fetching appointments by branch:", error.message);
        throw new Error(`❌ ไม่สามารถดึงข้อมูล appointments สำหรับ branch_id = ${branch_id}`);
    }
}

  static async getById(id) {
    const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async create({ customer_name, phone, location, shoe_count, appointment_date, appointment_time, branch_id }) {
    await pool.query(
      `INSERT INTO appointments (customer_name, phone, location, shoe_count, appointment_date, appointment_time, branch_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'รอดำเนินการ')`,
      [customer_name, phone, location, shoe_count, appointment_date, appointment_time, branch_id]
    );
  }

  static async updateStatus(id, status) {
    await pool.query("UPDATE appointments SET status = $1 WHERE id = $2", [status, id]);
  }

    // ✅ อัปเดต queue_id สำหรับนัดหมาย
    static async updateQueueId(id, queue_id) {
      try {
          const result = await pool.query(
              "UPDATE appointments SET queue_id = $1 WHERE id = $2 RETURNING *",
              [queue_id, id]
          );

          if (result.rowCount === 0) {
              throw new Error(`❌ ไม่พบนัดหมายที่ต้องการอัปเดต (id: ${id})`);
          }

         console.log("📌 Debug: อัปเดต queue_id สำเร็จ!", result.rows[0]);
          return result.rows[0]; // ✅ คืนค่าข้อมูลที่อัปเดตแล้ว
      } catch (error) {
          console.error("🔴 Error updating queue_id:", error);
          throw error;
      }
  }

  static async updateAppointment(id, { customer_name, phone, location, shoe_count, appointment_date, appointment_time }) {
    await pool.query(
      `UPDATE appointments SET 
        customer_name = $1, 
        phone = $2, 
        location = $3, 
        shoe_count = $4, 
        appointment_date = $5, 
        appointment_time = $6
      WHERE id = $7`,
      [customer_name, phone, location, shoe_count, appointment_date, appointment_time, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
  }
}

export default Appointment;
