import Expense from "../models/expense.js";
import Queue from "../models/Queue.js";

// ✅ ดึงค่าใช้จ่ายทั้งหมดของคิว
export const getExpenses = async (req, res) => {
  try {
    const { queue_id } = req.params;
    const expenses = await Expense.getById(queue_id);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ เพิ่มค่าใช้จ่ายใหม่
export const createExpense = async (req, res) => {
  try {
      const { queue_id, description, amount } = req.body;

    

      if (!queue_id || !description || !amount) {
          return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
      }

      const newExpense = await Expense.create({ queue_id, description, amount });
      await Queue.updateTotalPairsAndPrice(queue_id);
      res.status(201).json(newExpense);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// ✅ ลบค่าใช้จ่าย
export const deleteExpense = async (req, res) => {
    try {
        const { queue_id, id } = req.params;

        // ✅ ตรวจสอบว่ามีค่าใช้จ่ายที่ต้องการลบหรือไม่
        const expense = await Expense.getById(id);
        if (!expense) {
            return res.status(404).json({ message: "❌ ไม่พบค่าใช้จ่ายที่ต้องการลบ!" });
        }

        // ✅ ลบค่าใช้จ่ายจากฐานข้อมูล
        await Expense.delete(id);

        // ✅ อัปเดต total_price ใน queue
        await Queue.updateTotalPairsAndPrice(queue_id);

        res.status(200).json({ message: "✅ ลบค่าใช้จ่ายสำเร็จ และอัปเดตยอดรวมแล้ว!" });
    } catch (error) {
        console.error("🔴 Error deleting expense:", error.message);
        res.status(500).json({ message: "❌ ไม่สามารถลบค่าใช้จ่ายได้!" });
    }
};


// ✅ ดึงค่าใช้จ่ายรวมของคิว
export const getTotalExpensesByQueue = async (req, res) => {
  try {
    const { queue_id } = req.params;
    const total = await Expense.getTotalExpensesByQueue(queue_id);
    res.status(200).json(total || { total_expenses: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
