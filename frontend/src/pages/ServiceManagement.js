import React, { useState, useEffect } from "react";
import { getAllServices, createService, updateService, deleteService, getBranches } from "../services/api";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ jwtDecode อ่านข้อมูลจาก Token
import "bootstrap/dist/css/bootstrap.min.css";

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [form, setForm] = useState({ id: null, service_name: "", base_price: "", description: "", branch_id: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("กรุณาเข้าสู่ระบบ");
            return;
        }

        try {
            const user = jwtDecode(token);
            setIsSuperAdmin(user.isSuperAdmin);

            if (user.isSuperAdmin) {
                setSelectedBranch(""); // ✅ SuperAdmin ต้องเลือกสาขาก่อนแสดงผล
                fetchBranches();
            } else {
                setSelectedBranch(user.branch_id); // ✅ Employee ใช้ branch_id ของตัวเอง
                fetchServices(user.branch_id);
            }
        } catch (error) {
            console.error("🔴 Error decoding token:", error);
        }
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("🔴 Error fetching branches:", error);
        }
    };

    const fetchServices = async (branchId) => {
        if (!branchId) return; // ✅ ถ้าไม่ได้เลือกสาขา ไม่ต้องโหลดข้อมูล
        try {
            const res = await getAllServices(branchId);
            setServices(res.data);
        } catch (error) {
            console.error("🔴 Error fetching services:", error);
        }
    };

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        setSelectedBranch(branchId);
        fetchServices(branchId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!form.service_name || !form.base_price || !selectedBranch) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        const confirmSave = window.confirm(
            form.id 
                ? `📌 คุณต้องการแก้ไขบริการ "${form.service_name}" หรือไม่?` 
                : `📌 คุณต้องการเพิ่มบริการ "${form.service_name}" หรือไม่?`
        );
    
        if (!confirmSave) return;
    
        try {
            const serviceData = { ...form, branch_id: selectedBranch }; // ✅ กำหนด branch_id อัตโนมัติ
    
            if (form.id) {
                await updateService(form.id, serviceData);
                alert("✅ แก้ไขบริการเรียบร้อย!");
            } else {
                await createService(serviceData);
                alert("✅ เพิ่มบริการเรียบร้อย!");
            }
    
            fetchServices(selectedBranch);
            setForm({ id: null, service_name: "", base_price: "", description: "", branch_id: "" });
            setShowModal(false);
        } catch (error) {
            console.error("🔴 Error saving service:", error);
        }
    };

    const handleEdit = (service) => {
        setForm(service);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้?")) {
            try {
                await deleteService(id);
                alert("✅ ลบบริการเรียบร้อย!");
                fetchServices(selectedBranch);
            } catch (error) {
                alert("❌ ไม่สามารถลบบริการนี้ได้ เนื่องจากมีบันทึกการใช้งาน");
                console.error("🔴 Error deleting service:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1>⚙️ จัดการบริการ</h1>   
            <div className="d-flex justify-content-between align-items-center mb-2">
                {isSuperAdmin && (
                    <div className="mb-2">
                        <label className="form-label">เลือกสาขา</label>
                        <select className="form-control"value={selectedBranch} onChange={handleBranchChange}>
                            <option value="">-- เลือกสาขา --</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button 
                    className="btn btn-primary" 
                    onClick={() => {
                        setForm({ id: null, service_name: "", base_price: "", description: "", branch_id: selectedBranch });
                        setShowModal(true);
                    }}
                    disabled={!selectedBranch} // ✅ ปิดปุ่มหากไม่ได้เลือกสาขา
                >
                    ➕ เพิ่มบริการ
                </button>
            </div>

            {selectedBranch && services.length > 0 ? (
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ชื่อบริการ</th>
                            <th>ราคา</th>
                            <th>รายละเอียด</th>
                            <th>แก้ไข</th>
                            <th>ลบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td>{service.service_name}</td>
                                <td>{service.base_price} ฿</td>
                                <td>{service.description}</td>
                                <td><button className="btn btn-warning btn-sm" onClick={() => handleEdit(service)}>✏️</button></td>
                                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(service.id)}>❌</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : selectedBranch ? (
                <p className="text-center mt-3">❌ ไม่มีข้อมูลบริการ</p>
            ) : (
                <p className="text-center mt-3">⚠️ โปรดเลือกสาขา</p>
            )}

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{form.id ? "🔄 อัปเดตบริการ" : "➕ เพิ่มบริการ"}</h4>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">ชื่อบริการ</label>
                                        <input type="text" className="form-control" placeholder="ชื่อบริการ" value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ราคา (บาท)</label>
                                        <input type="number" className="form-control" placeholder="ราคา" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">รายละเอียด</label>
                                        <textarea className="form-control" placeholder="รายละเอียด" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">{form.id ? "🔄 อัปเดต" : "➕ เพิ่ม"}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManagement;
