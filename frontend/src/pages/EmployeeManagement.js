import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getBranches,updateEmployeePassword } from "../services/api";
import { jwtDecode } from "jwt-decode";
import AddEmployeeModal from "../components/AddEmployeeModal";
import { checkSession } from "../services/authService";
import "../assets/css/bootstrap.min.css";
import './EmployeeManagement.css';
import ChangePasswordModal from "../components/ChangePasswordModal";


const EmployeeManagement = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);


    useEffect(() => {
    const init = async () => {
        const user = await checkSession();
        if (!user) {
        setTimeout(() => navigate("/login"), 0);
        return;
        }

        const isSuperAdmin = user.role === "superadmin";
        setIsSuperAdmin(isSuperAdmin);
        setEmployeeId(user.id);
        setSelectedBranch(isSuperAdmin ? null : user.branch_id);

        if (isSuperAdmin) {
        fetchBranches();
        } else {
        fetchEmployees(user.branch_id);
        }
    };

    init();
    }, [navigate]);

    useEffect(() => {
        if (selectedBranch !== null) {
            fetchEmployees(selectedBranch);
        }
    }, [selectedBranch]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };
    const fetchEmployees = async (branchId) => {
        try {          
            const res = await getEmployees(branchId);
            setEmployees(res.data);
            
        } catch (error) {
            console.error("🔴 Error fetching employees:", error);
        }
    };

    
    const handleCreateOrUpdateEmployee = async (employeeData) => {
        try {
            // ✅ ตรวจสอบค่าของ branch_id และแปลงเป็น `null` ถ้าเป็นค่าว่าง
            if (employeeData.branch_id === "" || employeeData.branch_id === undefined) {
                employeeData.branch_id = null;
            } else {
                employeeData.branch_id = parseInt(employeeData.branch_id); // แปลงเป็นตัวเลข
            }

            // ตรวจสอบว่าข้อมูลครบหรือไม่
            if (!employeeData.name || !employeeData.email || !employeeData.phone || !employeeData.role || employeeData.branch_id === null) {
                console.error("❌ ข้อมูลไม่ครบถ้วน:", employeeData);
                alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
                return; // ❌ ไม่เรียก API และคง Modal ไว้
            }
    
            let response;
            if (employeeData.id) {
                response = await updateEmployee(employeeData.id, employeeData);
            } else {
                response = await createEmployee(employeeData);
            }
    
            // เช็คว่าการสร้าง/อัปเดตสำเร็จหรือไม่
            if (response.status === 201 || response.status === 200) {
                alert("✅ บันทึกสำเร็จ!");
                fetchEmployees(); // อัปเดตรายชื่อพนักงาน
                setShowAddModal(false); // ✅ ปิด Modal เมื่อสำเร็จ
                setEditEmployee(null); // ✅ รีเซ็ตข้อมูลที่กำลังแก้ไข
            } else {
                console.error("🔴 Unexpected response:", response);
                alert("❌ เกิดข้อผิดพลาด ไม่สามารถบันทึกพนักงานได้");
            }
        } catch (error) {
            console.error("🔴 Error saving employee:", error);
            alert("❌ เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลพนักงานได้");
        }
    };
    
    

    const handleDelete = async (id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานนี้?")) {
            return;
        }
    
        try {
            const response = await deleteEmployee(id);
    
            if (response.status === 200) {
                alert("✅ ลบพนักงานเรียบร้อย");
                fetchEmployees(); // โหลดรายชื่อพนักงานใหม่
            } else {
                console.error("❌ ไม่สามารถลบพนักงาน:", response.data);
                alert("❌ ลบพนักงานไม่สำเร็จ!");
            }
        } catch (error) {
            console.error("🔴 Error deleting employee:", error);
            alert("❌ เกิดข้อผิดพลาด ไม่สามารถลบพนักงานได้");
        }
    };

        
    const handleChangePassword = (id) => {
    setSelectedEmployeeId(id);
    setShowPasswordModal(true);
    };

    const handleSavePassword = async (id, newPassword) => {
    try {
        await updateEmployeePassword(id, newPassword);
        alert("✅ เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
        setShowPasswordModal(false);
    } catch (error) {
        console.error("🔴 Error changing password:", error);
        alert("❌ เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    }
    };

    return (
        <div className="employee-container">
            <h2>👥 ระบบจัดการพนักงาน</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>⬅️ กลับไปหน้า Dashboard</button>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>➕ เพิ่มพนักงาน</button>
            </div>

             {/* ✅ ฟิลเตอร์ SuperAdmin เลือกสาขา */}
             {isSuperAdmin && (
                <div className="mb-3">
                    <label className="form-label">เลือกสาขา</label>
                    <select className="form-control" value={selectedBranch || ''} onChange={(e) => setSelectedBranch(e.target.value)}>
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* ตารางพนักงาน */}
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อ</th>
                        <th>อีเมล</th>
                        <th>เบอร์ติดต่อ</th>
                        <th>ตำแหน่ง</th>
                        <th>สาขา</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.role}</td>
                            <td>{employee.branch_name || "-"}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                    setEditEmployee(employee);
                                    setShowAddModal(true);
                                    }}
                                >
                                    ✏️ แก้ไข
                                </button>
                                 <button
                                    className="btn btn-secondary btn-sm ms-2"
                                    onClick={() => handleChangePassword(employee.id)}
                                >
                                    🔐 เปลี่ยนรหัสผ่าน
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    ❌ ลบ
                                </button>

                               
                                </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* แสดง Modal เมื่อกดปุ่ม "เพิ่มพนักงาน" หรือ "แก้ไขพนักงาน" */}
            {showAddModal && (
                <AddEmployeeModal
                    show={showAddModal}
                    onClose={() => {// ❌ ปิด Modal เฉพาะเมื่อไม่มีพนักงานที่แก้ไข
                            setShowAddModal(false);
                            setEditEmployee(null);
                    }}
                    onSave={handleCreateOrUpdateEmployee}
                    employeeData={editEmployee}
                />
            )}
            
            <ChangePasswordModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSave={handleSavePassword}
                employeeId={selectedEmployeeId}
                />
        </div>
    );
};

export default EmployeeManagement;
