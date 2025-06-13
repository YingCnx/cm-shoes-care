import {
  insertTransaction,
  insertLockerDrop,
  updateSlotStatus,
} from '../models/DropModel.js';

export const createLockerDrop = async (req, res) => {
  try {
    const {
      phone,
      branch_id,
      locker_id,
      slot_id,
      slot_type = 'standard',
      service_type,
      total_pairs = 1,
    } = req.body;

    const transaction = await insertTransaction({
      phone,
      branch_id,
      locker_id,
      slot_id,
      slot_type,
    });

    await insertLockerDrop({
      transaction_id: transaction.id,
      locker_id,
      slot_id,
      service_type,
      total_pairs,
    });

    await updateSlotStatus(slot_id);

    res.status(201).json({ message: 'ฝากรองเท้าสำเร็จ', transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถฝากรองเท้าได้' });
  }
};
