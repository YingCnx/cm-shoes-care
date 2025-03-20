import pool from "../config/database.js";

class Queue {

   // ✅ ฟังก์ชันสร้าง Queue ใหม่
   static async create({ customer_name, phone, location, total_pairs, total_price = 0, delivery_date, branch_id }) {
    try {
        const result = await pool.query(
            `INSERT INTO queue (customer_name, phone, location, total_pairs, total_price, delivery_date, branch_id, status, received_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'รับเข้า', NOW()) 
             RETURNING id`, // ✅ ต้องแน่ใจว่า column ที่ใส่ค่ามีครบ
            [customer_name, phone, location, total_pairs, total_price, delivery_date, branch_id]
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
                q.customer_name, 
                q.phone, 
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
            LEFT JOIN queue_items qi ON q.id = qi.queue_id
            LEFT JOIN services s ON qi.service_id = s.id
            GROUP BY q.id
            ORDER BY q.delivery_date ASC NULLS LAST
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
                q.customer_name, 
                q.phone, 
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
            LEFT JOIN queue_items qi ON q.id = qi.queue_id
            LEFT JOIN services s ON qi.service_id = s.id
            WHERE q.branch_id = $1  -- ✅ เพิ่มเงื่อนไขกรอง branch_id
            GROUP BY q.id
            ORDER BY q.delivery_date ASC NULLS LAST
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
                q.customer_name, 
                q.phone, 
                q.location, 
                q.total_pairs, 
                q.total_price, 
                q.delivery_date, 
                q.status, 
                q.received_date,
                q.payment_status,
                b.name AS branch_name,  -- ✅ ดึงชื่อสาขามาด้วย
                json_agg(
                    json_build_object(
                        'service_id', qi.service_id,
                        'service_name', s.service_name,
                        'price_per_pair', qi.price_per_pair
                    )
                ) FILTER (WHERE qi.service_id IS NOT NULL) AS services
            FROM queue q
            LEFT JOIN queue_items qi ON q.id = qi.queue_id
            LEFT JOIN services s ON qi.service_id = s.id
            LEFT JOIN branches b ON q.branch_id = b.id  -- ✅ JOIN กับตาราง branches
            WHERE q.id = $1  -- ✅ เงื่อนไขเลือกเฉพาะสาขาที่ต้องการ
            GROUP BY q.id, b.name
            ORDER BY q.delivery_date ASC NULLS LAST
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


  // ✅ อัปเดตสถานะคิว
  static async updateStatus(id, status, total_price = null) {
    try {
        if (status === "เตรียมส่ง" && (!total_price || isNaN(total_price))) {
            throw new Error("กรุณากรอกจำนวนเงินก่อนเปลี่ยนสถานะเป็น 'เตรียมส่ง'");
        }

        // ✅ ตรวจสอบค่า total_price ถ้าเป็น null ให้กำหนดเป็น 0
        const finalPrice = total_price !== null && !isNaN(total_price) ? total_price : 0;

        await pool.query(
            `UPDATE queue SET status = $1, total_price = COALESCE($2, total_price) WHERE id = $3`,
            [status, finalPrice, id]
        );

        return { message: "Queue status updated successfully!" };
    } catch (error) {
        throw new Error(`🔴 Error updating queue status: ${error.message}`);
    }
  }


  // ✅ ลบคิว (เฉพาะที่ยังไม่ส่งสำเร็จ)
  static async delete(id) {
    try {
      await pool.query(`DELETE FROM queue WHERE id = $1 AND status != 'จัดส่งสำเร็จ'`, [id]);
      return { message: "Queue deleted successfully!" };
    } catch (error) {
      throw new Error(`🔴 Error deleting queue: ${error.message}`);
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
