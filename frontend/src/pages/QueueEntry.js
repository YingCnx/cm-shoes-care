import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, createQueue, updateAppointmentQueueId, getBranches } from '../services/api';
import '../assets/css/bootstrap.min.css';
import './QueueEntry.css';

const QueueEntry = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(atob(token.split(".")[1])); // ✅ Decode JWT
    const isAdmin = user.isSuperAdmin;
    
    const [appointments, setAppointments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Walk-in');
    const [totalPairs, setTotalPairs] = useState(1);
    const [deliveryDate, setDeliveryDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 3);
        return tomorrow.toISOString().split('T')[0];
    });
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(() => isAdmin ? "" : user.branch_id);

    useEffect(() => {
        if (isAdmin) {
            fetchBranches();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (selectedBranch) {
            fetchAppointments(selectedBranch);
        }
        else{
            fetchAppointments();
        }
    }, [selectedBranch]);

    const fetchAppointments = async (branchId) => {
        try {
            const res = await getAppointments();
            
            let filteredAppointments = res.data.filter(appt => 
                appt.status === 'สำเร็จ' && (!appt.queue_id || appt.queue_id === null)
            );

            // ✅ กรองตาม branch_id ที่เลือก
            filteredAppointments = filteredAppointments.filter(appt => appt.branch_id === branchId);

            setAppointments(filteredAppointments);
        } catch (error) {
            console.error("🔴 Error fetching appointments:", error);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            //console.log("📌 Debug: Branches Data", res.data);
            
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
            alert("❌ ไม่สามารถโหลดข้อมูลสาขาได้");
        }
    };

    const handleCreateQueue = async () => {
        if (!customerName || !phone || !totalPairs || !deliveryDate || (!selectedBranch && isAdmin)) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการบันทึกคิวนี้?")) return;
    
        try {
            const newQueue = {
                customer_name: customerName,
                phone,
                location,
                total_pairs: totalPairs,
                delivery_date: deliveryDate,
                branch_id: isAdmin ? selectedBranch : user.branch_id,
            };
    
           // console.log("📌 Debug: Queue Data", newQueue);
            
            // ✅ ส่งคำขอสร้างคิว แล้วรับค่า `queue_id` กลับมา
            const response = await createQueue(newQueue);

            const queue_id = response.queue_id; // ✅ รับ `queue_id` จาก API
    
            //console.log("📌 Debug: คิวถูกสร้างแล้ว queue_id:", queue_id);
    
            // ✅ ถ้ามาจาก `appointment` → อัปเดต `appointments.queue_id`
            if (selectedAppointmentId) {
                //console.log(`📌 Debug: อัปเดต appointment ${selectedAppointmentId} ด้วย queue_id: ${queue_id}`);
                await updateAppointmentQueueId(selectedAppointmentId, queue_id);
            }
    
            alert("✅ เพิ่มคิวงานเรียบร้อยแล้ว!");
            navigate('/queue');
        } catch (error) {
            console.error("🔴 Error creating queue:", error);
            alert("❌ มีข้อผิดพลาดในการบันทึกคิว");
        }
    };
    

    const handleSelectAppointment = (appointment) => {
        setCustomerName(appointment.customer_name);
        setPhone(appointment.phone);
        setLocation(appointment.location || "Walk-in");
        setTotalPairs(appointment.shoe_count);
        setSelectedAppointmentId(appointment.id);
    };

    const handleClearForm = () => {
        setCustomerName('');
        setPhone('');
        setLocation('Walk-in');
        setTotalPairs(1);
        setDeliveryDate(() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        });
        setSelectedAppointmentId(null);
    };


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/queue')}>
                    ⬅️ กลับไปหน้าคิว
                </button>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h2 className="mb-3">📅 เลือกจากนัดหมาย</h2>
                    {isAdmin && (
                        <div className="mb-3">
                            <label className="form-label">เลือกสาขา</label>
                            <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(Number(e.target.value))}>
                                <option value="">-- กรุณาเลือกสาขา --</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ชื่อ</th>
                                <th>เบอร์โทร</th>
                                <th>จำนวนคู่</th>
                                <th>เลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appt => (
                                <tr key={appt.id}>
                                    <td>{appt.customer_name}</td>
                                    <td>{appt.phone}</td>
                                    <td>{appt.shoe_count}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleSelectAppointment(appt)}>
                                            เลือก
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>               

                <div className="col-md-6">
                    <h2 className="mb-3">🆕 เพิ่มคิวใหม่ (Walk-in)</h2>
                    <div className="card p-3 shadow">
                        

                        <div className="mb-2">
                            <label className="form-label">ชื่อ</label>
                            <input type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">เบอร์โทร</label>
                            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">สถานที่</label>
                            <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">จำนวนคู่รองเท้า</label>
                            <input type="number" className="form-control" value={totalPairs} onChange={(e) => setTotalPairs(Number(e.target.value))} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">กำหนดส่งคืน</label>
                            <input type="date" className="form-control" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-success w-50" onClick={handleCreateQueue}>
                                ✅ บันทึกคิว
                            </button>
                            <button className="btn btn-danger w-50" onClick={handleClearForm}>
                                ❌ ล้างฟอร์ม
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueueEntry;
