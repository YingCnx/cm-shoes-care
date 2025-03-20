import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueue, updateQueueStatus, deleteQueue, generateInvoice, getBranches } from '../services/api';
import { jwtDecode } from "jwt-decode";
import './QueueAdmin.css';

const QueueAdmin = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [filteredQueue, setFilteredQueue] = useState([]);
    const [statusFilter, setStatusFilter] = useState(['รับเข้า', 'อยู่ระหว่างทำความสะอาด','เตรียมส่ง','กำลังจัดส่ง','จัดส่งสำเร็จ']);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const Backend_URL = 'http://localhost:5000'; // ดึง URL Backend

    // ✅ ค่าเริ่มต้นของช่วงวันที่ (เริ่มที่ปีนี้)
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfYear);
    const [endDate, setEndDate] = useState(lastDayOfMonth);

    const [invoiceUrl, setInvoiceUrl] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    

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
                fetchQueue(user.branch_id);
            }
        } catch (error) {
            console.error("🔴 Error decoding token:", error);
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (selectedBranch !== null) {
            fetchQueue(selectedBranch);
        }
    }, [selectedBranch, startDate, endDate]);

    useEffect(() => {
        filterQueueData();
    }, [queue, statusFilter, startDate, endDate]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const fetchQueue = async (branchId) => {
        try {
            const res = await getQueue(branchId);
            setQueue(res.data);
        } catch (error) {
            console.error("🔴 Error fetching queue:", error);
        }
    };

    const filterQueueData = () => {
        const filtered = queue.filter(item =>
            statusFilter.includes(item.status) &&
            new Date(item.received_date) >= new Date(startDate) &&
            new Date(item.received_date) <= new Date(endDate)
        ).sort((a, b) => new Date(a.received_date) - new Date(b.received_date));

        setFilteredQueue(filtered);
    };

    const handleBranchChange = (e) => {
        setSelectedBranch(e.target.value);
    };

    // ✅ ฟังก์ชันแจ้งราคา
    const handleGenerateInvoice = async (queue_id) => {
        try {
            const res = await generateInvoice(queue_id);
            setInvoiceUrl(res.data.image_url); // ✅ อัปเดต URL ของใบแจ้งราคา
            console.log("URL",res.data.image_url);
            setShowInvoiceModal(true); // ✅ เปิด Modal
        } catch (error) {
            console.error("🔴 Error generating invoice:", error);
            alert("❌ ไม่สามารถสร้างใบแจ้งราคาได้");
        }
    };

    return (
        <div className="queue-container">
            <h2>📋 ระบบคิวงาน</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={() => navigate('/dashboard')}>⬅️ กลับไปหน้า Dashboard</button>
                <button onClick={() => navigate('/queue-entry')}>🆕 รับเข้าใหม่</button>
            </div>

            {/* ✅ แสดง dropdown สำหรับ SuperAdmin */}
            {isSuperAdmin && (
                <div className="mb-3 ">
                    <label className="form-label">เลือกสาขา</label>
                    <select className="form-control" value={selectedBranch || ''} onChange={handleBranchChange}>
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* ✅ ฟิลเตอร์ช่วงวันที่ */}
            <div className="date-filters d-flex align-items-center gap-2 mb-3">
                <label>📅วันที่รับเข้า จาก:</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>ถึง:</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {/* ✅ ฟิลเตอร์สถานะ */}
            <div className="filters d-flex flex-wrap gap-2 justify-content-start">
            สถานะ :
                {['รับเข้า', 'อยู่ระหว่างทำความสะอาด', 'เตรียมส่ง', 'กำลังจัดส่ง', 'จัดส่งสำเร็จ'].map(status => (
                    <div key={status} className="form-check d-flex align-items-center gap-1">
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

            {/* ✅ ตารางข้อมูลคิว */}
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อ</th>
                        <th>สถานที่</th>
                        <th>จำนวนคู่</th>
                        <th>จำนวนเงิน</th>
                        <th>วันที่รับเข้า</th>
                        <th>วันที่ส่งคืน</th>
                        <th>สถานะ</th>
                        <th>สถานะชำระเงิน</th>
                        <th>รายละเอียด</th>
                        <th>ใบแจ้งราคา</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQueue.map(item => (
                        <tr key={item.queue_id}>
                            <td>{item.customer_name}</td>
                            <td>{item.location}</td>
                            <td>{item.total_pairs}</td>
                            <td>{item.total_price}</td>
                            <td>{new Date(item.received_date).toLocaleDateString()}</td>
                            <td>{new Date(item.delivery_date).toLocaleDateString()}</td>
                            <td>{item.status}</td>
                            <td>{item.payment_status}</td>
                            <td><button className="btn btn-info btn-sm" onClick={() => navigate(`/queue/${item.queue_id}/detail`)}>รายละเอียด</button></td>
                            <td><button className="btn btn-success btn-sm" onClick={() => handleGenerateInvoice(item.queue_id)}>ใบแจ้งราคา</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {/* ✅ Modal แสดงใบแจ้งราคา */}
             {showInvoiceModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>📜 ใบแจ้งราคา</h2>
                        {invoiceUrl ? (
                            <img src={invoiceUrl} alt="Invoice" style={{ width: "100%", borderRadius: "10px" }} />
                        ) : (
                            <p>⏳ กำลังโหลดใบแจ้งราคา...</p>
                        )}
                        <button onClick={() => setShowInvoiceModal(false)}>❌ ปิด</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueAdmin;
