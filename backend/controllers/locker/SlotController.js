import Locker from '../../models/locker/Locker.js';
import LockerSlot from '../../models/locker/LockerSlot.js';
import LockerDrop from '../../models/locker/LockerDrop.js';
import { openLockerSlot } from '../../services/hardware.js'; // mock hardware call
import Notification from '../../models/Notification.js'; // ✅ import model


export const checkClosed = async (req, res) => {
  const { slotId } = req.params;
  try {
    const result = await LockerSlot.checkSlotClosed(slotId);
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

export const startDeposit = async (req, res) => {
  const { phone, total_pairs, slot_id } = req.body;
  const lockerCode = req.headers['x-locker-id'];

  const lockerInfo = await Locker.getLockerByCode(lockerCode);
  const slot = await LockerSlot.getById(slot_id);
  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

  if (!slot || slot.is_closed === false) {
    return res.status(400).json({ message: 'ยังไม่พบว่าตู้ถูกปิด กรุณาปิดตู้ก่อน' });
  }

  const transaction = await LockerDrop.insertTransaction({
    phone,
    total_pairs,
    branch_id: lockerInfo.branch_id,
    locker_id: lockerInfo.locker_id,
    slot_id: slot.id,
    slot_type: 'normal',
  });

  // ✅ ตอนนี้ค่อย update status เป็น 'using'
  await LockerSlot.updateSlotStatus(slot.id, 'using');

  await Notification.insert({
    type: 'locker',
    message: `ส่งรองเท้า ${total_pairs} คู่ | Locker ${lockerInfo.locker_name} ช่อง${slot.slot_number} วันที่ ${now}`,
  });

  return res.json({
    message: 'บันทึกข้อมูลเรียบร้อย',
    transactionId: transaction.id,
  });
};


export const findAvailableSlot = async (req, res) => {
  const { total_pairs } = req.params;
  const lockerCode = req.headers['x-locker-id'];
  console.log("🔍 lockerCode:", lockerCode);

  // ✅ ตรวจสอบจำนวนรองเท้า
  const pairCount = parseInt(total_pairs);
  if (!pairCount || isNaN(pairCount) || pairCount <= 0) {
    return res.status(400).json({ available: false, message: 'จำนวนรองเท้าไม่ถูกต้อง' });
  }

  // ✅ ตรวจสอบ locker
  const lockerInfo = await Locker.getLockerByCode(lockerCode);
  if (!lockerInfo) {
    return res.status(400).json({ message: 'ไม่พบ locker ดังกล่าว' });
  }

  const { locker_id, name: lockerName } = lockerInfo;

  // ✅ หาช่องว่าง
  const slot = await LockerSlot.findAvailableSlot(locker_id);
  if (!slot) {
    return res.status(200).json({ available: false, message: 'ไม่มีช่องว่างในตู้' });
  }

  try {
    // ✅ สั่งเปิดตู้ทันที
    await openLockerSlot(slot.slot_number);

    // ✅ อัปเดตสถานะ
    await LockerSlot.updateSlotIsClosed(slot.id, false);   // ตู้เปิดอยู่


    return res.status(200).json({
      available: true,
      slot: {
        id: slot.id,
        lockerId: locker_id,
        number: slot.slot_number,
        lockerName: lockerName,
      },
    });

  } catch (error) {
    console.error('🔴 ไม่สามารถเปิดตู้ได้:', error);
    return res.status(500).json({ available: false, message: 'ไม่สามารถเปิดตู้ได้ กรุณาลองใหม่' });
  }
};

