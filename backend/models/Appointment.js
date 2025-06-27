import pool from "../config/database.js";

class Appointment {
static async getAll() {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.customer_name, 
        a.phone, 
        a.location, 
        a.shoe_count, 
        a.appointment_date, 
        a.appointment_time, 
        a.status, 
        a.created_at, 
        a.branch_id, 
        a.queue_id, 
        a.customer_id,
        c.origin_source AS source,
        a.appointment_type AS type
      FROM 
        appointments a
      LEFT JOIN 
        customers c ON a.customer_id = c.id
      ORDER BY 
        a.appointment_date ASC
    `);

    return result.rows;
  } catch (error) {
    console.error("🔴 Error fetching all appointments:", error.message);
    throw new Error("❌ ไม่สามารถดึงข้อมูล appointments ทั้งหมด");
  }
}


static async getByBranch(branch_id) {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.customer_name, 
        a.phone, 
        a.location, 
        a.shoe_count, 
        a.appointment_date, 
        a.appointment_time, 
        a.status, 
        a.created_at, 
        a.branch_id, 
        a.queue_id, 
        a.customer_id,
        c.origin_source as source,
        a.appointment_type AS type
      FROM 
        appointments a
      LEFT JOIN 
        customers c ON a.customer_id = c.id
      WHERE 
        a.branch_id = $1 and a.status != 'ยกเลิก'
      ORDER BY 
        a.appointment_date ASC
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

  static async create({ customer_id, customer_name, phone, location, shoe_count, appointment_date, appointment_time, branch_id,appointment_type, queue_id = null }) {
  try {
    const result = await pool.query(
      `INSERT INTO appointments (
          customer_id,
          customer_name,
          phone,
          location,
          shoe_count,
          appointment_date,
          appointment_time,
          branch_id,
          status,
          appointment_type,
          queue_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
      [
        customer_id,
        customer_name,
        phone,
        location,
        shoe_count,
        appointment_date,
        appointment_time,
        branch_id,
        'รอดำเนินการ',
        appointment_type,
         queue_id
      ]
    );

    return result.rows[0]; // ✅ คืนข้อมูลนัดหมายที่สร้าง
  } catch (error) {
    console.error("🔴 Error creating appointment:", error);
    throw error; // ❌ ส่ง error กลับไปให้ controller จัดการต่อ
  }
}

  // ✅ อัปเดตสถานะนัดหมาย  

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

         //console.log("📌 Debug: อัปเดต queue_id สำเร็จ!", result.rows[0]);
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


  static async getAppointmentsForQueue(branch_id){
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.customer_name, 
        a.phone, 
        a.location, 
        a.shoe_count, 
        a.appointment_date, 
        a.appointment_time, 
        a.status, 
        a.created_at, 
        a.branch_id, 
        a.queue_id, 
        a.customer_id,
        c.origin_source as source,
        a.appointment_type AS type
      FROM 
        appointments a
      LEFT JOIN 
        customers c ON a.customer_id = c.id
      WHERE 
        a.branch_id = $1
        AND a.status != 'ยกเลิก'
        AND a.appointment_type = 'pickup'
        AND a.queue_id IS NULL  -- ✅ เฉพาะที่ยังไม่ได้สร้างคิว
      ORDER BY 
        a.appointment_date ASC
    `, [branch_id]);

    return result.rows;
    } catch (error) {
    console.error("🔴 Error fetching appointments for queue:", error.message);
    throw new Error(`❌ ไม่สามารถดึงข้อมูล appointments สำหรับ branch_id = ${branch_id}`);
    }
  }

  static async getAppointmentsForQueueAll(){
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.customer_name, 
        a.phone, 
        a.location, 
        a.shoe_count, 
        a.appointment_date, 
        a.appointment_time, 
        a.status, 
        a.created_at, 
        a.branch_id, 
        a.queue_id, 
        a.customer_id,
        c.origin_source as source,
        a.appointment_type AS type
      FROM 
        appointments a
      LEFT JOIN 
        customers c ON a.customer_id = c.id
      WHERE 
        a.status != 'ยกเลิก'
        AND a.appointment_type = 'pickup'
        AND a.queue_id IS NULL  -- ✅ เฉพาะที่ยังไม่ได้สร้างคิว
      ORDER BY 
        a.appointment_date ASC
    `);

    return result.rows;
    } catch (error) {
    console.error("🔴 Error fetching appointments for queue:", error.message);
    throw new Error(`❌ ไม่สามารถดึงข้อมูล appointments สำหรับ branch_id = ${branch_id}`);
    }
  }
}

export default Appointment;
