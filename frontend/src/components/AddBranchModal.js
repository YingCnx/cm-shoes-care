import React, { useState } from "react";
import "../assets/css/bootstrap.min.css";
import "./AddBranchModal.css";

const AddBranchModal = ({ show, onClose, onSave, branchData }) => {
    const [name, setName] = useState(branchData?.name || "");
    const [location, setLocation] = useState(branchData?.location || "");
    const [phone, setPhone] = useState(branchData?.phone || "");

    const handleSave = () => {
        if (!name || !location || !phone) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (!window.confirm(`คุณต้องการ${branchData ? "แก้ไข" : "เพิ่ม"}สาขานี้หรือไม่?`)) {
            return;
        }

        onSave({ id: branchData?.id, name, location, phone });
        onClose();
    };

    if (!show) return null;

    return (
        <div className="add-branch-modal-overlay">
            <div className="add-branch-modal-content card shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="mb-3 text-start">{branchData ? "แก้ไขสาขา" : "เพิ่มสาขา"}</h2>

                <div className="mb-2 ">
                    <label className="form-label">ชื่อสาขา</label>
                    <input type="text" className="form-control text-start w-100" placeholder="ชื่อสาขา"
                        value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-2">
                    <label className="form-label">ที่อยู่</label>
                    <input type="text" className="form-control text-start w-100" placeholder="ที่อยู่"
                        value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className="mb-2">
                    <label className="form-label">เบอร์ติดต่อ</label>
                    <input type="text" className="form-control text-start w-100" placeholder="เบอร์ติดต่อ"
                        value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="d-flex justify-content-start mt-3 gap-5">
                    <button className="btn btn-secondary w-50" onClick={onClose}>
                        ❌ ปิด
                    </button>
                    <button className="btn btn-success w-50" onClick={handleSave}>
                        ✅ {branchData ? "บันทึกการเปลี่ยนแปลง" : "บันทึก"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBranchModal;
