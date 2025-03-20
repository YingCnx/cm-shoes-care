import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    
    console.log("🔹 Database Result:", result.rows);  // ✅ ตรวจสอบค่าที่ได้จากฐานข้อมูล

    if (result.rows.length === 0) {
      console.log("🔴 No User Found!");
      return res.status(401).json({ message: 'Invalid credentials (User not found)' });
    }

    const admin = result.rows[0];
    console.log("🔹 Stored Hash:", admin.password);
    console.log("🔹 Entered Password:", password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔹 Password Match:", isMatch); // ✅ ตรวจสอบผลการเปรียบเทียบ

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (Password mismatch)' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email,isSuperAdmin:true },
      process.env.JWT_SECRET, // ✅ ต้องใช้ค่าจาก .env
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (error) {
    console.error("🔴 Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create-admin', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log("🔹 Received Data:", email, password); // ✅ ตรวจสอบค่าที่ส่งมา
    // ตรวจสอบว่ามี Admin อยู่แล้วหรือไม่
    const existingAdmin = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error("🔴 Create Admin Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/get-admins', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admins');
    res.json(result.rows);
  } catch (error) {
    console.error("🔴 Get Admins Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
