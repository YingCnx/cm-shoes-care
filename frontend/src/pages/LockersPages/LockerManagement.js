// LockerManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from "../../services/authService";
import { getBranches, getLockers, deleteLocker ,updateLockerStatus} from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import './../QueueAdmin.css';
import AddLockerModal from '../../components/AddLockerModal';
import LockerSlotModal from '../../components/LockerSlotModal';


const LockerManagement = () => {
  const navigate = useNavigate();
  const [lockers, setLockers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [editLocker, setEditLocker] = useState(null);

    const [selectedLockerId, setSelectedLockerId] = useState(null);
    const [showSlotModal, setShowSlotModal] = useState(false);

    const openSlotModal = (lockerId) => {
    setSelectedLockerId(lockerId);
    setShowSlotModal(true);
    };


  useEffect(() => {
    const init = async () => {
      const user = await checkSession();
      if (!user) {
        setTimeout(() => navigate("/login"), 0);
        return;
      }
      const isSuper = user.role === "superadmin";
      setIsSuperAdmin(isSuper);
      setSelectedBranch(isSuper ? null : user.branch_id);

      if (isSuper) {
        fetchBranches();
      } else {
        fetchLockers(user.branch_id);
      }
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (selectedBranch !== null) {
      fetchLockers(selectedBranch);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (err) {
      console.error("🔴 Error fetching branches:", err);
    }
  };

  const fetchLockers = async (branchId) => {
    try {
      const res = await getLockers(branchId);
      setLockers(res.data);
    } catch (err) {
      console.error("🔴 Error fetching lockers:", err);
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบตู้?")) return;

  try {
    const res = await deleteLocker(id); // ✅ เรียก API ลบ

    // ✅ ถ้าลบสำเร็จ
    if (res.status === 200) {
      alert(res.data.message || "✅ ลบตู้เรียบร้อย");
      fetchLockers(selectedBranch); // รีโหลดรายการตู้
    }
  } catch (err) {
    // ✅ แสดงข้อความที่ส่งกลับมาจาก backend ถ้ามี
    const message = err.response?.data?.message || "❌ เกิดข้อผิดพลาดในการลบตู้";
    alert(message);
    console.error("🔴 Error deleting locker:", err);
  }
};


  const handleToggleOnline = async (lockerId, newStatus) => {
  try {
      const confirmMsg = newStatus
    ? "คุณต้องการเปิดสถานะออนไลน์ของตู้ใช่หรือไม่?"
    : "คุณต้องการปิดสถานะออนไลน์ของตู้ใช่หรือไม่?";

  const confirmChange = window.confirm(confirmMsg);
  if (!confirmChange) return;

    await updateLockerStatus(lockerId, { is_online: newStatus }); // เรียก API
    fetchLockers(selectedBranch); // รีโหลดตาราง
  } catch (err) {
    alert("❌ เปลี่ยนสถานะตู้ไม่สำเร็จ");
    console.error(err);
  }
};

  return (
    <div className="queue-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>รายการตู้ Locker</h1>
      </div>

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

      <div className="queue-card-wrapper">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn-split" onClick={() => {
                setEditLocker(null);
                setShowModal(true);
                }}>
                <span className="btn-text">เพิ่มตู้ใหม่</span>
                <span className="btn-icon"><FaPlus /></span>
                </button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>สาขา</th>
              <th>ที่อยู่</th>
              <th>จำนวนช่อง</th>
              <th>สถานะ</th>    
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {lockers.map((locker, index) => (
              <tr key={locker.id}>
                <td>{index + 1}</td>
                <td>{locker.code}</td>
                <td>{locker.name}</td>
                <td>{locker.branch_name || '-'}</td>
                <td>{locker.address}</td>
                <td>{locker.slot_count}</td>
                <td>
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={locker.is_online}
                      onChange={() => handleToggleOnline(locker.id, !locker.is_online)}
                    />
                    {locker.is_online ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>ออนไลน์</span>
                    ) : (
                      <span style={{ color: 'gray' }}>ออฟไลน์</span>
                    )}
                  </div>
                  <small>{locker.last_online_at ? new Date(locker.last_online_at).toLocaleString() : '-'}</small>
                </td>

                <td>
                    <button className="btn btn-sm btn-info" onClick={() => openSlotModal(locker.id)}>
                    ดูช่อง
                    </button>
                    <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                            setEditLocker(locker);
                            setShowModal(true);
                        }}
                        >
                        แก้ไข
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(locker.id)}>
                    ลบ
                    </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {showModal && (
    <AddLockerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => {
        fetchLockers(selectedBranch);
        setEditLocker(null);
        }}
        editData={editLocker}
    />
    )}

    <LockerSlotModal
        show={showSlotModal}
        lockerId={selectedLockerId}
        onClose={() => setShowSlotModal(false)}
        />

    </div>
  );
};

export default LockerManagement;
