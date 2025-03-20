import pool from "../config/database.js";

class QueueItem {

    ///ปรับหน้า queueDetail
    // ✅ เพิ่มรองเท้าเข้า `queue_items`
    // ✅ เพิ่มรองเท้าใหม่ใน queue_items
    static async add(shoeData) {
      try {
          const result = await pool.query(`
              INSERT INTO queue_items (queue_id, service_id, price_per_pair, brand, model, color, notes, 
                                      image_before_front, image_before_back, image_before_left, image_before_right, image_before_top, image_before_bottom)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
              RETURNING *;
          `, [
              shoeData.queue_id,
              shoeData.service_id,
              shoeData.price_per_pair,
              shoeData.brand,
              shoeData.model,
              shoeData.color,
              shoeData.notes,
              shoeData.image_front,
              shoeData.image_back,
              shoeData.image_left,
              shoeData.image_right,
              shoeData.image_top,
              shoeData.image_bottom
          ]);

          return result.rows[0];
      } catch (error) {
          throw new Error(`🔴 Error adding shoe to queue: ${error.message}`);
      }
  }


  // ✅ ดึงรองเท้าทั้งหมดของคิวที่กำหนด
  static async getByQueueId(queue_id) {
    try {
        const result = await pool.query(
            `SELECT id, queue_id, service_id, price_per_pair, brand, model, color, notes, image_before_front, image_before_back, image_before_left, image_before_right, image_before_top, image_before_bottom, image_after_front, image_after_back, image_after_left, image_after_right, image_after_top, image_after_bottom
	        FROM queue_items WHERE queue_id = $1`,
            [queue_id]
        );
        return result.rows;
    } catch (error) {
        throw new Error(`🔴 Error fetching shoes for queue: ${error.message}`);
    }
  }

     // ✅ ฟังก์ชันลบ queue_item ตาม item_id
     static async delete(queue_item_id) {
        try {
            console.log("📌 Debug Params:", queue_item_id);  // ดูค่าที่ API ได้รับ
            await pool.query(
                `DELETE FROM queue_items WHERE id = $1`, 
                [queue_item_id]
            );
            return true;
        } catch (error) {
            console.error("🔴 Error deleting queue item:", error);
            throw new Error("Error deleting queue item");
        }
    }

  static async updateImages(queue_id, images) {
    const query = `
        UPDATE queue_items 
        SET             
            image_after_front = COALESCE($7, image_after_front),
            image_after_back = COALESCE($8, image_after_back),
            image_after_left = COALESCE($9, image_after_left),
            image_after_right = COALESCE($10, image_after_right),
            image_after_top = COALESCE($11, image_after_top),
            image_after_bottom = COALESCE($12, image_after_bottom)
        WHERE queue_id = $13
    `;
    await pool.query(query, [        
        images.image_after_front || null,
        images.image_after_back || null,
        images.image_after_left || null,
        images.image_after_right || null,
        images.image_after_top || null,
        images.image_after_bottom || null,
        queue_id
    ]);
  }

  // ✅ ฟังก์ชันอัปเดตรูป After ลงฐานข้อมูล
    static async updateAfterImages(item_id, updateData) {
        try {
            const query = `
                UPDATE queue_items
                SET 
                    image_after_front = COALESCE($1, image_after_front),
                    image_after_back = COALESCE($2, image_after_back),
                    image_after_left = COALESCE($3, image_after_left),
                    image_after_right = COALESCE($4, image_after_right),
                    image_after_top = COALESCE($5, image_after_top),
                    image_after_bottom = COALESCE($6, image_after_bottom)
                WHERE id = $7
                RETURNING *;
            `;

            const values = [
                updateData.image_after_front,
                updateData.image_after_back,
                updateData.image_after_left,
                updateData.image_after_right,
                updateData.image_after_top,
                updateData.image_after_bottom,
                item_id
            ];

            const result = await pool.query(query, values);
            return result.rows[0]; // ✅ คืนค่าข้อมูลที่อัปเดตแล้ว
        } catch (error) {
            throw new Error(`🔴 Error updating after images: ${error.message}`);
        }
    }

    // ✅ ดึง queue_item ตาม item_id
    static async getById(queue_item_id) {
        try {
            const result = await pool.query(
                `SELECT * FROM queue_items WHERE id = $1`, 
                [queue_item_id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error("🔴 Error fetching queue item by ID:", error);
            throw new Error("Error fetching queue item by ID");
        }
    }
}



export default QueueItem;
