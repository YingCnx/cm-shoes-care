import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../../services/authService';
import {
    getPendingLockerDrops,
    updateLockerDropStatus,
    updateLockerDropWithImage,
    getBranches
} from '../../services/api';

const PendingPickupFromLocker = () => {
    const navigate = useNavigate();
    const [lockerDrops, setLockerDrops] = useState([]);
    const [filteredDrops, setFilteredDrops] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [proofImage, setProofImage] = useState(null);

    useEffect(() => {
        const init = async () => {
            const user = await checkSession();
            if (!user) return navigate("/login");

            const superAdmin = user.role === "superadmin";
            setIsSuperAdmin(superAdmin);
            setSelectedBranch(superAdmin ? null : user.branch_id);

            if (superAdmin) fetchBranches();
            else fetchLockerDrops(user.branch_id);
        };
        init();
    }, [navigate]);

    useEffect(() => {
        if (selectedBranch !== null) fetchLockerDrops(selectedBranch);
    }, [selectedBranch]);

    useEffect(() => {
        const filtered = lockerDrops.filter(drop =>
            drop.phone?.includes(searchTerm) ||
            drop.locker_name?.includes(searchTerm)
        );
        setFilteredDrops(filtered);
    }, [lockerDrops, searchTerm]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (err) {
            console.error("Error fetching branches", err);
        }
    };

    const fetchLockerDrops = async (branchId) => {
        try {
            const res = await getPendingLockerDrops(branchId);
            setLockerDrops(res.data);
        } catch (err) {
            console.error("Error fetching locker drops", err);
        }
    };

    const openModal = (drop) => {
        setSelectedDrop(drop);
        setProofImage(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDrop(null);
        setProofImage(null);
    };

    const handlePickupConfirm = async () => {
    if (!proofImage) {
        alert("กรุณาอัปโหลดภาพเพื่อยืนยันการรับ");
        return;
    }

   const confirm = window.confirm("ยืนยันการรับรองเท้าจากตู้หรือไม่?");
    if (!confirm) return; // ⛔ ยกเลิก
    
    try {
        await updateLockerDropWithImage(selectedDrop.id, proofImage);
        alert("✅ รับรองเท้าสำเร็จ"); // ✅ แจ้งเตือนสำเร็จ
        fetchLockerDrops(selectedBranch);
        closeModal();
    } catch (err) {
        console.error("Error confirming pickup", err);
        alert("ไม่สามารถอัปเดตสถานะได้");
    }
    }

    return (
        <div className="queue-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>รายการรอรับรองเท้าจากตู้</h1>
            </div>

            {isSuperAdmin && (
                <div className="mb-3">
                    <label className="form-label">เลือกสาขา</label>
                    <select
                        className="form-control"
                        value={selectedBranch || ''}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="filter-bar d-flex align-items-center gap-3 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 ค้นหาเบอร์โทรหรือตู้"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>เบอร์โทร</th>
                        <th>จำนวนคู่</th>
                        <th>ตู้</th>
                        <th>ช่อง</th>
                        <th>เวลาฝาก</th>
                        <th>สถานะ</th>
                        <th>ดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDrops.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                ไม่มีรายการรอรับในขณะนี้
                            </td>
                        </tr>
                    ) : (
                        filteredDrops.map((drop, index) => (
                            <tr key={drop.id}>
                                <td>{index + 1}</td>
                                <td>{drop.phone}</td>
                                <td>{drop.total_pairs}</td>
                                <td>{drop.locker_name}</td>
                                <td>{drop.slot_number}</td>
                                <td>{new Date(drop.created_at).toLocaleString()}</td>
                                <td>
                                    <span className="badge-status" style={{ backgroundColor: '#F6C23E' }}>
                                        รอรับ
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => openModal(drop)}
                                    >
                                        รับ
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* 📸 Modal ถ่ายรูป */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">ยืนยันการรับรองเท้าจากตู้</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>เบอร์โทร:</strong> {selectedDrop?.phone}</p>
                                <p><strong>ตู้:</strong> {selectedDrop?.locker_name} ช่อง {selectedDrop?.slot_number}</p>

                                <label className="form-label">📷 ถ่ายรูปหรืออัปโหลดรูปขณะรับของ</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="form-control"
                                    onChange={(e) => setProofImage(e.target.files[0])}
                                />
                                {proofImage && (
                                    <img
                                        src={URL.createObjectURL(proofImage)}
                                        alt="preview"
                                        className="mt-3 img-thumbnail"
                                        style={{ maxHeight: '200px' }}
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    ยกเลิก
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handlePickupConfirm}>
                                    ยืนยันการรับ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingPickupFromLocker;
