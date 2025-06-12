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
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "🔴 ไม่พบพนักงานในระบบ!" });
        }

        const employee = result.rows[0];

        // 🔹 ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: "🔴 รหัสผ่านไม่ถูกต้อง!" });
        }

        // ✅ สร้าง Token
        const token = jwt.sign(
            {
                id: employee.id,
                email: employee.email,
                role: employee.role || "staff",
                branch_id: employee.branch_id
            },
            SECRET_KEY,
            { expiresIn: "8h" }
        );

        // ✅ ส่ง Token ผ่าน HTTP-only Secure Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 8 * 60 * 60 * 1000, // 8 ชั่วโมง
        });

        res.json({ message: "✅ ล็อกอินสำเร็จ", role: employee.role || "staff" });
    } catch (error) {
        console.error("🔴 Employee Login Error:", error);
        res.status(500).json({ message: "🚨 เกิดข้อผิดพลาดในระบบ!" });
    }
});

export default router;
