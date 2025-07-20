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
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [branchId, setBranchId] = useState(null);
  const [branchName, setBranchName] = useState("");

  // 🧩 toggle section states
  const [showMainMenu, setShowMainMenu] = useState(true); // เปิดไว้
  const [showSecondary, setShowSecondary] = useState(false);
  const [showLocker, setShowLocker] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
   

  const navigate = useNavigate();

useEffect(() => {
  const fetchSession = async () => {
    try {
      const user = await checkSession();
      if (!user) {
        navigate("/login");
        return;
      }

      setIsSuperAdmin(user.role === "superadmin");
      setUserName(user.email || "ไม่ทราบชื่อ");
      setRole(user.role === "superadmin" ? "SuperAdmin" : "Employee");

      if (user.role !== "superadmin") {
        setBranchId(user.branch_id);
      }
    } catch (err) {
      // ถ้าเชื่อมต่อ backend ไม่ได้
      navigate("/login");
    } finally {
      setIsCheckingSession(false); // ✅ ตรวจเสร็จแล้ว
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

  const renderToggle = (state, setState) => (
    <span onClick={() => setState(!state)} style={{ cursor: "pointer" }}>
      {state ? <FaChevronDown /> : <FaChevronRight />}
    </span>
  );

  const handleMenuClick = () => {
  if (window.innerWidth <= 768) {
    setIsOpen(false);
  }
};

   return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="sidebar">
        <div>
          {/* เมนูหลัก */}
          <h1
            className="sidebar-section-title"
            onClick={() => setShowMainMenu(!showMainMenu)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            {showMainMenu ? <FaChevronDown /> : <FaChevronRight />} เมนูหลัก
          </h1>
          {showMainMenu && (
              <ul>
                <li><Link to="/dashboard" onClick={handleMenuClick}><FaTachometerAlt className="sidebar-icon" />{isOpen && <span className="sidebar-text">หน้าหลัก</span>}</Link></li>
                <li><Link to="/queue" onClick={handleMenuClick}><FaListUl className="sidebar-icon" />{isOpen && <span className="sidebar-text">จัดการคิวงาน</span>}</Link></li>
                <li><Link to="/appointments" onClick={handleMenuClick}><FaCalendarAlt className="sidebar-icon" />{isOpen && <span className="sidebar-text">จัดการนัดหมาย</span>}</Link></li>
                <li><Link to="/customers" onClick={handleMenuClick}><FaUserFriends className="sidebar-icon" />{isOpen && <span className="sidebar-text">ลูกค้า</span>}</Link></li>
                <li><Link to="/services" onClick={handleMenuClick}><FaTools className="sidebar-icon" />{isOpen && <span className="sidebar-text">บริการ</span>}</Link></li>
                <li><Link to="/payouts" onClick={handleMenuClick}><FaMoneyBillWave className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายจ่าย</span>}</Link></li>
                <li><Link to="/reports" onClick={handleMenuClick}><FaChartBar className="sidebar-icon" />{isOpen && <span className="sidebar-text">รายงาน</span>}</Link></li>
              </ul>
          )}
          

          {/* Smart Locker */}
          <h2
            className="sidebar-section-title"
            onClick={() => setShowLocker(!showLocker)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            {showLocker ? <FaChevronDown /> : <FaChevronRight />} Smart Locker
          </h2>
          {showLocker && (
            <ul>
              <li>
                <Link to="/adminLocker/pending-pickup" onClick={handleMenuClick}>
                  <FaUsersCog className="sidebar-icon" />
                  {isOpen && <span className="sidebar-text">รายการรอรับจากตู้</span>}
                </Link>
              </li>
              <li>
                <Link to="/adminLocker/returntolocker" onClick={handleMenuClick}>
                  <FaUsersCog className="sidebar-icon" />
                  {isOpen && <span className="sidebar-text">ส่งคืน Locker</span>}
                </Link>
              </li>
              <li>
                <Link to="/adminLocker/lockers" onClick={handleMenuClick}>
                  <FaUsersCog className="sidebar-icon" />
                  {isOpen && <span className="sidebar-text">รายการ Locker</span>}
                </Link>
              </li>
            </ul>
          )}

          {/* สำหรับผู้ดูแล */}
          {isSuperAdmin && (
            <>
              <h2
                className="sidebar-section-title"
                onClick={() => setShowAdmin(!showAdmin)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {showAdmin ? <FaChevronDown /> : <FaChevronRight />} สำหรับผู้ดูแล
              </h2>
              {showAdmin && (
                <ul>
                    <li>
                      <Link to="/employee" onClick={handleMenuClick}>
                        <FaUsersCog className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">พนักงาน</span>}
                      </Link>
                    </li>
                    <li>
                      <Link to="/branch" onClick={handleMenuClick}>
                        <FaBuilding className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">สาขา</span>}
                      </Link>
                    </li>
                    <li>
                      <Link to="/users" onClick={handleMenuClick}>
                        <FaUserTie className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">ผู้ใช้งาน</span>}
                      </Link>
                    </li>
                    <li>
                      <Link to="/payments" onClick={handleMenuClick}>
                        <FaCreditCard className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">ชำระเงิน*</span>}
                      </Link>
                    </li>
                  </ul>

              )}
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
