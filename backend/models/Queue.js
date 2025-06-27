import pool from "../config/database.js";

  class Queue {

   // ✅ ฟังก์ชันสร้าง Queue ใหม่
   static async create({customer_id, customer_name, phone, location, total_pairs, total_price = 0,received_date, delivery_date, branch_id,source,locker_id,slot_id }) {
    try {
        const result = await pool.query(
            `INSERT INTO queue (customer_id,customer_name, phone, location, total_pairs, total_price, delivery_date, branch_id, status, received_date, source, locker_id, slot_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7,$8, 'รับเข้า', $9, $10, $11, $12) 
             RETURNING id`, // ✅ ต้องแน่ใจว่า column ที่ใส่ค่ามีครบ
            [customer_id,customer_name, phone, location, total_pairs, total_price, delivery_date, branch_id,received_date,source,locker_id,slot_id]
        );
        return result.rows[0].id; // ✅ Return queue_id
    } catch (error) {
        throw new Error(`🔴 Error creating queue: ${error.message}`);
    }
}
  


  // ✅ ดึงคิวทั้งหมด พร้อมข้อมูล services
  static async getAll() {
    try {
        const result = await pool.query(`
           SELECT 
                q.id AS queue_id, 
                c.name AS customer_name, 
                c.phone, 
                q.location, 
                q.total_pairs, 
                q.total_price, 
                q.delivery_date, 
                q.status, 
                q.received_date,
                q.payment_status,
                json_agg(
                    json_build_object(
                        'service_id', qi.service_id,
                        'service_name', s.service_name,
                        'price_per_pair', qi.price_per_pair
                    )
                ) FILTER (WHERE qi.service_id IS NOT NULL) AS services
            FROM queue q
            LEFT JOIN customers c ON q.customer_id = c.id
            LEFT JOIN queue_items qi ON q.id = qi.queue_id
            LEFT JOIN services s ON qi.service_id = s.id
            GROUP BY q.id, c.name, c.phone
            ORDER BY q.delivery_date ASC NULLS LAST;

        `);
        return result.rows;
    } catch (error) {
        throw new Error(`🔴 Error fetching queue: ${error.message}`);
    }
  }

  static async getByBranch(branch_id) {
    try {
        const result = await pool.query(`
            SELECT 
          q.id AS queue_id, 
          c.name AS customer_name, 
          c.phone, 
          q.location, 
          q.total_pairs, 
          q.total_price, 
          q.delivery_date, 
          q.status, 
          q.received_date,
          q.payment_status,
          q.source,             -- ✅ แหล่งที่มา เช่น locker, facebook, ฯลฯ
          q.return_slot_id,     -- ✅ ช่องที่ใช้ส่งคืน
          q.locker_id,          -- ✅ รหัสตู้
          q.slot_id,            -- ✅ ช่องที่ใช้รับเข้า
          json_agg(
              json_build_object(
                  'service_id', qi.service_id,
                  'service_name', s.service_name,
                  'price_per_pair', qi.price_per_pair
              )
          ) FILTER (WHERE qi.service_id IS NOT NULL) AS services
      FROM queue q
      LEFT JOIN customers c ON q.customer_id = c.id
      LEFT JOIN queue_items qi ON q.id = qi.queue_id
      LEFT JOIN services s ON qi.service_id = s.id
      WHERE q.branch_id = $1  AND q.status != 'ยกเลิก'
      GROUP BY 
          q.id, 
          c.name, 
          c.phone,
          q.source,
          q.return_slot_id,
          q.locker_id,
          q.slot_id
      ORDER BY q.delivery_date ASC NULLS LAST;

        `, [branch_id]);  // ✅ ส่งค่า branch_id ไปยัง Query
        return result.rows;
    } catch (error) {
        throw new Error(`🔴 Error fetching queue: ${error.message}`);
    }
}


   // ✅ ดึงคิวตาม ID พร้อมบริการและข้อมูลรองเท้า
   static async getById(id) {
    try {
      if (isNaN(id)) {
        throw new Error("Invalid Queue ID");
      }

      const queueResult = await pool.query(
        `
           SELECT 
              q.id AS queue_id, 
              q.id AS id,                          -- ✅ เพิ่ม id เฉย ๆ ด้วย เพื่อให้ frontend ใช้ queue.id ได้เลย
              q.customer_id,                       -- ✅ ต้องใช้สำหรับ appointment
              q.branch_id,                         -- ✅ ต้องใช้สำหรับ appointment
              c.name AS customer_name,            -- ✅ แสดงชื่อ
              c.phone,                            -- ✅ แสดงเบอร์
              q.location, 
              q.total_pairs, 
              q.total_price, 
              q.delivery_date, 
              q.status, 
              q.received_date,
              q.payment_status,
              q.source,                            -- ✅ ช่องทาง
              l.code AS locker_code,              -- ✅ รหัสตู้
              l.name AS locker_name,              -- ✅ ชื่อตู้
              q.slot_id,         
              b.name AS branch_name,              -- ✅ ชื่อสาขา
              json_agg(
                  json_build_object(
                      'service_id', qi.service_id,
                      'service_name', s.service_name,
                      'price_per_pair', qi.price_per_pair
                  )
              ) FILTER (WHERE qi.service_id IS NOT NULL) AS services
          FROM queue q
          LEFT JOIN customers c ON q.customer_id = c.id
          LEFT JOIN queue_items qi ON q.id = qi.queue_id
          LEFT JOIN services s ON qi.service_id = s.id
          LEFT JOIN branches b ON q.branch_id = b.id
          LEFT JOIN lockers l ON q.locker_id = l.id  
          WHERE q.id = $1
          GROUP BY q.id, q.customer_id, q.branch_id, c.name, c.phone, b.name, q.source, l.code, l.name, q.slot_id
          ORDER BY q.delivery_date ASC NULLS LAST;
        `, [id]);  

      if (queueResult.rows.length === 0) {
        throw new Error(`Queue ID ${id} not found`);
      }

      const queueData = queueResult.rows[0];

      // ✅ ดึงรายการบริการ + รองเท้าใน queue_items
      const itemsResult = await pool.query(
        `SELECT qi.id AS queue_item_id, qi.service_id, s.service_name, qi.price_per_pair, 
                qi.brand, qi.model, qi.color, qi.notes,
                qi.image_before_front, qi.image_before_back, qi.image_before_left, qi.image_before_right, qi.image_before_top, qi.image_before_bottom,
                qi.image_after_front, qi.image_after_back, qi.image_after_left, qi.image_after_right, qi.image_after_top, qi.image_after_bottom
         FROM queue_items qi
         LEFT JOIN services s ON qi.service_id = s.id
         WHERE qi.queue_id = $1`, 
        [id]
      );

      queueData.queue_items = itemsResult.rows.length > 0 ? itemsResult.rows : [];

      return queueData;
    } catch (error) {
      throw new Error(`🔴 Error fetching queue by ID: ${error.message}`);
    }
  }

// 📌 อัปเดตสถานะการชำระเงินของคิว
  static async updatePaymentStatus(queue_id, status) {
    try {
        const result = await pool.query(
            "UPDATE queue SET payment_status = $1 WHERE id = $2 RETURNING *",
            [status, queue_id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error("🔴 Error updating payment status:", error);
        throw error;
    }
  }

// ✅ อัปเดตสถานะคิว พร้อม delivery_method
static async updateStatus(id, status, total_price = null, delivery_method = null) {
  try {
    if (status === "เตรียมส่ง" && (!total_price || isNaN(total_price))) {
      throw new Error("กรุณากรอกจำนวนเงินก่อนเปลี่ยนสถานะเป็น 'เตรียมส่ง'");
    }

    const finalPrice = total_price !== null && !isNaN(total_price) ? total_price : 0;

    // ✅ เตรียม SQL และ parameters
    const updateFields = ['status = $1', 'total_price = $2'];
    const values = [status, finalPrice];

    // ✅ ถ้ามี delivery_method ให้เพิ่มเข้า SQL
    if (delivery_method && typeof delivery_method === 'string') {
      updateFields.push('delivery_method = $3');
      values.push(delivery_method.toLowerCase());
    }
    
    const sql = `UPDATE queue SET ${updateFields.join(', ')} WHERE id = $${values.length + 1}`;
    values.push(id);

    await pool.query(sql, values);

    return { message: "✅ อัปเดตสถานะคิวสำเร็จ!" };
  } catch (error) {
    throw new Error(`🔴 Error updating queue status: ${error.message}`);
  }
}


static async updateStatusbyAppointment(id, status) {
  try {
    const result = await pool.query(
      "UPDATE queue SET status = $1 WHERE id = $2 RETURNING *",
      [status, id] 
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("🔴 Error updating queue status:", error);
    throw error;
  }
}




  // ✅ ลบคิว (เฉพาะที่ยังไม่ส่งสำเร็จ)
static async delete(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1️⃣ อัปเดต locker_drop ให้ queue_id = null ก่อน
    await client.query(`UPDATE locker_drop SET queue_id = NULL WHERE queue_id = $1`, [id]);

    // 2️⃣ ลบ queue ถ้า status ยังไม่ใช่ 'จัดส่งสำเร็จ'
    await client.query(`DELETE FROM queue WHERE id = $1 AND status != 'จัดส่งสำเร็จ'`, [id]);

    await client.query('COMMIT');
    return { message: "✅ Queue deleted successfully!" };
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error(`🔴 Error deleting queue: ${error.message}`);
  } finally {
    client.release();
  }
}

// เปลี่ยนสถานะ queue เป็น "ยกเลิก" แทนการลบ
static async cancel(id) {
  try {
    const result = await pool.query(
      "UPDATE queue SET status = 'ยกเลิก' WHERE id = $1 RETURNING *",
      [id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("🔴 Error cancelling queue:", error);
    throw error;
  }
}

  //อัพเดทจำนวนรองเท้า
  static async updateTotalPairs(queue_id, total_pairs) {
    return await pool.query(
      `UPDATE queue SET total_pairs = $1 WHERE id = $2`,
      [total_pairs, queue_id]
    );
  }

  static async updateTotalPairsAndPrice(queue_id) {
    try {
        const result = await pool.query(
            `UPDATE queue 
            SET total_pairs = (SELECT COUNT(*) FROM queue_items WHERE queue_id = $1),
                total_price = (
                    COALESCE((SELECT SUM(price_per_pair) FROM queue_items WHERE queue_id = $1), 0) + 
                    COALESCE((SELECT SUM(amount) FROM expenses WHERE queue_id = $1), 0)
                )
            WHERE id = $1 RETURNING *;`,
            [queue_id]
        );
        return result.rows[0]; // ✅ คืนค่าข้อมูล Queue ที่อัปเดตแล้ว
    } catch (error) {
        throw new Error(`🔴 Error updating total_pairs and total_price: ${error.message}`);
    }
}


  // ✅ อัปเดต queue_id สำหรับนัดหมายที่เลือก
  static async updateQueueId(appointment_id, queue_id) {
    try {
        const result = await pool.query(
            `UPDATE appointments SET queue_id = $1 WHERE id = $2 RETURNING *`,
            [queue_id, appointment_id]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error(`🔴 Error updating appointment queue_id: ${error.message}`);
    }
  }

  static async updateQueue(id, location, total_pairs, received_date, delivery_date) {
    try {
      const result = await pool.query(
        `UPDATE queue SET location = $1, total_pairs = $2, received_date = $3, delivery_date = $4 WHERE id = $5 RETURNING *`,
        [location, total_pairs, received_date, delivery_date, id]
      );  
      return result.rows[0];
      } catch (error) {
        throw new Error(`🔴 Error updating queue: ${error.message}`);
      }
    }

      // ✅ ดึงคิวทั้งหมดที่ใช้ locker_id นี้
  static async getByLockerId(lockerId) {
    const result = await pool.query(
      `SELECT * FROM queue WHERE locker_id = $1`,
      [lockerId]
    );
    return result.rows;
  }

}


  // ✅ หาสถานะคิวจากเบอร์โทร
  export async function getQueueStatusByPhone(phone) {
    const result = await pool.query(
        "SELECT status FROM queue WHERE phone = $1 ORDER BY received_date DESC LIMIT 1",
        [phone]
    );
    return result.rows.length ? `สถานะ: ${result.rows[0].status}` : null;
  }

  // ✅ หาสถานะคิวจากรหัสคิว
  export async function getQueueStatusById(queue_id) {
    const result = await pool.query(
        "SELECT status FROM queue WHERE id = $1",
        [queue_id]
    );
    return result.rows.length ? `สถานะ: ${result.rows[0].status}` : null;
  }


    
  //สรุปรายได้ประจำเดือน
  export const getMonthlyRevenue = async () => {
    try {
        const [rows] = await db.execute(`
            SELECT SUM(total_amount) AS revenue 
            FROM payments
            WHERE EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);
        return rows[0].revenue || 0;
    } catch (error) {
        throw error;
    }
};






export default Queue;
