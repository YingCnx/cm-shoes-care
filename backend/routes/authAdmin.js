import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // โหลด .env

const router = express.Router();

// 🔐 ล็อกอินแอดมิน (ใช้ session)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Login Attempt:", email);

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // ✅ เซ็ต session
    req.session.user = {
      id: admin.id,
      email: admin.email,
      role: 'superadmin',
      isSuperAdmin: true
    };

    res.json({ message: 'Login success' });
  } catch (error) {
    console.error("🔴 Login Error:", error);
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

    res.clearCookie('connect.sid'); // default session cookie name
    res.json({ message: 'Logout success' });
  });
});

// 🧑‍💻 สร้างแอดมินใหม่
router.post('/create-admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error("🔴 Create Admin Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔎 ดึงรายการแอดมินทั้งหมด
router.get('/get-admins', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admins');
    res.json(result.rows);
  } catch (error) {
    console.error("🔴 Get Admins Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ ลบแอดมิน
router.delete('/delete-admin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM admins WHERE id = $1', [id]);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error("🔴 Delete Admin Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
