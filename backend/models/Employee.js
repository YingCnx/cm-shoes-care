import pool from "../config/database.js";
import bcrypt from "bcryptjs";

class Employee {
    // 📌 ดึงรายชื่อพนักงานทั้งหมด
    static async getAll() {
        try {
            const result = await pool.query(`
                SELECT e.id, e.name, e.email, e.phone, e.role, 
                       e.branch_id, b.name AS branch_name
                FROM employees e
                LEFT JOIN branches b ON e.branch_id = b.id
                ORDER BY e.id ASC
            `);
            return result.rows;
        } catch (error) {
            console.error("🔴 Error fetching employees:", error);
            throw error;
        }
    }

    // 📌 ดึงรายชื่อพนักงานตาม branch_id
    static async getByBranch(branch_id) {
        try {
            const result = await pool.query(`
                SELECT e.id, e.name, e.email, e.phone, e.role, 
                       e.branch_id, b.name AS branch_name
                FROM employees e
                LEFT JOIN branches b ON e.branch_id = b.id
                WHERE e.branch_id = $1
                ORDER BY e.id ASC
            `, [branch_id]);
    
            return result.rows;
        } catch (error) {
            console.error("🔴 Error fetching employees by branch:", error.message);
            throw new Error(`❌ ไม่สามารถดึงข้อมูล employees สำหรับ branch_id = ${branch_id}`);
        }
    }

     // 📌 เพิ่มพนักงานใหม่ (พร้อมเข้ารหัสรหัสผ่าน)
     static async create({ name, email, phone, role, branch_id, password }) {
        try {
            // 🔑 เข้ารหัสรหัสผ่าน
            const hashedPassword = await bcrypt.hash(password, 12);

            // ✅ บันทึกข้อมูลพนักงานลงฐานข้อมูล
            await pool.query(
                "INSERT INTO employees (name, email, phone, role, branch_id, password) VALUES ($1, $2, $3, $4, $5, $6)",
                [name, email, phone, role, branch_id, hashedPassword] // ✅ ใช้ `hashedPassword`
            );

        } catch (error) {
            console.error("🔴 Error creating employee:", error);
            throw error;
        }
    }

    // 📌 อัปเดตข้อมูลพนักงาน
    static async update(id, { name, email, phone, role, branch_id }) {
        try {    
            const result = await pool.query(
                "UPDATE employees SET name = $1, email = $2, phone = $3, role = $4, branch_id = $5 WHERE id = $6 RETURNING *",
                [name, email, phone, role, branch_id, id]
            );
    
            //console.log("✅ Update Result:", result.rows);
    
            return result.rows[0] || null;
        } catch (err) {
            console.error("🔴 Database Update Error:", err);
            throw err;
        }
    }
    

    // 📌 ลบพนักงาน
    static async delete(id) {
        try {
            //console.log("🔍 Checking if employee exists:", id);
    
            // ✅ ตรวจสอบว่ามีพนักงานก่อนลบ
            const result = await pool.query("DELETE FROM employees WHERE id = $1 RETURNING *", [id]);
    
            ////console.log("✅ Employee deleted:", result.rows[0]); // Log เพื่อ debug
            return result.rows[0] || null;
        } catch (err) {
            console.error("🔴 Database Error:", err);
            throw err;
        }
    }
}

export default Employee;
