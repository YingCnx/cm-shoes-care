import React, { useState, useEffect } from "react";
import { checkSession } from "../services/authService";
import { getAllServices, createService, updateService, deleteService, getBranches } from "../services/api";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ jwtDecode อ่านข้อมูลจาก Token
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceManagement.css";
import { FaPlus } from 'react-icons/fa';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [form, setForm] = useState({ id: null, service_name: "", base_price: "", description: "", branch_id: "" });
    const [showModal, setShowModal] = useState(false);

        useEffect(() => {
        const init = async () => {
            const user = await checkSession();
            if (!user) {
            alert("กรุณาเข้าสู่ระบบ");
            return;
            }

            const isSuperAdmin = user.role === "superadmin";
            setIsSuperAdmin(isSuperAdmin);

            if (isSuperAdmin) {
            setSelectedBranch(""); // ✅ SuperAdmin ต้องเลือกสาขาก่อนแสดงผล
            fetchBranches();
            } else {
            setSelectedBranch(user.branch_id); // ✅ Employee ใช้ branch_id ของตัวเอง
            fetchServices(user.branch_id);
            }
        };

        init();
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
  <div className="appointments-container">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>⚙️ จัดการบริการ</h1>
    </div>

    {isSuperAdmin && (
      <div className="mb-3">
        <label className="form-label fw-semibold">เลือกสาขา</label>
        <select
          className="form-control"
          value={selectedBranch || ''}
          onChange={handleBranchChange}
        >
          <option value="">-- เลือกสาขา --</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
      </div>
    )}

    <div className="queue-card-wrapper">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn-split"
          onClick={() => {
            setForm({ id: null, service_name: "", base_price: "", description: "", branch_id: selectedBranch });
            setShowModal(true);
          }}
          disabled={!selectedBranch}
        >
          <span className="btn-text">เพิ่มบริการ</span>
          <span className="btn-icon"><FaPlus /></span>
        </button>
      </div>

      {selectedBranch && services.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead>
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
                <td>{parseFloat(service.base_price).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿</td>
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
    </div>

    {/* Modal */}
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
                  <input type="text" className="form-control" value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">ราคา (บาท)</label>
                  <input type="number" className="form-control" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">รายละเอียด</label>
                  <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary w-100">{form.id ? "อัปเดต" : "บันทึก"}</button>
                </div>
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
