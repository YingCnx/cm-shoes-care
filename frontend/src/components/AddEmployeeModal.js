import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";
import "./AddEmployeeModal.css";
import { getBranches } from "../services/api";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ jwtDecode

const AddEmployeeModal = ({ show, onClose, onSave, employeeData }) => {
    const [branches, setBranches] = useState([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [error, setError] = useState(null); // ✅ State เก็บ Error
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        branch_id: "",
        password: "" // ✅ เพิ่มช่องรหัสผ่าน
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("🔴 No Token Found");
            return;
        }

        try {
            const user = jwtDecode(token);
            setIsSuperAdmin(user.isSuperAdmin);

            if (!user.isSuperAdmin) {
                setEmployee(prevState => ({
                    ...prevState,
                    branch_id: user.branch_id // ✅ ตั้งค่า branch_id เป็นสาขาของตัวเองถ้าไม่ใช่ SuperAdmin
                }));
            } else {
                fetchBranches();
            }
        } catch (error) {
            console.error("🔴 Error decoding token:", error);
        }
    }, []);

    useEffect(() => {
        if (employeeData) {
            setEmployee({ ...employeeData, password: "" }); // ✅ รีเซ็ตรหัสผ่านเมื่อแก้ไข
        } else {
            setEmployee(prevState => ({
                ...prevState,
                name: "",
                email: "",
                phone: "",
                role: "",
                password: ""
            }));
        }
    }, [employeeData]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            if (res.data.length === 0) {
                throw new Error("❌ ไม่พบข้อมูลสาขา กรุณาเพิ่มสาขาก่อน");
            }
            setBranches(res.data);
            setError(null); // ✅ เคลียร์ Error ถ้าดึงข้อมูลสำเร็จ
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
            setError(error.message || "❌ มีข้อผิดพลาดในการโหลดสาขา");
        }
    };

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!employee.name || !employee.email || !employee.phone || !employee.role || (!employeeData && !employee.password)) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (!window.confirm(`คุณต้องการ${employeeData ? "แก้ไข" : "เพิ่ม"}พนักงานนี้หรือไม่?`)) {
            return;
        }

        onSave(employee);
    };

    if (!show) return null;

    return (
        <div className="add-employee-modal-overlay">
            <div className="add-employee-modal-content card p-4 card shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="mb-3 text-start">{employeeData ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}</h2>

                {error && <p className="alert alert-danger">{error}</p>} {/* ✅ แสดง Error ถ้ามี */}

                <div className="mb-2">
                    <label className="form-label">ชื่อ</label>
                    <input type="text" name="name" className="form-control text-start w-100" placeholder="ชื่อ"
                        value={employee.name} onChange={handleChange} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">อีเมล</label>
                    <input type="email" className="form-control text-start w-100" placeholder="อีเมล"
                        name="email" value={employee.email} onChange={handleChange} required />
                </div>

                {!employeeData && (
                    <div className="mb-2">
                        <label className="form-label">รหัสผ่าน</label>
                        <input className="form-control text-start w-100" type="password" name="password"
                            value={employee.password} onChange={handleChange} required />
                    </div>
                )}

                <div className="mb-2">
                    <label className="form-label">เบอร์ติดต่อ</label>
                    <input type="text" className="form-control text-start w-100" placeholder="เบอร์ติดต่อ"
                        name="phone" value={employee.phone} onChange={handleChange} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">ตำแหน่ง</label>
                    <select className="form-control text-start w-100" name="role" value={employee.role} onChange={handleChange} required>
                        <option value="">-- เลือกตำแหน่ง --</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* ✅ แสดง dropdown เลือกสาขาเฉพาะ SuperAdmin เท่านั้น */}
                {isSuperAdmin && (
                    <div className="mb-2">
                        <label className="form-label">สาขา</label>
                        <select className="form-control text-start w-100" name="branch_id" value={employee.branch_id} onChange={handleChange} required>
                            <option value="">เลือกสาขา</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="d-flex justify-content-start mt-3 gap-2">
                    <button className="btn btn-secondary w-50" onClick={onClose}>
                        ❌ ปิด
                    </button>
                    <button className="btn btn-success w-50" onClick={handleSave}>
                        ✅ {employeeData ? "บันทึก" : "บันทึก"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
