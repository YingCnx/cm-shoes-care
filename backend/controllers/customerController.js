import Customer from "../models/Customer.js";

// ✅ CREATE
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, notes, branch_id, origin_source } = req.body;

    if (!name || !phone || !branch_id) {
      return res.status(400).json({ message: "กรุณาระบุชื่อ เบอร์โทร และสาขา" });
    }

    const newCustomer = await Customer.create({ name, phone, address, notes, branch_id, origin_source: origin_source || 'manual'});
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("🔴 Error creating customer:", error.message);

    // ✅ ตรวจจับ constraint ชื่อเฉพาะ
    if (error.code === "23505" && error.constraint === "unique_phone_per_branch") {
      return res.status(400).json({ message: "เบอร์โทรนี้มีอยู่ในสาขานี้แล้ว" });
    }

    res.status(500).json({ message: "ไม่สามารถเพิ่มลูกค้าได้" });
  }
};


// ✅ READ ALL (by branch_id)
export const getCustomers = async (req, res) => {
  try {
    const branchId = req.query.branch_id;

    let customers;
    if (branchId) {
      customers = await Customer.getByBranch(branchId);
    } else {
      customers = await Customer.getAll();
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("🔴 Error fetching customers:", error.message);
    res.status(500).json({ message: "ไม่สามารถดึงรายชื่อลูกค้าได้" });
  }
};

// ✅ READ ONE
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "ไม่พบลูกค้า" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("🔴 Error fetching customer:", error.message);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลลูกค้าได้" });
  }
};

// ✅ UPDATE
export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, address, status, notes, branch_id, origin_source } = req.body;

    const updatedCustomer = await Customer.update(req.params.id, {
      name, phone, address, status, notes, branch_id, origin_source
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("🔴 Error updating customer:", error.message);
    res.status(500).json({ message: "ไม่สามารถแก้ไขข้อมูลลูกค้าได้" });
  }
};

// ✅ DELETE (SuperAdmin only)
export const deleteCustomer = async (req, res) => {
  try {
    /* if (!req.user?.isSuperAdmin) {
      return res.status(403).json({ message: "เฉพาะ SuperAdmin เท่านั้นที่สามารถลบลูกค้าได้" });
    } */

    const existingCustomer = await Customer.getById(req.params.id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "ไม่พบลูกค้าที่ต้องการลบ" });
    }

    const deletedCustomer = await Customer.delete(req.params.id);
    res.status(200).json({ message: "ลบลูกค้าสำเร็จ", data: deletedCustomer });
  } catch (error) {
    console.error("🔴 Error deleting customer:", error.message);
    res.status(500).json({ message: "ไม่สามารถลบลูกค้าได้" });
  }
};


export const checkDuplicatePhone = async (req, res) => {
  try {
    const { phone, branch_id } = req.query;

    if (!phone || !branch_id) {
      return res.status(400).json({ message: "กรุณาระบุเบอร์โทรและรหัสสาขา" });
    }

    const exists = await Customer.isPhoneDuplicate(phone, branch_id);
    res.status(200).json({ exists });
  } catch (error) {
    console.error("❌ Error checking duplicate phone:", error);
    res.status(500).json({ message: "ไม่สามารถตรวจสอบเบอร์โทรได้" });
  }
};