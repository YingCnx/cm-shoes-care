import LockerDrop from "../models/lockerDropModel.js";

// ✅ GET pending locker drops (by branch_id)
export const getPendingLockerDrops = async (req, res) => {
  try {
    const { branch_id } = req.query;

    if (!branch_id) {
      return res.status(400).json({ message: "กรุณาระบุรหัสสาขา" });
    }

    const drops = await LockerDrop.getPendingByBranch(branch_id);
    res.status(200).json(drops);
  } catch (error) {
    console.error("🔴 Error fetching pending locker drops:", error.message);
    res.status(500).json({ message: "ไม่สามารถดึงรายการที่ยังไม่รับจากตู้ได้" });
  }
};

// ✅ UPDATE status
export const updateLockerDropStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "กรุณาระบุสถานะใหม่" });
    }

    const updated = await LockerDrop.updateStatusById(id, status);
    if (!updated) {
      return res.status(404).json({ message: "ไม่พบรายการฝากตู้ที่ต้องการอัปเดต" });
    }

    res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", data: updated });
  } catch (error) {
    console.error("🔴 Error updating locker drop status:", error.message);
    res.status(500).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
};

// ✅ GET by ID
export const getLockerDropById = async (req, res) => {
  try {
    const drop = await LockerDrop.getById(req.params.id);
    if (!drop) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรายการฝากตู้" });
    }

    res.status(200).json(drop);
  } catch (error) {
    console.error("🔴 Error fetching locker drop:", error.message);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลรายการฝากตู้ได้" });
  }
};

// ✅ GET all (admin only)
export const getAllLockerDrops = async (req, res) => {
  try {
    const drops = await LockerDrop.getAll();
    res.status(200).json(drops);
  } catch (error) {
    console.error("🔴 Error fetching all locker drops:", error.message);
    res.status(500).json({ message: "ไม่สามารถดึงรายการฝากตู้ทั้งหมดได้" });
  }
};


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
      created_via = 'locker',
    } = req.body;

    // ✅ สร้าง transaction
    const transaction = await createTransaction({
      phone,
      branch_id,
      locker_id,
      slot_id,
      slot_type,
      status: 'dropped', // default เมื่อฝากรองเท้า
    });

    // ✅ สร้าง locker_drop
    // await db.none(
    //   `
    //   INSERT INTO locker_drop (transaction_id, locker_id, slot_id, status, service_type, total_pairs)
    //   VALUES ($1, $2, $3, 'pending_pickup', $4, $5)
    //   `,
    //   [transaction.id, locker_id, slot_id, service_type, total_pairs]
    // );

    // ✅ อัปเดตสถานะช่องตู้เป็น used
    await db.none(
      `
      UPDATE locker_slots SET status = 'used' WHERE id = $1
      `,
      [slot_id]
    );

    res.status(201).json({
      message: 'ฝากรองเท้าสำเร็จ',
      transaction,
    });
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    res.status(500).json({ error: 'ไม่สามารถฝากรองเท้าได้' });
  }
};