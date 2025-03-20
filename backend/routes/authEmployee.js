import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ โหลดค่าจาก .env

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret"; // ✅ ใช้ค่าจาก .env

// 🔐 ล็อกอินพนักงาน
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 🔹 ค้นหาพนักงานจากอีเมล
        const result = await pool.query("SELECT * FROM employees WHERE email = $1", [email]);
        console.log(result);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "🔴 ไม่พบพนักงานในระบบ!" });
        }

        const employee = result.rows[0];
        console.log("🔍 Employee Data:", employee);

        // 🔹 ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: "🔴 รหัสผ่านไม่ถูกต้อง!" });
        }

        // ✅ สร้าง Token
        const token = jwt.sign(
             { id: employee.id, email: employee.email, role: employee.role || 'staff',branch_id: employee.branch_id }, // ✅ ถ้า role เป็น null ให้เป็น staff
            SECRET_KEY,
            { expiresIn: "8h" }
                );
        res.json({ token, role: employee.role });
    } catch (error) {
        console.error("🔴 Employee Login Error:", error);
        res.status(500).json({ message: "🚨 เกิดข้อผิดพลาดในระบบ!" });
    }
});

export default router;
