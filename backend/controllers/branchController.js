import Branch from "../models/Branch.js";
import pool from "../config/database.js";

// 📌 1️⃣ ดึงรายชื่อสาขาทั้งหมด (เฉพาะ Admin)
export const getBranches = async (req, res) => {
  try {
    const user = req.session.user;
    console.log("📌 Debug: User Requesting Branches", user);

    if (!user?.role || (user.role !== "superadmin" && !user.branch_id)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    let branches;
    if (user.role === "superadmin") {
      branches = await Branch.getAll();
    } else {
      const branch = await Branch.getById(user.branch_id);
      if (!branch) {
        return res.status(404).json({ message: "No branch found" });
      }
      branches = [branch]; // ✅ แปลงเป็น array เสมอ
    }

    res.json(branches);
  } catch (error) {
    console.error("🔴 Error fetching branches:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBranchesPublic = async (req, res) => {
  try {
    const branches = await Branch.getAll();
    res.json(branches);
  } catch (error) {
    console.error("🔴 Error fetching public branches:", error);
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
    const user = req.session.user;
    if (!user?.role || user.role !== "superadmin") {
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
    const user = req.session.user;
    if (!user?.role || user.role !== "superadmin") {
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
    const user = req.session.user;
    if (!user?.role || user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const checkAppointments = await pool.query("SELECT COUNT(*) FROM appointments WHERE branch_id = $1", [branchId]);
    const checkEmployees = await pool.query("SELECT COUNT(*) FROM employees WHERE branch_id = $1", [branchId]);

    if (checkAppointments.rows[0].count > 0 || checkEmployees.rows[0].count > 0) {
      return res.status(400).json({ message: "❌ ไม่สามารถลบสาขานี้ได้ เนื่องจากมีข้อมูลอ้างอิงอยู่" });
    }

    await Branch.delete(branchId);
    res.json({ message: "✅ Branch deleted successfully" });

  } catch (error) {
    console.error("🔴 Error deleting branch:", error);
    res.status(500).json({ message: `❌ Server error: ${error.message}` });
  }
};
