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
