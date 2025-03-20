import pool from "../config/database.js";

class Report {
        // ✅ รายงานรายรับ (Income Report) ดึงจากตาราง payments
    static async getIncomeReport(startDate, endDate, branch_id) {
        try {
            const result = await pool.query(
                `SELECT 
                p.id, 
                p.queue_id, 
                q.customer_name, 
                p.discount, 
                p.total_amount, 
                p.payment_method, 
                p.payment_date, 
                p.created_at, 
                p.payment_status
            FROM payments p
            JOIN queue q ON p.queue_id = q.id  
            WHERE p.payment_status = 'ชำระเงินแล้ว'
            AND p.payment_date BETWEEN $1 AND $2
            ${branch_id ? "AND q.branch_id = $3" : ""}`,  
            branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
            );

            return result.rows;  
        } catch (error) {
            throw new Error(`🔴 Error fetching income report: ${error.message}`);
        }
    }
    

    // ✅ 2. รายงานรายจ่าย (Payout Report)
    static async getPayoutsReport(startDate, endDate, branch_id) {
        const result = await pool.query(
            `SELECT id, payout_type, description, amount, branch_id, employee_id, notes, payout_date, created_at
                FROM payouts
                WHERE payout_date BETWEEN $1 AND $2 
             ${branch_id ? "AND branch_id = $3" : ""}`,
            branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
        );
        return result.rows;  
    } catch (error) {
        throw new Error(`🔴 Error fetching income report: ${error.message}`);
    
    }

    // ✅ 3. รายงานกำไร-ขาดทุน (Profit & Loss Report)
    static async getProfitLossReport(startDate, endDate, branch_id) {
        const income = await this.getAllIncomeReport(startDate, endDate, branch_id);
        const payout = await this.getAllPayoutsReport(startDate, endDate, branch_id);

        const total_income = parseFloat(income.total_income) || 0;
        const total_payout = parseFloat(payout.total_payout) || 0;
        const net_profit = total_income - total_payout;

        return [
            {
                total_income: total_income,
                total_payout: total_payout,
                net_profit: net_profit
            }
        ];
    }

    // ✅ 4. รายงานบริการยอดนิยม (Top Services Report)
    static async getTopServicesReport(startDate, endDate, branch_id) {
        const result = await pool.query(
            `SELECT 
                RANK() OVER (ORDER BY COUNT(qi.service_id) DESC) AS rank,  -- ✅ เพิ่มลำดับจากรายได้
                s.service_name, 
                COUNT(qi.service_id) AS usage_count, 
                SUM(qi.price_per_pair) AS total_revenue  -- ✅ รวมยอดรายได้
            FROM queue_items qi
            JOIN services s ON qi.service_id = s.id
            JOIN queue q ON qi.queue_id = q.id
            WHERE q.received_date BETWEEN $1 AND $2 
            ${branch_id ? "AND q.branch_id = $3" : ""}
            GROUP BY s.service_name
            ORDER BY total_revenue DESC  -- ✅ เรียงลำดับจากรายได้มากไปน้อย
            LIMIT 10`,
            branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
        );
        return result.rows;  
    } catch (error) {
        throw new Error(`🔴 Error fetching income report: ${error.message}`);
    
    }

    // ✅ 5. รายงานลูกค้า (Customer Report)
    static async getCustomerReport(startDate, endDate, branch_id) {
        try {
            const result = await pool.query(
                `WITH ranked_customers AS (
                    SELECT 
                        COALESCE(q.phone, '-') AS phone,  -- ✅ ใช้เบอร์โทรเป็นหลัก
                        ARRAY_AGG(DISTINCT COALESCE(q.customer_name, 'ลูกค้าไม่ระบุชื่อ')) AS customer_names,  -- ✅ รวมชื่อที่แตกต่างกัน
                        COUNT(q.id) AS total_orders,  
                        COALESCE(SUM(q.total_price), 0) AS total_spent  
                    FROM queue q
                    WHERE q.received_date BETWEEN $1 AND $2 
                    ${branch_id ? "AND q.branch_id = $3" : ""}
                    GROUP BY q.phone
                )
                SELECT 
                    RANK() OVER (ORDER BY total_spent DESC) AS rank, -- ✅ จัดอันดับจากยอดใช้จ่ายสูงสุด
                    phone, 
                    customer_names, 
                    total_orders, 
                    total_spent
                FROM ranked_customers
                LIMIT 10`, 
                branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
            );
    
            return result.rows.map(row => ({
                rank: row.rank,
                phone: row.phone,
                customer_names: row.customer_names.join(', '),  // ✅ แสดงรายชื่อทั้งหมดที่เคยใช้เบอร์นี้
                total_orders: row.total_orders,
                total_spent: row.total_spent
            }));
        } catch (error) {
            throw new Error(`🔴 Error fetching customer report: ${error.message}`);
        }
    }

    static async getAllIncomeReport(startDate, endDate, branch_id) {
        try {
            const result = await pool.query(
                `SELECT 
                    COALESCE(SUM(p.total_amount), 0) AS total_income 
                 FROM payments p
                 JOIN queue q ON p.queue_id = q.id  
                 WHERE p.payment_status = 'ชำระเงินแล้ว'
                 AND p.payment_date BETWEEN $1 AND $2
                 ${branch_id ? "AND q.branch_id = $3" : ""}`,  
                branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
            );
            return { total_income: result.rows[0].total_income };
        } catch (error) {
            throw new Error(`🔴 Error fetching income report: ${error.message}`);
        }
    }

    static async getAllPayoutsReport(startDate, endDate, branch_id) {
        try {
            const result = await pool.query(
                `SELECT COALESCE(SUM(amount), 0) AS total_payout
                 FROM payouts
                 WHERE payout_date BETWEEN $1 AND $2 
                 ${branch_id ? "AND branch_id = $3" : ""}`,
                branch_id ? [startDate, endDate, branch_id] : [startDate, endDate]
            );
            return { total_payout: result.rows[0].total_payout };
        } catch (error) {
            throw new Error(`🔴 Error fetching payouts report: ${error.message}`);
        }
    }
}

export default Report;
