import Payout from "../models/Payout.js";

// ✅ ดึงข้อมูลรายจ่าย
export const getPayouts = async (req, res) => {
    try {
        const { start_date, end_date, branch_id } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "ต้องระบุช่วงวันที่" });
        }

        const payouts = await Payout.getPayouts(start_date, end_date, branch_id);
        res.json(payouts);
    } catch (error) {
        console.error("🔴 Error fetching payouts:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรายจ่าย" });
    }
};

// ✅ เพิ่มข้อมูลรายจ่าย
export const createPayout = async (req, res) => {
    try {
        const { payout_type, description, amount, notes, payout_date } = req.body;
        const { isSuperAdmin, branch_id, id: employee_id } = req.session.user; 

        if (!payout_type || !description || !amount || !payout_date) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        // ✅ Employee จะใช้ branch_id ของตัวเอง
        const payoutBranchId = isSuperAdmin ? req.body.branch_id : branch_id;

        const newPayout = await Payout.createPayout({
            payout_type,
            description,
            amount,
            branch_id: payoutBranchId,
            employee_id,
            notes,
            payout_date,
        });

        res.status(201).json(newPayout);
    } catch (error) {
        console.error("🔴 Error creating payout:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกรายจ่าย" });
    }
};

// ✅ อัปเดตข้อมูลรายจ่าย
export const updatePayout = async (req, res) => {
    try {
        const { id } = req.params;
        const { payout_type, description, amount, notes, payout_date } = req.body;

        const updatedPayout = await Payout.updatePayout(id, {
            payout_type,
            description,
            amount,
            notes,
            payout_date,
        });

        res.json(updatedPayout);
    } catch (error) {
        console.error("🔴 Error updating payout:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตรายจ่าย" });
    }
};

// ✅ ลบรายการรายจ่าย
export const deletePayout = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayout = await Payout.deletePayout(id);

        res.json(deletedPayout);
    } catch (error) {
        console.error("🔴 Error deleting payout:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบรายการรายจ่าย" });
    }
};
