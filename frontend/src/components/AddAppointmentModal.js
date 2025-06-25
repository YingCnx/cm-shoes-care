import React, { useState, useEffect } from "react";
import { getBranches, getCustomers, createCustomer } from "../services/api";
import { checkSession } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../assets/css/bootstrap.min.css";
import "./AddAppointmentModal.css";
import Select from "react-select";
import AddCustomerModal from "./AddCustomerModal";

const AddAppointmentModal = ({ show, onClose, onAddAppointment }) => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Walk-in');
    const [shoeCount, setShoeCount] = useState(1);
    const [appointmentDate, setAppointmentDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow.toISOString().split('T')[0];
    });
    const [appointmentTime, setAppointmentTime] = useState('10:00');
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [user, setUser] = useState(null);


    const [branches, setBranches] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

useEffect(() => {
  const init = async () => {
    const userData = await checkSession();
    if (!userData) {
      alert("กรุณาเข้าสู่ระบบ");
      navigate("/login");
      return;
    }

    setUser(userData);
    const admin = userData.role === "superadmin";
    setIsAdmin(admin);
    setSelectedBranch(admin ? "" : userData.branch_id);

    if (admin) fetchBranches();
    else fetchCustomers(userData.branch_id);
  };

  init();
}, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchCustomers(selectedBranch);
        }
    }, [selectedBranch]);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const fetchCustomers = async (branchId) => {
        try {
            const res = await getCustomers(branchId);
            setCustomers(res.data);
        } catch (err) {
            console.error("🔴 Error loading customers:", err);
        }
    };

    const handleSaveNewCustomer = async (customerData) => {
        try {
            const res = await createCustomer(customerData);
            if (res.status === 201 || res.status === 200) {
                alert("✅ บันทึกข้อมูลลูกค้าสำเร็จ!");
                setShowAddCustomerModal(false);
                fetchCustomers(selectedBranch);
                setCustomerName(res.data.name);
                setPhone(res.data.phone);
                setLocation(res.data.address || "Walk-in");
                setCustomerId(res.data.id);
            } else {
                alert("❌ ไม่สามารถบันทึกข้อมูลลูกค้าได้");
            }
        } catch (err) {
            console.error("🔴 Error saving new customer:", err);
            alert("❌ เกิดข้อผิดพลาดในการบันทึกลูกค้า");
        }
    };

    const handleSave = () => {
        if (!customerId || !customerName || !phone || !appointmentDate || !appointmentTime) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (!window.confirm("คุณต้องการเพิ่มนัดหมายนี้หรือไม่?")) {
            return;
        }

        const newAppointment = {
            customerId,
            customerName,
            phone,
            location,
            shoeCount,
            appointmentDate,
            appointmentTime,
            branch_id: isAdmin ? (selectedBranch || null) : (user.branch_id || null),
        };

        onAddAppointment(newAppointment);
        onClose();
        alert("✅ เพิ่มนัดหมายสำเร็จ");
    };

    if (!show) return null;

    return (
        <div className="add-appointment-modal-overlay">
            <div className="add-appointment-modal-content card shadow p-4" style={{ backgroundColor: "#fff", maxWidth: "600px", margin: "auto" }}>
                <h2 className="mb-4 text-center">📅 เพิ่มนัดหมาย</h2>

                {isAdmin && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">เลือกสาขา</label>
                        <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(Number(e.target.value))}>
                            <option value="">-- เลือกสาขา --</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label fw-bold">🔍 ค้นหาลูกค้า (จากประวัติ)</label>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="flex-grow-1">
                            <Select
                                options={customers.map(c => ({
                                    label: `${c.name || "-"} | ${c.phone || "-"} | ${c.address || "-"}`,
                                    value: c.id,
                                    data: c
                                }))}
                                value={null}
                                onChange={(selected) => {
                                    if (selected?.data) {
                                        const customer = selected.data;
                                        setCustomerId(customer.id);
                                        setCustomerName(customer.name);
                                        setPhone(customer.phone);
                                        setLocation(customer.address || "Walk-in");
                                    } else {
                                        setCustomerId("");
                                        setCustomerName("");
                                        setPhone("");
                                        setLocation("Walk-in");
                                    }
                                }}
                                isClearable
                                placeholder="พิมพ์ชื่อ / เบอร์โทร / สถานที่..."
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <button className="btn btn-outline-primary" onClick={() => {
                                setCustomerName('');
                                setPhone('');
                                setLocation('Walk-in');
                                setCustomerId('');
                                setShowAddCustomerModal(true);
                            }}>เพิ่มลูกค้า</button>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">ชื่อ</label>
                    <input type="text" className="form-control" placeholder="ชื่อ" value={customerName} readOnly />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">เบอร์โทร</label>
                    <input type="text" className="form-control" placeholder="เบอร์โทร" value={phone} readOnly />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">สถานที่</label>
                    <input type="text" className="form-control" placeholder="สถานที่" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">จำนวนรองเท้า</label>
                    <input type="number" className="form-control" value={shoeCount} onChange={(e) => setShoeCount(e.target.value)} />
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">วันที่</label>
                        <input type="date" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">เวลา</label>
                        <input type="time" className="form-control" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                    </div>
                </div>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary w-50 me-2" onClick={onClose}>❌ ปิด</button>
                    <button className="btn btn-success w-50" onClick={handleSave}>✅ บันทึก</button>
                </div>

                {showAddCustomerModal && (
                    <AddCustomerModal
                        show={showAddCustomerModal}
                        onClose={() => setShowAddCustomerModal(false)}
                        onSave={handleSaveNewCustomer}
                        customerData={null}
                        branches={branches}
                        isSuperAdmin={isAdmin}
                    />
                )}
            </div>
        </div>
    );
};

export default AddAppointmentModal;