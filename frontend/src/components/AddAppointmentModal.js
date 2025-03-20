import { useEffect, useState } from "react";
import { getBranches } from "../services/api"; // ✅ Import API
import "../assets/css/bootstrap.min.css";
import "./AddAppointmentModal.css";


const AddAppointmentModal = ({ show, onClose, onAddAppointment }) => {
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [shoeCount, setShoeCount] = useState(1);
    const [appointmentDate, setAppointmentDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow.toISOString().split('T')[0];
    });
    const [appointmentTime, setAppointmentTime] = useState('10:00');

    const token = localStorage.getItem("token");
    const user = JSON.parse(atob(token.split(".")[1])); // ✅ Decode JWT
    const isAdmin = user.isSuperAdmin;

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(() => isAdmin ? "" : user.branch_id);

    useEffect(() => {
        if (isAdmin) {
            const fetchBranches = async () => {
                try {
                    const res = await getBranches();
                    console.log("📌 Debug: Branches Data", res.data); // ✅ Debug ข้อมูลที่ดึงมา
                    setBranches(res.data);
                } catch (error) {
                    console.error("🔴 Error fetching branches:", error);
                    alert("❌ ไม่สามารถโหลดข้อมูลสาขาได้");
                }
            };
            fetchBranches();
        }
    }, [isAdmin]); // ✅ ใช้ `isAdmin` เป็น dependency

    const handleSave = () => {
        if (!customerName || !phone || !appointmentDate || !appointmentTime) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        if (!window.confirm("คุณต้องการเพิ่มนัดหมายนี้หรือไม่?")) {
            return;
        }
    
        const newAppointment = {
            customerName,
            phone,
            location,
            shoeCount,
            appointmentDate,
            appointmentTime,
            branch_id: isAdmin ? (selectedBranch || null) : (user.branch_id || null), 

        };
    
        console.log("📌 Debug: Sending Appointment Data", newAppointment); // ✅ Debug ข้อมูลที่ส่งไป
    
        onAddAppointment(newAppointment);
        onClose();
        alert("✅ เพิ่มนัดหมายสำเร็จ");
    };
    

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content card shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="mb-3 text-start">เพิ่มนัดหมาย</h2>
                {/* ✅ เฉพาะ Admin สามารถเลือกสาขา */}
                {isAdmin && (
                    <div className="mb-2">
                        <label className="form-label">เลือกสาขา</label>
                        <select className="form-control" value={selectedBranch} onChange={(e) => setSelectedBranch(Number(e.target.value))}>
                            <option value="">-- เลือกสาขา --</option> {/* ✅ Default option */}
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>

                    </div>
                )}
                <div className="mb-2">
                    <label className="form-label">ชื่อ</label>
                    <input type="text" className="form-control text-start w-100" placeholder="ชื่อ"
                        value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>

                <div className="mb-2">
                    <label className="form-label">เบอร์โทร</label>
                    <input type="text" className="form-control text-start w-100" placeholder="เบอร์โทร"
                        value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="mb-2">
                    <label className="form-label">สถานที่</label>
                    <input type="text" className="form-control text-start w-100" placeholder="สถานที่"
                        value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className="mb-2">
                    <label className="form-label">จำนวนรองเท้า</label>
                    <input type="number" className="form-control text-start w-100" placeholder="จำนวนรองเท้า"
                        value={shoeCount} onChange={(e) => setShoeCount(e.target.value)} />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-2">
                        <label className="form-label">วันที่</label>
                        <input type="date" className="form-control text-start w-100"
                            value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label className="form-label">เวลา</label>
                        <input type="time" className="form-control text-start w-100"
                            value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                    </div>
                </div>

                <div className="d-flex justify-content-start mt-3 gap-2">
                    <button className="btn btn-secondary w-50" onClick={onClose}>
                        ❌ ปิด
                    </button>
                    <button className="btn btn-success w-50" onClick={handleSave}>
                        ✅ บันทึก
                    </button>
                </div>
            </div>
        </div>

    );
};

export default AddAppointmentModal;
