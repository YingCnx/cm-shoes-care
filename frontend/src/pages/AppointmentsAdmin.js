import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment, getBranches } from '../services/api';
import { jwtDecode } from 'jwt-decode'; // ✅ ใช้ jwtDecode แทน atob
import AddAppointmentModal from "../components/AddAppointmentModal";
import './AppointmentsAdmin.css';
import '../assets/css/bootstrap.min.css';

const AppointmentsAdmin = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState(['รอดำเนินการ', 'ยืนยันแล้ว']);
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const user = jwtDecode(token);
            setIsSuperAdmin(user.isSuperAdmin);
            setSelectedBranch(user.isSuperAdmin ? null : user.branch_id);

            if (user.isSuperAdmin) {
                fetchBranches();
            } else {
                fetchAppointments(user.branch_id);
            }

        } catch (error) {
            console.error("🔴 Error decoding token:", error);
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (selectedBranch !== null) {
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
        } catch (error) {
            console.error("🔴 Error fetching appointments:", error);
        }
    };

    const filterAppointments = () => {
        const filtered = appointments.filter(item => 
            statusFilter.includes(item.status)
        ).sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

        setFilteredAppointments(filtered);
    };

    const handleCreateAppointment = async (newAppointment) => {
        try {
            const token = localStorage.getItem("token");
            const user = jwtDecode(token);

            const formattedAppointment = {
                customer_name: newAppointment.customerName.trim(),
                phone: newAppointment.phone.trim(),
                location: newAppointment.location.trim() || "Walk-in",
                shoe_count: parseInt(newAppointment.shoeCount, 10),
                appointment_date: newAppointment.appointmentDate,
                appointment_time: newAppointment.appointmentTime.trim(),
                branch_id: isSuperAdmin ? newAppointment.branch_id : user.branch_id,
            };

            await createAppointment(formattedAppointment);
            fetchAppointments(selectedBranch);
            setShowAddModal(false);
        } catch (error) {
            console.error("🔴 Error creating appointment:", error);
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
            <h2>📅 ระบบนัดหมาย</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    ⬅️ กลับไปหน้า Dashboard
                </button>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    ➕ เพิ่มนัดหมาย
                </button>
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

            {/* ✅ ฟิลเตอร์สถานะ */}
            <div className="card p-3 mb-3 shadow text-start">
                <h5>📌 กรองสถานะ</h5>
                {['รอดำเนินการ', 'ยืนยันแล้ว', 'สำเร็จ'].map(status => (
                    <div key={status} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={statusFilter.includes(status)}
                            onChange={() => setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                        />
                        <label className="form-check-label">{status}</label>
                    </div>
                ))}
            </div>

            {/* ✅ ตารางแสดงข้อมูล */}
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อ</th>
                        <th>เบอร์โทร</th>
                        <th>สถานที่</th>
                        <th>จำนวนรองเท้า</th>
                        <th>วันที่</th>
                        <th>เวลา</th>
                        <th>สถานะ</th>
                        <th>อัปเดตสถานะ</th>
                        <th>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointments.map(appt => (
                        <tr key={appt.id}>
                            <td>{appt.customer_name}</td>
                            <td>{appt.phone}</td>
                            <td>{appt.location}</td>
                            <td>{appt.shoe_count}</td>
                            <td>{formatDate(appt.appointment_date)}</td>
                            <td>{appt.appointment_time.slice(0, 5)} น.</td>
                            <td>{appt.status}</td>
                            <td>
                                {appt.status !== 'สำเร็จ' && (
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleStatusUpdate(appt.id, appt.status === 'รอดำเนินการ' ? 'ยืนยันแล้ว' : 'สำเร็จ')}
                                    >
                                       อัปเดต
                                    </button>
                                )}
                            </td>
                            <td>
                                {appt.status !== 'สำเร็จ' && (
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(appt.id)}>
                                        ❌ ลบ
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && (
                    <AddAppointmentModal
                        show={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onAddAppointment={handleCreateAppointment}
                    />
                )}
        </div>
    );
};

export default AppointmentsAdmin;
