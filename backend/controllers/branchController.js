import Branch from "../models/Branch.js";
import pool from "../config/database.js";

// 📌 1️⃣ ดึงรายชื่อสาขาทั้งหมด (เฉพาะ Admin)
export const getBranches = async (req, res) => {
  try {
    //console.log("📌 Debug: User Requesting Branches", req.user);

    // ✅ อนุญาตเฉพาะ SuperAdmin หรือ Employee ที่มี branch_id เท่านั้น
    if (!req.user.isSuperAdmin && !req.user.branch_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // ✅ SuperAdmin เห็นทุกสาขา
    let branches;
    if (req.user.isSuperAdmin) {
      branches = await Branch.getAll();
    } else {
      // ✅ Employee เห็นเฉพาะสาขาของตัวเอง
      branches = await Branch.getById(req.user.branch_id);
    }

    //console.log("📌 Debug: Branches Data", branches);
    
    if (!branches.length) {
      return res.status(404).json({ message: "No branches found" });
    }

    res.json(branches);
  } catch (error) {
    console.error("🔴 Error fetching branches:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 📌 2️⃣ ดึงข้อมูลสาขาเดี่ยว
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.getById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.error("🔴 Error fetching branch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 3️⃣ สร้างสาขาใหม่ (เฉพาะ Admin)
export const createBranch = async (req, res) => {
  try {
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { name, location, phone } = req.body;
    if (!name || !location || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await Branch.create({ name, location, phone });
    res.status(201).json({ message: "Branch created successfully" });
  } catch (error) {
    console.error("🔴 Error creating branch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 4️⃣ อัปเดตข้อมูลสาขา (เฉพาะ Admin)
export const updateBranch = async (req, res) => {
  try {
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { name, location, phone } = req.body;
    if (!name || !location || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await Branch.update(req.params.id, { name, location, phone });
    res.json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("🔴 Error updating branch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 5️⃣ ลบสาขา (เฉพาะ Admin)
export const deleteBranch = async (req, res) => {
  const branchId = req.params.id;

  try {
      console.log(`📌 Debug: Checking references for branch ${branchId}`);

      // ✅ ตรวจสอบว่ามีการอ้างอิงใน appointments หรือ employees
      const checkAppointments = await pool.query("SELECT COUNT(*) FROM appointments WHERE branch_id = $1", [branchId]);
      const checkEmployees = await pool.query("SELECT COUNT(*) FROM employees WHERE branch_id = $1", [branchId]);

      console.log(`📌 Debug: Appointments Count: ${checkAppointments.rows[0].count}`);
      console.log(`📌 Debug: Employees Count: ${checkEmployees.rows[0].count}`);

      if (checkAppointments.rows[0].count > 0 || checkEmployees.rows[0].count > 0) {
          console.error("🔴 Cannot delete branch: It has related records.");
          return res.status(400).json({ message: "❌ ไม่สามารถลบสาขานี้ได้ เนื่องจากมีข้อมูลอ้างอิงอยู่" });
      }

      // ✅ ลบสาขา
      console.log(`📌 Debug: Deleting branch ${branchId}`);
      await Branch.delete(branchId);
      
      res.json({ message: "✅ Branch deleted successfully" });

  } catch (error) {
      console.error("🔴 Error deleting branch:", error);
      res.status(500).json({ message: `❌ Server error: ${error.message}` });
  }
};