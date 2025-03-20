import pool from "../config/database.js";

class Payment {
    // ✅ ดึงข้อมูลคิวที่ต้องชำระเงิน (ที่สถานะเป็น "สำเร็จแล้ว")
    static async getCompletedQueues() {
        const result = await pool.query(`
            SELECT q.id, q.customer_name,q.phone,q.location, q.total_pairs, q.total_price, q.status 
            FROM queue q 
            WHERE q.status = 'จัดส่งสำเร็จ' and q.payment_status != 'ชำระเงินแล้ว'
        `);
        return result.rows;
    }

    // ✅ บันทึกการชำระเงิน
    static async create({ queue_id, discount, total_amount, payment_method, payment_status }) {
        try {
            const result = await pool.query(
                "INSERT INTO payments (queue_id, discount, total_amount, payment_method, payment_date, payment_status) VALUES ($1, $2, $3, $4, NOW() ,$5) RETURNING *",
                [queue_id, discount, total_amount, payment_method, payment_status]
            );

            await pool.query(
                "UPDATE queue SET payment_status = $1 WHERE id = $2",
                [payment_status,queue_id]
            );

            return result.rows[0];
        } catch (error) {
            console.error("🔴 Error processing payment:", error);
            throw error;
        }
    }

    // ✅ ดึงข้อมูลการชำระเงินของ Queue
    static async getPaymentByQueueId(queue_id) {
        const result = await pool.query(`
            SELECT * FROM payments WHERE queue_id = $1
        `, [queue_id]);
        return result.rows[0] || null;
    }

     // ✅ ลบข้อมูลการชำระเงินของ Queue
     static async deleteByQueueId(queue_id) {
        try {
            await pool.query("DELETE FROM payments WHERE queue_id = $1", [queue_id]);
        } catch (error) {
            console.error("🔴 Error deleting payment:", error);
            throw error;
        }
    }
}

export default Payment;
