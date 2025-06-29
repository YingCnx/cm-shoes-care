import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getBranches
} from '../services/api';
import AddAppointmentModal from "../components/AddAppointmentModal";
import './AppointmentsAdmin.css';
import '../assets/css/bootstrap.min.css';
import { checkSession } from '../services/authService';
import { FaPlus } from 'react-icons/fa';

const AppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(['รอดำเนินการ', 'ยืนยันแล้ว']);
  const [editAppointment, setEditAppointment] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = await checkSession();

      if (!user) {
        setTimeout(() => navigate('/login'), 0);
        return;
      }

      setSessionUser(user);
      const isAdmin = user.role === 'superadmin';
      setIsSuperAdmin(isAdmin);
      setSelectedBranch(isAdmin ? '' : user.branch_id);

      if (isAdmin) fetchBranches();
      else fetchAppointments(user.branch_id);
    };

    init();
  }, [navigate]);

  useEffect(() => {
    if (selectedBranch !== null && selectedBranch !== '') {
      fetchAppointments(selectedBranch);
    }
  }, [selectedBranch]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter]);

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (error) {
      console.error("🔴 Error fetching branches:", error);
    }
  };

  const fetchAppointments = async (branchId) => {
    try {
      const res = await getAppointments(branchId);
      setAppointments(res.data);
     // console.log("📌 Debug: ข้อมูลจาก API", res.data);
    } catch (error) {
      console.error("🔴 Error fetching appointments:", error);
    }
  };

  const filterAppointments = () => {
    const filtered = appointments
      .filter(item => statusFilter.includes(item.status))
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    setFilteredAppointments(filtered);
  };

  const handleCreateAppointment = async (newAppointment) => {
    try {
      const user = await checkSession();
      if (!user) {
        alert("กรุณาเข้าสู่ระบบใหม่");
        navigate("/login");
        return;
      }

      const formattedAppointment = {
        customer_id: newAppointment.customerId,
        customer_name: newAppointment.customerName.trim(),
        phone: newAppointment.phone.trim(),
        location: newAppointment.location.trim() || "Walk-in",
        shoe_count: parseInt(newAppointment.shoeCount, 10),
        appointment_date: newAppointment.appointmentDate,
        appointment_time: newAppointment.appointmentTime.trim(),
        branch_id: isSuperAdmin ? newAppointment.branch_id : user.branch_id,
        appointment_type: 'pickup',
      };

      await createAppointment(formattedAppointment);
      fetchAppointments(isSuperAdmin ? newAppointment.branch_id : user.branch_id);
      setShowAddModal(false);
    } catch (error) {
      console.error("🔴 Error creating appointment:", error);
      alert("❌ ไม่สามารถบันทึกนัดหมายได้");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`📌 คุณต้องการเปลี่ยนสถานะเป็น "${newStatus}" หรือไม่?`)) return;
    try {
      await updateAppointmentStatus(id, newStatus);
      fetchAppointments(selectedBranch);
      alert(`✅ อัปเดตเป็นสถานะ "${newStatus}" แล้ว!`);
    } catch (error) {
      console.error("🔴 Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนัดหมายนี้?")) {
      try {
        await deleteAppointment(id);
        fetchAppointments(selectedBranch);
      } catch (error) {
        console.error("🔴 Error deleting appointment:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
  <div className="appointments-container">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>📅 ระบบนัดหมาย</h1>
    </div>

    {isSuperAdmin && (
      <div className="mb-3">
        <label className="form-label fw-semibold">เลือกสาขา</label>
        <select
          className="form-control"
          value={selectedBranch || ''}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">-- เลือกสาขา --</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
      </div>
    )}

    <div className="queue-card-wrapper">
      {/* ✅ ปุ่มเพิ่มนัดหมาย */}
      <div className="d-flex justify-content-end">
        <button className="btn-split" onClick={() => setShowAddModal(true)}>
          <span className="btn-text">เพิ่มนัดหมาย</span>
          <span className="btn-icon"><FaPlus /></span>
        </button>
      </div>

      {/* ✅ ฟิลเตอร์สถานะ */}
      <div className="mb-4">
        <h5 className="mb-3">📌 กรองสถานะ</h5>
        <div className="filter-bar d-flex flex-wrap gap-3">
          {['รอดำเนินการ', 'ยืนยันแล้ว', 'สำเร็จ'].map(status => (
            <div key={status} className="form-check d-flex align-items-center gap-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={statusFilter.includes(status)}
                onChange={() =>
                  setStatusFilter(prev =>
                    prev.includes(status)
                      ? prev.filter(s => s !== status)
                      : [...prev, status]
                  )
                }
              />
              <label className="form-check-label">{status}</label>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ตารางแสดงนัดหมาย */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>เบอร์โทร</th>
            <th>สถานที่</th>
            <th>จำนวน</th>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>ประเภท</th>
            <th>สถานะ</th>
            <th colSpan={3} className="text-center">จัดการนัดหมาย</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appt, index) => (
            <tr key={appt.id}>
              <td>{index + 1}</td>
              <td>{appt.customer_name}</td>
              <td>{appt.phone}</td>
              <td  className='td-hide'>{appt.location}</td>
              <td>{appt.shoe_count}</td>
              <td>{formatDate(appt.appointment_date)}</td>
              <td>{appt.appointment_time.slice(0, 5)} น.</td>
              <td>{
              appt.type === 'pickup'
              ? <span className="badge-status" style={{ backgroundColor: 'rgba(150, 207, 207, 0.52)'  }}>นัดรับ</span>
              : <span className="badge-status" style={{ backgroundColor: 'rgba(240, 231, 183, 0.68)' }}>นัดส่ง</span>
              }</td>
              <td>
                <span className={`badge-status ${appt.status === 'สำเร็จ' ? 'paid' : appt.status === 'ยืนยันแล้ว' ? 'pending' : 'unpaid'}`}>
                  {appt.status}
                </span>
              </td>
              <td>
                {appt.status !== 'สำเร็จ' && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      handleStatusUpdate(appt.id, appt.status === 'รอดำเนินการ' ? 'ยืนยันแล้ว' : 'สำเร็จ')
                    }
                  >
                   ✔️ อัปเดต
                  </button>
                )}
              </td>
              <td>
                {appt.status !== 'สำเร็จ' && (
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      setEditAppointment(appt);
                      setShowAddModal(true);
                    }}
                  >
                    ✏️ เลื่อน
                  </button>
                )}
              </td>
              <td>
                {appt.status !== 'สำเร็จ' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate(appt.id, 'ยกเลิก')}
                  >
                    ❌ ยกเลิก
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal เพิ่มนัดหมาย */}
      {showAddModal && (
        <AddAppointmentModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddAppointment={handleCreateAppointment}
        />
      )}
    </div>
  </div>
);

};

export default AppointmentsAdmin;
