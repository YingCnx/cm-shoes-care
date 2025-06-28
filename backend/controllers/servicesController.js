import Service from "../models/Services.js";

// ✅ ดึงรายการบริการทั้งหมด
export const getAllServices = async (req, res) => {
    try {
      const { branch_id } = req.query; // รับค่า branch_id จาก query params
      const user = req.session.user;
  
      //console.log("📌 Debug: User Data:", user);
      //console.log("📌 Debug: branch_id =", branch_id);
  
      let services;
      if (user.isSuperAdmin) {
        // SuperAdmin สามารถดูทุกสาขา หรือเลือกเฉพาะสาขา
        services = branch_id ? await Service.getByBranch(branch_id) : await Service.getAll();
      } else {
        // Employee เห็นเฉพาะของสาขาตัวเอง
        services = await Service.getByBranch(user.branch_id);
      }
  
      //console.log("✅ Services Fetched:", services);
      res.json(services);
    } catch (error) {
      console.error("🔴 Error fetching services:", error.message);
      res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลบริการได้" });
    }
  };
  

// ✅ ดึงข้อมูลบริการตาม ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Services.getServiceById(req.params.id);
        if (!service) return res.status(404).json({ message: "❌ ไม่พบบริการ" });
        res.json(service);
    } catch (error) {
        console.error("🔴 Error fetching service:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ เพิ่มบริการใหม่
export const createService = async (req, res) => {
    try {
      const { service_name, base_price, description, branch_id } = req.body;
      const user = req.session.user;
  
      // Employee ต้องใช้ branch_id ของตัวเองเท่านั้น
      const assignedBranch = user.isSuperAdmin ? branch_id : user.branch_id;
  
      if (!service_name || !base_price || !assignedBranch) {
        return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
  
      const newService = await Service.create(service_name, base_price, description, assignedBranch);
      res.status(201).json({ message: "✅ เพิ่มบริการเรียบร้อย", service: newService });
    } catch (error) {
      console.error("🔴 Error creating service:", error.message);
      res.status(500).json({ message: "❌ ไม่สามารถเพิ่มบริการได้" });
    }
  };
  
  

// ✅ แก้ไขบริการ
export const updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const { service_name, base_price, description, branch_id } = req.body;
      const user = req.session.user;
  
      // Employee ไม่สามารถเปลี่ยน branch_id ได้
      const assignedBranch = user.isSuperAdmin ? branch_id : user.branch_id;
  
      const updatedService = await Service.update(id, service_name, base_price, description, assignedBranch);
      res.json({ message: "✅ อัปเดตบริการเรียบร้อย", service: updatedService });
    } catch (error) {
      console.error("🔴 Error updating service:", error.message);
      res.status(500).json({ message: "❌ ไม่สามารถอัปเดตบริการได้" });
    }
  };
  

// ✅ ลบบริการ
export const deleteService = async (req, res) => {
    try {
      const { id } = req.params;
      await Service.delete(id);
      res.json({ message: "✅ ลบบริการเรียบร้อย" });
    } catch (error) {
      console.error("🔴 Error deleting service:", error.message);
      res.status(500).json({ message: "❌ ไม่สามารถลบบริการได้" });
    }
  };
  
