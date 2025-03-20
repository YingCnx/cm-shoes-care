import pool from "../config/database.js";

class Expense {
    // 📌 ดึงค่าใช้จ่ายทั้งหมดของคิว
    static async getById(queue_id) {
        try {
            const result = await pool.query(
                `SELECT e.id, e.queue_id, e.description, e.amount
                 FROM expenses e 
                 WHERE e.queue_id = $1 `,
                [queue_id]
            );
            return result.rows;
        } catch (error) {
            console.error("🔴 Error fetching expenses:", error);
            throw error;
        }
    }

    // 📌 เพิ่มค่าใช้จ่ายใหม่
    static async create({ queue_id, description, amount }) {
        try {
            const result = await pool.query(
                `INSERT INTO expenses (queue_id, description, amount) 
                 VALUES ($1, $2, $3) RETURNING *`,
                [queue_id, description, amount]
            );
            return result.rows[0];
        } catch (error) {
            console.error("🔴 Error adding expense:", error);
            throw error;
        }
    }

    // 📌 ลบค่าใช้จ่าย
    static async delete(id) {
        try {
            const result = await pool.query(
                "DELETE FROM expenses WHERE id = $1 RETURNING *",
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error("🔴 Error deleting expense:", error);
            throw error;
        }
    }

    // 📌 ดึงค่าใช้จ่ายรวมของคิว
    static async getTotalExpensesByQueue(queue_id) {
        try {
            const result = await pool.query(
                "SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM expenses WHERE queue_id = $1",
                [queue_id]
            );
            return result.rows[0] || { total_expenses: 0 };
        } catch (error) {
            console.error("🔴 Error fetching total expenses:", error);
            throw error;
        }
    }
}

export default Expense;
