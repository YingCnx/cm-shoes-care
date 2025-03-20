import Appointment from "../models/Appointment.js";

// 📌 1️⃣ ดึงรายการนัดหมาย (Admin เห็นทุกสาขา / Employee เห็นเฉพาะของตัวเอง)
export const getAppointments = async (req, res) => {
  try {
    const { branch_id } = req.query; 
    const user = req.user; // ได้จาก Middleware
    let appointments;


    if (user.isSuperAdmin) {
      // 🔹 Admin เห็นทุกสาขา หรือเลือกเฉพาะสาขา
      appointments = branch_id ? await Appointment.getByBranch(branch_id) : await Appointment.getAll();
    } else {
      // 🔹 Employee เห็นเฉพาะสาขาตัวเอง
      appointments = await Appointment.getByBranch(user.branch_id);
    }

     // ✅ กรองเฉพาะรายการที่ `queue_id = NULL`
     appointments = appointments.filter(appt => appt.queue_id === null);

    res.json(appointments);
  } catch (error) {
    console.error("🔴 Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 2️⃣ สร้างนัดหมายใหม่ (เฉพาะพนักงานสาขานั้น ๆ)
export const createAppointment = async (req, res) => {
  try {
    const user = req.user;
    const { customer_name, phone, location, shoe_count, appointment_date, appointment_time } = req.body;

    if (!user.isSuperAdmin && !user.branch_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const branch_id = user.isSuperAdmin ? req.body.branch_id : user.branch_id;

    await Appointment.create({
      customer_name,
      phone,
      location,
      shoe_count,
      appointment_date,
      appointment_time,
      branch_id,
    });

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error("🔴 Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 3️⃣ อัปเดตสถานะนัดหมาย (ต้องอยู่ในสาขาตัวเอง หรือเป็น Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const user = req.user;
    const appointment = await Appointment.getById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!user.isSuperAdmin && user.branch_id !== appointment.branch_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Appointment.updateStatus(req.params.id, req.body.status);
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("🔴 Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ อัปเดต queue_id ของนัดหมาย
export const updateAppointmentQueueId = async (req, res) => {
  try {
    const { id } = req.params; // appointment_id
    const { queue_id } = req.body; // ✅ ดึง queue_id ออกจาก body
  
      if (!queue_id) {
          return res.status(400).json({ message: "❌ ต้องระบุ queue_id!" });
      }

      const updatedAppointment = await Appointment.updateQueueId(id, queue_id);

      if (!updatedAppointment) {
          return res.status(404).json({ message: "❌ ไม่พบนัดหมายที่ต้องการอัปเดต!" });
      }

      res.status(200).json({ message: "✅ อัปเดต queue_id สำเร็จ!", data: updatedAppointment });
  } catch (error) {
      console.error("🔴 Error updating appointment queue_id:", error.message);
      res.status(500).json({ message: error.message });
  }
};


// 📌 4️⃣ อัปเดตรายละเอียดนัดหมาย (ต้องอยู่ในสาขาตัวเอง หรือเป็น Admin)
export const updateAppointment = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const appointment = await Appointment.getById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!user.isSuperAdmin && user.branch_id !== appointment.branch_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Appointment.updateAppointment(id, req.body);
    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("🔴 Error updating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 5️⃣ ลบนัดหมาย (ต้องอยู่ในสาขาตัวเอง หรือเป็น Admin)
export const deleteAppointment = async (req, res) => {
  try {
    const user = req.user;
    const appointment = await Appointment.getById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!user.isSuperAdmin && user.branch_id !== appointment.branch_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Appointment.delete(req.params.id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("🔴 Error deleting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


