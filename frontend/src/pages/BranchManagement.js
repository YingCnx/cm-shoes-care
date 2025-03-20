import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBranches, createBranch, updateBranch, deleteBranch } from "../services/api";
import { jwtDecode } from "jwt-decode";  // ✅ ใช้ jwtDecode ตรวจสอบสิทธิ์
import AddBranchModal from "../components/AddBranchModal";
import "./BranchManagement.css";
import "../assets/css/bootstrap.min.css";

const BranchManagement = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editBranch, setEditBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // ✅ หากไม่มี token ให้ไปหน้า Login
            return;
        }

        try {
            const user = jwtDecode(token);
            setIsSuperAdmin(user.isSuperAdmin); // ✅ ตรวจสอบว่าเป็น SuperAdmin หรือไม่

            if (user.isSuperAdmin) {
                fetchBranches(); // ✅ โหลดข้อมูลเฉพาะเมื่อเป็น SuperAdmin
            } else {
                navigate("/dashboard"); // ✅ ถ้าไม่ใช่ SuperAdmin ให้กลับไปหน้า Dashboard
            }
        } catch (error) {
            console.error("🔴 Error decoding token:", error);
            navigate("/login"); // ✅ หาก decode token ไม่ได้ให้กลับไปหน้า Login
        }
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            console.log("📌 Debug: Branches Data", res.data);
            setBranches(res.data || []);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const handleCreateOrUpdateBranch = async (branchData) => {
        try {
            if (branchData.id) {
                await updateBranch(branchData.id, branchData);
            } else {
                await createBranch(branchData);
            }
            fetchBranches();
            setShowAddModal(false);
            setEditBranch(null);
        } catch (error) {
            console.error("🔴 Error saving branch:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสาขานี้?")) return;
    
        try {
            await deleteBranch(id);
            fetchBranches();
            alert("✅ ลบสาขาสำเร็จ!");
        } catch (error) {
            console.error("🔴 Error deleting branch:", error.response?.data || error.message);
            alert(`❌ ${error.response?.data?.message || "เกิดข้อผิดพลาด ไม่สามารถลบสาขาได้"}`);
        }
    };

    if (!isSuperAdmin) {
        return null; // ✅ ซ่อน UI ถ้าไม่ใช่ SuperAdmin
    }

    return (
        <div className="branch-container">
            <h2>🏢 ระบบจัดการสาขา</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                    ⬅️ กลับไปหน้า Dashboard
                </button>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    ➕ เพิ่มสาขา
                </button>
            </div>

            {/* ตารางสาขา */}
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อสาขา</th>
                        <th>ที่อยู่</th>
                        <th>เบอร์ติดต่อ</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map(branch => (
                        <tr key={branch.id}>
                            <td>{branch.name}</td>
                            <td>{branch.location}</td>
                            <td>{branch.phone}</td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => { setEditBranch(branch); setShowAddModal(true); }}>✏️ แก้ไข</button>
                                <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(branch.id)}>❌ ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* แสดง Modal เมื่อกดปุ่ม "เพิ่มสาขา" หรือ "แก้ไขสาขา" */}
            {showAddModal && (
                <AddBranchModal
                    show={showAddModal}
                    onClose={() => { setShowAddModal(false); setEditBranch(null); }}
                    onSave={handleCreateOrUpdateBranch}
                    branchData={editBranch}
                />
            )}
        </div>
    );
};

export default BranchManagement;
