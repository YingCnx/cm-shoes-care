import LockerSlot from '../../models/locker/LockerSlot.js';

export const checkClosed = async (req, res) => {
  const { slotNumber } = req.params;
  try {
    const result = await LockerSlot.checkClosed(slotNumber);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'ไม่พบช่องตู้ที่ระบุ' });
    }
    const isClosed = result.rows[0].is_closed;
    res.json({ isClosed });
  } catch (err) {
    console.error('❌ ตรวจสอบตู้ล้มเหลว:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะตู้' });
  }
};