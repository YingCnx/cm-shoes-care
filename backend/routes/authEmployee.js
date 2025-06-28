import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 🔐 ล็อกอินพนักงาน (ใช้ session)
router.post('/login', async (req, res) => {
  const { email, password, branch_id } = req.body;
  console.log("📥 Employee Login Attempt:", email, "Branch:", branch_id);

  try {
    const result = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    const employee = result.rows[0];
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    if (!branch_id) {
      return res.status(400).json({ message: 'กรุณาเลือกสาขา' });
    }

    // ✅ เซ็ต session พร้อม branch_id ที่เลือก
    req.session.user = {
      id: employee.id,
      email: employee.email,
      role: employee.role || 'staff',
      branch_id: parseInt(branch_id),  // บันทึก branch_id ที่ผู้ใช้เลือก
      isSuperAdmin: false
    };

    res.json({ message: 'Login success', role: employee.role });
  } catch (error) {
    console.error("🔴 Employee Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🚪 Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("🔴 Logout Error:", err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); // default cookie name ของ express-session
    res.json({ message: 'Logout success' });
  });
});

export default router;
