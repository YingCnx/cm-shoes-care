import React, { useEffect, useState } from "react";
import { checkSession } from "../services/authService";
import "../assets/css/bootstrap.min.css";
import "./AddEmployeeModal.css"; // ใช้ style เดียวกัน


const AddCustomerModal = ({ show, onClose, onSave, customerData, branches = [], isSuperAdmin }) => {
    const [userBranchId, setUserBranchId] = useState(null);
    const isEditMode = !!customerData;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "Walk-in",
        notes: "",
        status: "active",
        branch_id: "",
        origin_source: "facebook" 
    });

    useEffect(() => {
    const init = async () => {
        const user = await checkSession();
        if (!user) return;

        if (user.role !== "superadmin") {
        setUserBranchId(user.branch_id);
        setFormData(prev => ({ ...prev, branch_id: user.branch_id.toString() }));
        }
    };

    init();
    }, []);

    useEffect(() => {
        if (customerData) {
            setFormData({
                id: customerData.id || "", // ✅ สำคัญ! ต้องใส่ id เพื่อให้รู้ว่าเป็นการแก้ไข
                name: customerData.name || "",
                phone: customerData.phone || "",
                address: customerData.address || "",
                notes: customerData.notes || "",
                status: customerData.status || "active",
                branch_id: customerData.branch_id?.toString() || userBranchId?.toString() || "",
                origin_source: customerData.origin_source || ""
            });
        }
    }, [customerData, userBranchId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        //console.log("Data",customerData);
        if (!formData.name || !formData.phone || formData.branch_id === null || formData.branch_id === "") {
            alert("❌ กรุณากรอกชื่อ เบอร์โทร และสาขาให้ครบถ้วน");
            return;
          }

        onSave(formData);
    };

    if (!show) return null;

    return (
        <div className="add-employee-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose(); // ✅ คลิกนอก modal ถึงจะปิด
            }}>
            <div className="add-employee-modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="mb-3 text-start">{isEditMode ? "แก้ไขข้อมูลลูกค้า" : " เพิ่มข้อมูลลูกค้า"}</h2>

                <div className="mb-2">
                    <label className="form-label">ช่องทาง</label>
                    <select name="origin_source" className="form-control" value={formData.origin_source} onChange={handleChange} >
                        <option value="facebook">Facebook</option>
                        <option value="line">LINE OA</option>
                        <option value="wechat">WeChat</option>
                        <option value="walkin">Walk-in</option>
                        <option value="locker">Locker</option>
                        <option value="manual">Manual</option>
                        <option value="other">อื่น ๆ</option>
                    </select>
                    </div>
                <div className="mb-2">
                    <label className="form-label">ชื่อ</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">เบอร์โทร</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">ที่อยู่</label>
                    <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} />
                </div>

                <div className="mb-2">
                    <label className="form-label">สถานะ</label>
                    <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                        <option value="active">✅ ใช้งาน</option>
                        <option value="inactive">⛔ หยุดใช้งาน</option>
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">หมายเหตุ</label>
                    <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} />
                </div>

                {isSuperAdmin && (
                    <div className="mb-2">
                        <label className="form-label">สาขา</label>
                        <select name="branch_id" className="form-control" value={formData.branch_id} onChange={handleChange} required>
                            <option value="">-- เลือกสาขา --</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="d-flex justify-content-start mt-3 gap-2">
                    <button className="btn btn-secondary w-50" onClick={onClose}>❌ ปิด</button>
                    <button className="btn btn-success w-50" onClick={handleSubmit}>
                        ✅ {isEditMode ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCustomerModal;
