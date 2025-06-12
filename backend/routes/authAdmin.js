import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config(); // โหลด .env

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

// 🔐 ล็อกอินแอดมิน
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials (User not found)' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (Password mismatch)' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'superadmin' },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: 'Login success' });
  } catch (error) {
    console.error("🔴 Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
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
