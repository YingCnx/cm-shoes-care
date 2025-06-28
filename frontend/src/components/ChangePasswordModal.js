import React, { useState } from "react";
import "../assets/css/bootstrap.min.css";

const ChangePasswordModal = ({ show, onClose, onSave, employeeId }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (!password || !confirmPassword) {
      alert("❌ กรุณากรอกรหัสผ่านให้ครบ");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }

     if (!window.confirm("คุณต้องการเปลี่ยนรหัสผ่านพนักงานคนนี้ใช่หรือไม่?")) {
        return;
    }
    
    onSave(employeeId, password); // ส่งรหัสผ่านและ id กลับไปที่หน้า parent
  };

  if (!show) return null;

  return (
    <div className="add-employee-modal-overlay">
      <div className="add-employee-modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
        <h2 className="mb-3 text-start">🔐 เปลี่ยนรหัสผ่าน</h2>

        <div className="mb-2">
          <label className="form-label">รหัสผ่านใหม่</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่านใหม่"
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">ยืนยันรหัสผ่าน</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="ยืนยันรหัสผ่าน"
            required
          />
        </div>

        <div className="d-flex justify-content-start gap-2 mt-3">
          <button className="btn btn-secondary w-50" onClick={onClose}>❌ ปิด</button>
          <button className="btn btn-success w-50" onClick={handleSave}>✅ บันทึก</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
