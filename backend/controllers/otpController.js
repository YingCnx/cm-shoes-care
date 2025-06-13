import { findAvailableSlot } from '../models/DropModel.js';

// ที่เก็บ OTP แบบชั่วคราวในหน่วยความจำ
const otpStore = new Map(); // key: phone, value: { otp, expiresAt }

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'กรุณาระบุเบอร์โทร' });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 3 * 60 * 1000; // หมดอายุใน 3 นาที

  otpStore.set(phone, { otp, expiresAt });

  console.log(`📲 OTP สำหรับเบอร์ ${phone} คือ: ${otp}`);

  res.json({ message: 'ส่ง OTP เรียบร้อย (mock)', otp }); // ส่งกลับมาด้วยกรณี test (ลบตอนขึ้น production)
};


export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  // ตรวจสอบ OTP
  const stored = otpStore.get(phone);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' });
  }

  otpStore.delete(phone);

  try {
    const lockerCode = req.headers['x-locker-id']; // "LKR010"
    const locker_id = parseInt(lockerCode?.slice(-2)); // 👉 ดึง 2 ตัวท้าย: "10"

    if (!locker_id) {
      return res.status(400).json({ message: 'ไม่ได้ระบุ locker_id' });
    }

    const slot = await findAvailableSlot(locker_id);

    if (!slot) {
      return res.status(200).json({ available: false, message: 'ไม่มีช่องว่างในตู้' });
    }

    res.json({
      message: 'ยืนยัน OTP สำเร็จ',
      available: true,
      slot: {
        id: slot.id,
        lockerId: slot.locker_id,
        number: slot.slot_number,
      },
    });
  } catch (err) {
    console.error('🔴 หา slot ว่างผิดพลาด:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะค้นหาช่องว่าง' });
  }
};