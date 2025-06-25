import Statuses from "../models/statuses.js";

// ✅ ดึงสถานะทั้งหมด (ตาม type)
export const getAllStatuses = async (req, res) => {
  try {
    const { type } = req.query;
    const user = req.user;

    // SuperAdmin เห็นทุกประเภท / พนักงานอาจใช้แค่บางประเภท (ตาม logic ที่กำหนด)
    const statuses = await Statuses.getAll(type);

    res.json(statuses);
  } catch (error) {
    console.error("🔴 Error fetching statuses:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลสถานะได้" });
  }
};

// ✅ ดึงสถานะตาม ID
export const getStatusById = async (req, res) => {
  try {
    const status = await Statuses.getById(req.params.id);
    if (!status) return res.status(404).json({ message: "❌ ไม่พบสถานะนี้" });

    res.json(status);
  } catch (error) {
    console.error("🔴 Error fetching status:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถดึงสถานะได้" });
  }
};

// ✅ เพิ่มสถานะใหม่
export const createStatus = async (req, res) => {
  try {
    const {
      code,
      name_th,
      name_en,
      description,
      color_code,
      type,
      order_index,
      is_active,
      is_final,
    } = req.body;

    if (!code || !name_th || !type) {
      return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลจำเป็นให้ครบ" });
    }

    const newStatus = await Statuses.create({
      code,
      name_th,
      name_en,
      description,
      color_code,
      type,
      order_index,
      is_active,
      is_final,
    });

    res.status(201).json({ message: "✅ เพิ่มสถานะเรียบร้อย", status: newStatus });
  } catch (error) {
    console.error("🔴 Error creating status:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถเพิ่มสถานะได้" });
  }
};

// ✅ อัปเดตสถานะ
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      name_th,
      name_en,
      description,
      color_code,
      type,
      order_index,
      is_active,
      is_final,
    } = req.body;

    const status = await Statuses.getById(id);
    if (!status) return res.status(404).json({ message: "❌ ไม่พบสถานะนี้" });

    const updated = await Statuses.update(id, {
      code,
      name_th,
      name_en,
      description,
      color_code,
      type,
      order_index,
      is_active,
      is_final,
    });

    res.json({ message: "✅ อัปเดตสถานะเรียบร้อย", status: updated });
  } catch (error) {
    console.error("🔴 Error updating status:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถอัปเดตสถานะได้" });
  }
};

// ✅ ลบสถานะ
export const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await Statuses.delete(id);
    res.json({ message: "✅ ลบสถานะเรียบร้อย" });
  } catch (error) {
    console.error("🔴 Error deleting status:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถลบสถานะได้" });
  }
};
