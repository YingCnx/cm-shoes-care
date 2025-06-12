import React, { useState, useEffect, useRef  } from 'react';
import { checkSession } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { getQueue, updateQueueStatus, deleteQueue, generateInvoice, getBranches } from '../services/api';
import { jwtDecode } from "jwt-decode";
import './QueueAdmin.css';
import InvoiceModal from '../components/InvoiceModal';
import { FaEye, FaPlus } from 'react-icons/fa';

const QueueAdmin = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [filteredQueue, setFilteredQueue] = useState([]);
    const [statusFilter, setStatusFilter] = useState(['รับเข้า', 'อยู่ระหว่างทำความสะอาด','เตรียมส่ง','กำลังจัดส่ง']);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const Backend_URL = 'http://localhost:5000';

    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfYear);
    const [endDate, setEndDate] = useState(lastDayOfMonth);

    const [invoiceUrl, setInvoiceUrl] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    const statusColors = {
        'รับเข้า': '#96CFCF',
        'อยู่ระหว่างทำความสะอาด': '#AFD7F6',
        'เตรียมส่ง': '#FBCCE0',
        'กำลังจัดส่ง': '#EFA375',
        'สำเร็จ': '#2EBDBD',
    };

    const statusPaymentColors = {
        'pending': '#F4656D',
        'ชำระเงินแล้ว': '#2EBDBD',
    };

    useEffect(() => {
        const init = async () => {
            const user = await checkSession();
            if (!user) {
                setTimeout(() => navigate("/login"), 0);
                return;
            }

            const isSuperAdmin = user.role === "superadmin";
            setIsSuperAdmin(isSuperAdmin);
            setSelectedBranch(isSuperAdmin ? null : user.branch_id);

            if (isSuperAdmin) {
                fetchBranches();
            } else {
                fetchQueue(user.branch_id);
            }
        };

        init();
    }, [navigate]);

    useEffect(() => {
        if (selectedBranch !== null) {
            fetchQueue(selectedBranch);
        }
    }, [selectedBranch, startDate, endDate]);

    useEffect(() => {
        filterQueueData();
    }, [queue, statusFilter, startDate, endDate, searchTerm]);

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
        const filtered = queue.filter(item => {
            const itemReceivedDate = new Date(item.received_date);
            const itemReceivedDateString = itemReceivedDate.toLocaleDateString('en-CA');

            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const startOfDayString = start.toLocaleDateString('en-CA');

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const endOfDayString = end.toLocaleDateString('en-CA');

            const isPending = item.payment_status === 'pending';
            const isInStatusFilter = statusFilter.includes(item.status);
            const isInDateRange = itemReceivedDateString >= startOfDayString && itemReceivedDateString <= endOfDayString;

            const isMatchedSearch = item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    item.location?.includes(searchTerm);

            return (isPending || (isInStatusFilter && isInDateRange)) && isMatchedSearch;
        }).sort((a, b) => {
            const deliveryA = new Date(a.delivery_date);
            const deliveryB = new Date(b.delivery_date);
            const receivedA = new Date(a.received_date);
            const receivedB = new Date(b.received_date);

            if (deliveryA - deliveryB !== 0) {
                return deliveryA - deliveryB;
            } else {
                return receivedA - receivedB;
            }
        });

        setFilteredQueue(filtered);
    };

    const handleBranchChange = (e) => {
        setSelectedBranch(e.target.value);
    };

    const handleGenerateInvoice = async (queue_id) => {
        try {
            const res = await generateInvoice(queue_id);
            setInvoiceUrl(res.data.image_base64);
            setShowInvoiceModal(true);
        } catch (error) {
            console.error("🔴 Error generating invoice:", error);
            alert("❌ ไม่สามารถสร้างใบแจ้งราคาได้");
        }
    };

    return (
        <div className="queue-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>ระบบจัดการคิวงาน</h1>
                </div>
            </div>

            {isSuperAdmin && (
                <div className="mb-3">
                    <label className="form-label">เลือกสาขา</label>
                    <select className="form-control" value={selectedBranch || ''} onChange={handleBranchChange}>
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="queue-card-wrapper">
                <div className="d-flex justify-content-end">
                    <button className="btn-split" onClick={() => navigate('/queue-entry')}>
                        <span className="btn-text">รับเข้าใหม่</span>
                        <span className="btn-icon"><FaPlus /></span>
                    </button>
                </div>

                <div className="filter-bar d-flex flex-wrap gap-2 align-items-center mb-2">
                    <label>📅 วันที่รับเข้า จาก:</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label>ถึง:</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="filter-bar d-flex flex-wrap align-items-center gap-3 mb-4">
                    <span className="fw-semibold">สถานะ:</span>
                    <div className="d-flex flex-wrap gap-3">
                        {[ 'รับเข้า', 'อยู่ระหว่างทำความสะอาด', 'เตรียมส่ง', 'กำลังจัดส่ง', 'จัดส่งสำเร็จ' ].map((status) => (
                            <div key={status} className="form-check d-flex align-items-center gap-1">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={statusFilter.includes(status)}
                                    onChange={() =>
                                        setStatusFilter((prev) =>
                                            prev.includes(status)
                                                ? prev.filter((s) => s !== status)
                                                : [...prev, status]
                                        )
                                    }
                                />
                                <label className="form-check-label">{status}</label>
                            </div>
                        ))}
                    </div>
                    <div className="ms-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 ค้นหาชื่อลูกค้า ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ช่องทาง</th>
                            <th>ชื่อ</th>
                            <th>สถานที่</th>
                            <th>จำนวนคู่</th>
                            <th>จำนวนเงิน</th>
                            <th>วันที่รับเข้า</th>
                            <th>วันที่ส่งคืน</th>
                            <th>สถานะ</th>
                            <th>สถานะชำระเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQueue.map((item, index) => (
                            <tr key={item.queue_id} onClick={() => navigate(`/queue/${item.queue_id}/detail`)}>
                                <td>{index + 1}</td>
                                <td className="text-start"><small className="text-muted">{item.source}</small></td>
                                <td>{item.customer_name}</td>
                                <td>{item.location}</td>
                                <td>{item.total_pairs}</td>
                                <td>{item.total_price}</td>
                                <td>{new Date(item.received_date).toLocaleDateString()}</td>
                                <td>
                                    {(() => {
                                        const deliveryDate = new Date(item.delivery_date);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const tomorrow = new Date(today);
                                        tomorrow.setDate(today.getDate() + 1);

                                        if (deliveryDate <= today) {
                                            return <span style={{ color: 'red', fontWeight: 'bold' }}>{deliveryDate.toLocaleDateString()}</span>;
                                        } else if (
                                            deliveryDate.getFullYear() === tomorrow.getFullYear() &&
                                            deliveryDate.getMonth() === tomorrow.getMonth() &&
                                            deliveryDate.getDate() === tomorrow.getDate()
                                        ) {
                                            return <span style={{ color: 'orange', fontWeight: 'bold' }}>{deliveryDate.toLocaleDateString()}</span>;
                                        } else {
                                            return deliveryDate.toLocaleDateString();
                                        }
                                    })()}
                                </td>
                                <td><span className="badge-status" style={{ backgroundColor: statusColors[item.status] || '#ddd' }}>{item.status}</span></td>
                                <td><span className="badge-status" style={{ backgroundColor: statusPaymentColors[item.payment_status] || '#ddd' }}>{item.payment_status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InvoiceModal
                show={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                imageBase64={invoiceUrl}
            />
        </div>
    );
};

export default QueueAdmin;
