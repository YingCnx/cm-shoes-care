import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../../services/authService';
import { getPendingLockerDrops, updateLockerDropStatus, getBranches } from '../../services/api';



const PendingPickupFromLocker = () => {
    const navigate = useNavigate();
    const [lockerDrops, setLockerDrops] = useState([]);
    const [filteredDrops, setFilteredDrops] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handlePickupConfirm = async (dropId) => {
        try {
            await updateLockerDropStatus(dropId, 'received');
            fetchLockerDrops(selectedBranch);
        } catch (err) {
            console.error("Error updating locker drop status", err);
        }
    };

    return (
        <div className="queue-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>รายการรอรับรองเท้าจากตู้</h1>
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
                        <th>ตู้</th>
                        <th>ช่อง</th>
                        <th>เวลาฝาก</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDrops.map((drop, index) => (
                        <tr key={drop.id}>
                            <td>{index + 1}</td>
                            <td>{drop.phone}</td>
                            <td>{drop.locker_name}</td>
                            <td>{drop.slot_number}</td>
                            <td>{new Date(drop.created_at).toLocaleString()}</td>
                            <td><span className="badge-status" style={{ backgroundColor: '#F6C23E' }}>รอรับ</span></td>
                            <td>
                                <button className="btn btn-success btn-sm" onClick={() => handlePickupConfirm(drop.id)}>รับแล้ว</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PendingPickupFromLocker;
