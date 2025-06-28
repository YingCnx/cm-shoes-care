// LockerController.js
import Locker from "../models/adminLocker/Locker.js";
import LockerSlot from "../models/adminLocker/LockerSlot.js";
import LockerDrop from "../models/adminLocker/LockerDrop.js";

import Branch from "../models/Branch.js";

import Queue from "../models/Queue.js";

import Transaction from "../models/adminLocker/Transaction.js";
import Customer from "../models/Customer.js";



// 📌 ดึงข้อมูลตู้ทั้งหมด (ตามสาขา หรือทุกตู้ถ้าเป็น superadmin)
export const getAllLockers = async (req, res) => {
  try {
    const { branch_id } = req.query;
    const user = req.session.user;
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
    const branch_id = parseInt(req.query.branch_id);
    if (!branch_id) {
      return res.status(400).json({ message: "กรุณาระบุ branch_id" });
    }

    const drops = await LockerDrop.getUnqueuedByBranch(branch_id);
    res.json(drops);
  } catch (err) {
    console.error("❌ getAllLockerDrops error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

export const updateStatusWithImage = async (req, res) => {
  const { id } = req.params; // transaction_id
  const file = req.file;

  try {
    // 1️⃣ ดึงข้อมูล transaction
    const tx = await Transaction.getById(id);
    if (!tx) return res.status(404).json({ message: "ไม่พบ transaction" });

    // 2️⃣ ดึงหรือสร้าง customer
    let customer = await Customer.findCustomerByPhone(tx.phone);

    if (!customer) {
      customer = await Customer.createFromLocker({
        phone: tx.phone,
        branch_id: tx.branch_id,
        locker_name: tx.locker_name
      });
    }

    if (!customer?.id) {
      throw new Error("ไม่พบหรือลูกค้าไม่มี id");
    }

    // 3️⃣ เตรียม path รูป
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    // 4️⃣ บันทึก locker_drop
    const drop = await LockerDrop.create({
      customer_id: customer.id,
      transaction_id: tx.id,
      locker_id: tx.locker_id,
      slot_id: tx.slot_id,
      proof_image_url: imageUrl,
      total_pairs: tx.total_pairs
    });

    // 5️⃣ อัปเดต status ของ transaction
    await Transaction.updateStatus(tx.id, 'received');

    await LockerSlot.updateStatus(tx.slot_id, 'available');


    return res.status(200).json({ message: "รับรองเท้าสำเร็จ", locker_drop: drop });

  } catch (err) {
    console.error("❌ updateStatusWithImage error:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

export const updateLockerDropQueueId = async (req, res) => {
  const { id } = req.params;
  const { queue_id } = req.body;

  try {
    const result = await LockerDrop.updateQueueId(id, queue_id);
    res.json(result);
  } catch (error) {
    console.error("updateLockerDropQueueId error:", error);
    res.status(500).json({ error: "ไม่สามารถอัปเดต queue_id ได้" });
  }
};

