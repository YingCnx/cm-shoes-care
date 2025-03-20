import pool from "../config/database.js";

const Payout = {
    // ✅ ดึงข้อมูลรายจ่ายตามช่วงวันที่ และเฉพาะสาขาที่กำหนด
    async getPayouts(startDate, endDate, branch_id) {
        try {
            const query = `
                SELECT 
                    p.id, 
                    p.payout_type, 
                    p.description, 
                    p.amount, 
                    p.branch_id, 
                    b.name AS branch_name, 
                    e.name AS employee_name,
                    p.notes, 
                    p.payout_date, 
                    p.created_at
                FROM payouts p
                LEFT JOIN branches b ON p.branch_id = b.id
                LEFT JOIN employees e ON p.employee_id = e.id
                WHERE p.payout_date BETWEEN $1 AND $2
                ${branch_id ? "AND p.branch_id = $3" : ""}
                ORDER BY p.payout_date ASC
            `;

            const params = branch_id ? [startDate, endDate, branch_id] : [startDate, endDate];
            const result = await pool.query(query, params);

            return result.rows;
        } catch (error) {
            console.error("🔴 Error fetching payouts:", error);
            throw error;
        }
    },

    // ✅ บันทึกข้อมูลรายจ่าย
    async createPayout({ payout_type, description, amount, branch_id, employee_id, notes, payout_date }) {
        try {
            const query = `
                INSERT INTO payouts (payout_type, description, amount, branch_id, employee_id, notes, payout_date, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                RETURNING *
            `;
            const values = [payout_type, description, amount, branch_id, employee_id, notes, payout_date];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("🔴 Error creating payout:", error);
            throw error;
        }
    },

    // ✅ อัปเดตข้อมูลรายจ่าย
    async updatePayout(id, { payout_type, description, amount, notes, payout_date }) {
        try {
            const query = `
                UPDATE payouts
                SET payout_type = $1, description = $2, amount = $3, notes = $4, payout_date = $5
                WHERE id = $6
                RETURNING *
            `;
            const values = [payout_type, description, amount, notes, payout_date, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("🔴 Error updating payout:", error);
            throw error;
        }
    },

    // ✅ ลบรายการรายจ่าย
    async deletePayout(id) {
        try {
            const query = `DELETE FROM payouts WHERE id = $1 RETURNING *`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("🔴 Error deleting payout:", error);
            throw error;
        }
    },
};

export default Payout;
