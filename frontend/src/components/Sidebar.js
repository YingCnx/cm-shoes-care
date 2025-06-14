import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBranchesById } from "../services/api";
import { logout, checkSession } from "../services/authService";
import {
  FaTachometerAlt,
  FaListUl,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTools,
  FaUserFriends,
  FaChartBar,
  FaUsersCog,
  FaBuilding,
  FaUserTie,
  FaCreditCard,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [branchId, setBranchId] = useState(null);
  const [branchName, setBranchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const user = await checkSession();
      if (!user) {
        setTimeout(() => navigate("/login"), 0);
        return;
      }

      setIsSuperAdmin(user.role === "superadmin");
      setUserName(user.email || "ไม่ทราบชื่อ");
      setRole(user.role === "superadmin" ? "SuperAdmin" : "Employee");

      if (user.role !== "superadmin") {
        setBranchId(user.branch_id);
      }
    };
    fetchSession();
  }, [navigate]);

  useEffect(() => {
    if (branchId) {
      fetchBranchName(branchId);
    }
  }, [branchId]);

  const fetchBranchName = async (branchId) => {
    try {
      const res = await getBranchesById(branchId);
      setBranchName(res.data.name || "ไม่พบข้อมูล");
    } catch (error) {
      setBranchName("ไม่พบข้อมูล");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Logout ไม่สำเร็จ");
    }
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="sidebar">
        <div>
          <h2 className="sidebar-section-title">เมนูหลัก</h2>
          <ul>
            <li><Link to="/dashboard"><FaTachometerAlt className="sidebar-icon" />{isOpen && <span className="sidebar-text">หน้าหลัก</span>}</Link></li>
            <li><Link to="/queue"><FaListUl className="sidebar-icon" />{isOpen && <span className="sidebar-text">จัดการคิวงาน</span>}</Link></li>
            <li><Link to="/appointments"><FaCalendarAlt className="sidebar-icon" />{isOpen && <span className="sidebar-text">จัดการนัดหมาย</span>}</Link></li>
            <li><Link to="/customers"><FaUserFriends className="sidebar-icon" />{isOpen && <span className="sidebar-text">ลูกค้า</span>}</Link></li>
          </ul>
          <br />

          <h2 className="sidebar-section-title">งานรอง</h2>
          <ul>
            <li><Link to="/services"><FaTools className="sidebar-icon" />{isOpen && <span className="sidebar-text">บริการ</span>}</Link></li>
            <li><Link to="/payouts"><FaMoneyBillWave className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายจ่าย</span>}</Link></li>
            <li><Link to="/reports"><FaChartBar className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายงาน</span>}</Link></li>
          </ul>
          <br />

          <h2 className="sidebar-section-title">Smart Locker</h2>
          <ul>
            <li><Link to="/adminLocker/pending-pickup"><FaUsersCog className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายการรอรับจากตู้</span>}</Link></li>
            <li><Link to="/adminLocker/receive"><FaUsersCog className="sidebar-icon" />{isOpen && <span className="sidebar-text">รับเข้าจาก Locker</span>}</Link></li>
            <li><Link to="/adminLocker/returntolocker"><FaUsersCog className="sidebar-icon" />{isOpen && <span className="sidebar-text">ส่งคืน Locker</span>}</Link></li>
            <li><Link to="/adminLocker/lockers"><FaUsersCog className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายการ Locker</span>}</Link></li>
          </ul>

          {isSuperAdmin && (
            <>
              <h2 className="sidebar-section-title">สำหรับผู้ดูแล</h2>
              <ul>
                <li><Link to="/employee"><FaUsersCog className="sidebar-icon" />{isOpen && <span className="sidebar-text">พนักงาน</span>}</Link></li>
                <li><Link to="/branch"><FaBuilding className="sidebar-icon" />{isOpen && <span className="sidebar-text">สาขา</span>}</Link></li>
                <li><Link to="/users"><FaUserTie className="sidebar-icon" />{isOpen && <span className="sidebar-text">ผู้ใช้งาน</span>}</Link></li>
                <li><Link to="/payments"><FaCreditCard className="sidebar-icon" />{isOpen && <span className="sidebar-text">ชำระเงิน*</span>}</Link></li>
              </ul>
            </>
          )}
        </div>

        {isOpen && (
          <div className="user-info">
            <h6>User: {userName}</h6>
            <p>ตำแหน่ง: <strong>{role}</strong></p>
            {!isSuperAdmin && <p>สาขา: <strong>{branchName}</strong></p>}
            <button className="logout-button" onClick={handleLogout}>
              🚪 ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
