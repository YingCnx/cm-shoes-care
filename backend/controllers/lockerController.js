// LockerController.js
import Locker from "../models/adminLocker/Locker.js";
import LockerSlot from "../models/adminLocker/LockerSlot.js";
import LockerDrop from "../models/adminLocker/LockerDrop.js";

import Branch from "../models/Branch.js";

import Queue from "../models/Queue.js";


// 📌 ดึงข้อมูลตู้ทั้งหมด (ตามสาขา หรือทุกตู้ถ้าเป็น superadmin)
export const getAllLockers = async (req, res) => {
  try {
    const { branch_id } = req.query;
    const user = req.user;
    let lockers;

    if (user.isSuperAdmin) {
      lockers = branch_id
        ? await Locker.getByBranch(branch_id)
        : await Locker.getAll();
    } else {
      lockers = await Locker.getByBranch(user.branch_id);
    }

    res.json(lockers);
  } catch (error) {
    console.error("🔴 Error fetching lockers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 📌 เพิ่มตู้ Locker ใหม่ พร้อมสร้าง code อัตโนมัติ
export const createLocker = async (req, res) => {
  try {
    const {
      name,
      branch_id,
      address,
      latitude,
      longitude,
      sim_number,
      device_serial,
      firmware_version,
      note,
      slot_count
    } = req.body;

    if (!name || !branch_id || !address) {
      return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
    }

    const branch = await Branch.getById(branch_id);
    if (!branch) return res.status(404).json({ message: "❌ ไม่พบข้อมูลสาขา" });

    const branchCode = 'BR' + branch.id.toString().padStart(2, '0');
    const existingLockers = await Locker.getByBranch(branch_id);
    const nextNumber = 'L'+ (existingLockers.length + 1).toString().padStart(3, '0');
    const generatedCode = `${branchCode}-${nextNumber}`;

    await Locker.create({
      code: generatedCode,
      name,
      branch_id,
      address,
      latitude,
      longitude,
      sim_number,
      device_serial,
      firmware_version,
      note,
      slot_count
    });

    res.status(201).json({
      message: "✅ เพิ่มตู้ Locker เรียบร้อย",
      code: generatedCode
    });

  } catch (err) {
    console.error("🔴 Error creating locker:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 อัปเดตข้อมูลตู้
export const updateLocker = async (req, res) => {
  try {
    const updatedLocker = await Locker.update(req.params.id, req.body);

    if (!updatedLocker) {
      return res.status(404).json({ message: "❌ ไม่พบตู้ Locker" });
    }

    res.json({ message: "✅ อัปเดตข้อมูลเรียบร้อย" });
  } catch (err) {
    console.error("🔴 Error updating locker:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 ลบตู้ Locker
export const deleteLocker = async (req, res) => {
  const lockerId = req.params.id;

  try {
    // ✅ 1. ตรวจสอบว่ามีคิวที่ใช้ locker นี้อยู่หรือไม่
    const queueInThisLocker = await Queue.getByLockerId(lockerId);

    if (queueInThisLocker.length > 0) {
      return res.status(400).json({
        message: "❌ ไม่สามารถลบตู้ได้ เนื่องจากมีคิวที่ใช้งานตู้ใบนี้อยู่",
      });
    }

    // ✅ 2. ลบตู้ (เมื่อไม่มีคิวใช้งาน)
    const deleted = await Locker.delete(lockerId);

    if (!deleted) {
      return res.status(404).json({ message: "❌ ไม่พบตู้ที่ต้องการลบ" });
    }

    res.status(200).json({ message: "✅ ลบตู้เรียบร้อย" });
  } catch (err) {
    console.error("🔴 Error deleting locker:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateLockerStatus = async (req, res) => {
  const { id } = req.params;
  const { is_online } = req.body;

  try {
    const updated = await Locker.updateStatus(id, is_online);
    if (!updated) {
      return res.status(404).json({ message: "❌ ไม่พบตู้" });
    }
    res.json({ message: "✅ อัปเดตสถานะเรียบร้อย", locker: updated });
  } catch (error) {
    console.error("🔴 Error updating locker status:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
};

//------------------SLOTS----------------//
export const getLockerSlots = async (req, res) => {
  const { lockerId } = req.params;
  try {
    const slots = await LockerSlot.getByLocker(lockerId); // <- เช็คให้ชื่อฟังก์ชันตรงกับ model
    res.json(slots);
  } catch (error) {
    console.error("🔴 Error fetching slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateSlot = async (req, res) => {
  const { slotId } = req.params;
  const { status } = req.body;

  try {
    const updated = await LockerSlot.update(slotId, status);
    if (!updated) {
      return res.status(404).json({ message: "❌ ไม่พบ slot นี้" });
    }
    res.json(updated);
  } catch (err) {
    console.error("🔴 Error updating slot:", err);
    res.status(500).json({ error: err.message });
  }
};

//-------------------locker-drop----------------//
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

