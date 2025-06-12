import React, { useState } from "react";
import "../assets/css/bootstrap.min.css";
import "./AddExpenseModal.css";

const AddExpenseModal = ({ show, onClose, onAddExpense }) => {
    const [expense, setExpense] = useState({ description: "", amount: "" });

    const handleSubmit = (e) => {
        e.preventDefault();    
        if (!expense.description.trim() || isNaN(expense.amount) || parseFloat(expense.amount) <= 0) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนเงินต้องมากกว่า 0");
            return;
        }
    
         // ✅ เพิ่มการยืนยันก่อนบันทึก
         if (!window.confirm("คุณต้องการเพิ่มค่าใช้จ่ายใช่หรือไม่?")) {
            return; // 🛑 ถ้ากด "ยกเลิก" ให้หยุดทำงาน
        }

        onAddExpense(expense); // ✅ ส่งค่าที่ถูกต้องไปยัง `handleAddExpense`
        setExpense({ description: "", amount: "" });
    };
    

    if (!show) return null;

    return (
        <div className="add-expense-modal-overlay">
            <div className="add-expense-modal-content">
                <h2>💰 เพิ่มค่าใช้จ่าย</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">รายละเอียดค่าใช้จ่าย</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="เช่น ค่าจัดส่งรองเท้า"
                            value={expense.description}
                            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="ระบุจำนวนเงิน"
                            value={expense.amount}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0 || e.target.value === "") {
                                    setExpense({ ...expense, amount: e.target.value });
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-danger" onClick={onClose}>❌ ปิด</button>
                        <button type="submit" className="btn btn-success">✅ เพิ่มค่าใช้จ่าย</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
