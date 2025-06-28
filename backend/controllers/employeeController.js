import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// 📌 ดึงรายชื่อพนักงานทั้งหมด
export const getAllEmployees = async (req, res) => {
    try {
        const { branch_id } = req.query; 
        const user = req.session.user;
        let employees;

        if (user.isSuperAdmin) {
            // 🔹 SuperAdmin เห็นทุกสาขา หรือเลือกเฉพาะสาขา
            employees = branch_id ? await Employee.getByBranch(branch_id) : await Employee.getAll();
        } else {
            // 🔹 Employee เห็นเฉพาะพนักงานในสาขาตัวเอง (ไม่รวมตัวเอง)
            employees = await Employee.getByBranch(user.branch_id);
            employees = employees.filter(emp => emp.id !== user.id); // ✅ ซ่อนตัวเอง
        }

        res.json(employees);
    } catch (error) {
        console.error("🔴 Error fetching employees:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 เพิ่มพนักงานใหม่
export const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, role, branch_id, password } = req.body;
        if (!name || !email || !phone || !role || !branch_id || !password) {
            return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
        }

        await Employee.create({ name, email, phone, role, branch_id, password });
        res.status(201).json({ message: "✅ เพิ่มพนักงานเรียบร้อย" });
    } catch (err) {
        console.error("🔴 Error creating employee:", err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 อัปเดตข้อมูลพนักงาน
export const updateEmployee = async (req, res) => {
    try {
       
        const { name, email, phone, role, branch_id } = req.body;
        const updatedEmployee = await Employee.update(req.params.id, { name, email, phone, role, branch_id });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "❌ ไม่พบพนักงาน" });
        }

        res.json({ message: "✅ อัปเดตพนักงานเรียบร้อย" });
    } catch (err) {
        console.error("🔴 Error updating employee:", err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 ลบพนักงาน
export const deleteEmployee = async (req, res) => {
    try {
        console.log("🗑 กำลังลบพนักงาน ID:", req.params.id);

        const deletedEmployee = await Employee.delete(req.params.id);
        if (!deletedEmployee) {
            console.log("❌ ไม่พบพนักงาน ID:", req.params.id);
            return res.status(404).json({ message: "❌ ไม่พบพนักงานที่ต้องการลบ" });
        }

        res.status(200).json({ message: "✅ ลบพนักงานเรียบร้อย" });
    } catch (err) {
        console.error("🔴 Error deleting employee:", err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ เปลี่ยนรหัสผ่านพนักงาน
export const updateEmployeePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "❌ กรุณาระบุรหัสผ่านใหม่" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔒 เข้ารหัส
    await Employee.updatePassword(id, hashedPassword);
    res.json({ message: "✅ เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("🔴 Error updating employee password:", error);
    res.status(500).json({ message: "❌ ไม่สามารถเปลี่ยนรหัสผ่านได้" });
  }
};
