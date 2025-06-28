import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";
import "./AddEmployeeModal.css";
import { getBranches } from "../services/api";
import { checkSession } from '../services/authService'; 

const AddEmployeeModal = ({ show, onClose, onSave, employeeData }) => {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    branch_id: "",
    password: ""
  });

  // ✅ โหลด session และ branch list
  useEffect(() => {
    const init = async () => {
      const currentUser = await checkSession();
      if (!currentUser) {
        setError("🔒 กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      setUser(currentUser);
      try {
        const res = await getBranches();
        if (res.data.length === 0) {
          throw new Error("❌ ไม่พบข้อมูลสาขา กรุณาเพิ่มสาขาก่อน");
        }
        setBranches(res.data);

        if (!employeeData && currentUser.branch_id) {
          setEmployee(prev => ({ ...prev, branch_id: currentUser.branch_id }));
        }
      } catch (err) {
        console.error("🔴 Error fetching branches:", err);
        setError(err.message || "❌ ไม่สามารถโหลดรายชื่อสาขาได้");
      }
    };

    if (show) {
      init();
    }
  }, [show, employeeData]);

  // ✅ ตั้งค่า employee ใหม่เมื่อแก้ไข
  useEffect(() => {
    if (employeeData) {
      setEmployee({ ...employeeData, password: "" });
    } else {
      setEmployee({
        name: "",
        email: "",
        phone: "",
        role: "",
        branch_id: user?.branch_id || "",
        password: ""
      });
    }
  }, [employeeData, user]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!employee.name || !employee.email || !employee.phone || !employee.role || !employee.branch_id || (!employeeData && !employee.password)) {
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
      <div className="add-employee-modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
        <h2 className="mb-3 text-start">{employeeData ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}</h2>

        {error && <p className="alert alert-danger">{error}</p>}

        <div className="mb-2">
          <label className="form-label">ชื่อ</label>
          <input type="text" name="name" className="form-control" placeholder="ชื่อ"
            value={employee.name} onChange={handleChange} required />
        </div>

        <div className="mb-2">
          <label className="form-label">อีเมล</label>
          <input type="email" name="email" className="form-control" placeholder="อีเมล"
            value={employee.email} onChange={handleChange} required />
        </div>

        {!employeeData && (
          <div className="mb-2">
            <label className="form-label">รหัสผ่าน</label>
            <input type="password" name="password" className="form-control"
              value={employee.password} onChange={handleChange} required />
          </div>
        )}

        <div className="mb-2">
          <label className="form-label">เบอร์ติดต่อ</label>
          <input type="text" name="phone" className="form-control" placeholder="เบอร์ติดต่อ"
            value={employee.phone} onChange={handleChange} required />
        </div>

        <div className="mb-2">
          <label className="form-label">ตำแหน่ง</label>
          <select name="role" className="form-control" value={employee.role} onChange={handleChange} required>
            <option value="">-- เลือกตำแหน่ง --</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">สาขา</label>
          <select name="branch_id" className="form-control" value={employee.branch_id} onChange={handleChange} required>
            <option value="">-- เลือกสาขา --</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-start mt-3 gap-2">
          <button className="btn btn-secondary w-50" onClick={onClose}>❌ ปิด</button>
          <button className="btn btn-success w-50" onClick={handleSave}>✅ บันทึก</button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
