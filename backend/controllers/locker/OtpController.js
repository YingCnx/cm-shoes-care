
import LockerSlot from '../../models/locker/LockerSlot.js';

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

  const stored = otpStore.get(phone);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' });
  }

  otpStore.delete(phone);

  try {
    res.json({
      message: 'ยืนยัน OTP สำเร็จ'
    });
  } catch (err) {
    console.error('🔴 เกิดข้อผิดพลาด:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยัน OTP' });
  }
};
