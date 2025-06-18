import Locker from '../../models/locker/Locker.js';
import LockerSlot from '../../models/locker/LockerSlot.js';
import LockerDrop from '../../models/locker/LockerDrop.js';
import { openLockerSlot } from '../../services/hardware.js'; // mock hardware call

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
  const lockerCode = req.headers['x-locker-id'];
console.log("lockercode",lockerCode);
  // 🔄 เปลี่ยนชื่อ 'res' ซ้อน ให้เป็น 'lockerInfo'
  const lockerInfo = await Locker.getLockerByCode(lockerCode);

  if (!lockerInfo) {
    return res.status(400).json({ message: 'ไม่พบ locker ดังกล่าว' });
  }

  const { branch_id, locker_id } = lockerInfo;
  const slot_type = 'normal'; 
  const { phone } = req.body;

  if (!phone || !branch_id || !locker_id) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ (phone, branch_id, locker_id)' });
  }

  const slot = await LockerSlot.findAvailableSlot(locker_id);
  if (!slot) {
    return res.status(200).json({ available: false, message: 'ไม่มีช่องว่างในตู้' });
  }

  await openLockerSlot(slot.slot_number);
  await LockerSlot.updateSlotIsClosed(slot.id, false);
  await LockerSlot.updateSlotStatus(slot.id, 'available');

  const transaction = await LockerDrop.insertTransaction({
    phone,
    branch_id,
    locker_id,
    slot_id: slot.id,
    slot_type,
  });

  res.json({
    message: 'เปิดตู้แล้ว',
    transactionId: transaction.id,
    slot: {
      id: slot.id,
      lockerId: locker_id,
      number: slot.slot_number,
    },
  });
};


