import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ jwtDecode ตรวจสอบสิทธิ์
import { getBranchesById } from "../services/api"; // ✅ Import API
import "./Sidebar.css"; // ✅ ใช้ CSS สำหรับแสดง/ซ่อนเมนู

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [branchId, setBranchId] = useState(null);
    const [branchName, setBranchName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const user = jwtDecode(token);
                setIsSuperAdmin(user.isSuperAdmin);
                setUserName(user.email || "ไม่ทราบชื่อ");
                setRole(user.isSuperAdmin ? "SuperAdmin" : "Employee");

                if (!user.isSuperAdmin) {
                    setBranchId(user.branch_id); // ✅ กำหนด branchId ถ้าเป็น Employee
                }
            } catch (error) {
                console.error("🔴 Error decoding token:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (branchId) {
            fetchBranchName(branchId);
        }
    }, [branchId]); // ✅ ใช้ useEffect ให้ดึง branchName เมื่อ branchId มีค่า

    const fetchBranchName = async (branchId) => {
        try {
            const res = await getBranchesById(branchId);
            setBranchName(res.data.name || "ไม่พบข้อมูล");
        } catch (error) {
            console.error("🔴 Error fetching branch name:", error);
            setBranchName("ไม่พบข้อมูล");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
            {/* ปุ่ม Toggle เมนู */}
            <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "❌ ปิด" : "☰ เมนู"}
            </button>
            <br />

            {/* ✅ เมนูด้านข้าง */}
            <div className="sidebar">
                

                <h2>🔹 เมนูหลัก</h2>
                <ul>
                    <li><Link to="/Dashboard">🏠 หน้าหลัก</Link></li>
                    <li><Link to="/queue">📋 จัดการคิวงาน</Link></li>
                    <li><Link to="/appointments">📅 จัดการนัดหมาย</Link></li>
                    <li><Link to="/payouts">💸 บันทึกรายจ่าย</Link></li>
                    <li><Link to="/services">🛠 บริการ</Link></li>
                    <li><Link to="/employee">👥 จัดการพนักงาน</Link></li>
                    <li><Link to="/reports">📊 รายงาน</Link></li>

                    {/* ✅ เมนูพิเศษสำหรับ SuperAdmin เท่านั้น */}
                    {isSuperAdmin && (
                        <>
                            
                            <li><Link to="/branch">🏢 จัดการสาขา</Link></li>
                            <li><Link to="/users">🧑‍💼 ผู้ใช้งาน</Link></li>
                            <li><Link to="/payments">💳 ชำระเงิน*ยังใช้ไม่ได้</Link></li>
                        </>
                    )}
                </ul>
           
                {/* ✅ แสดงข้อมูลผู้ใช้ */}
                <div className="user-info">
                    <h6>👤 {userName}</h6>
                    <p>📌 ตำแหน่ง: <strong>{role}</strong></p>
                    {!isSuperAdmin && <p>🏢 สาขา: <strong>{branchName}</strong></p>}
                </div>
                

                {/* ✅ ปุ่มออกจากระบบ */}
                <button className="logout-button" onClick={handleLogout}>
                    🚪 ออกจากระบบ
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
