import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getBranches,
  checkDuplicatePhone,
} from "../services/api";
import { checkSession } from "../services/authService";
import AddCustomerModal from "../components/AddCustomerModal";
import { FaPlus } from "react-icons/fa";
import "../assets/css/bootstrap.min.css";
import "./CustomerManagement.css"; // ✅ ใช้ style เฉพาะหน้า

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const init = async () => {
      const user = await checkSession();
      if (!user) {
        setTimeout(() => navigate("/login"), 0);
        return;
      }

      const isSuper = user.role === "superadmin";
      setIsSuperAdmin(isSuper);
      setSelectedBranch(isSuper ? "" : user.branch_id);

      if (isSuper) fetchBranches();
      else fetchCustomers(user.branch_id);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (selectedBranch !== "") fetchCustomers(selectedBranch);
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data || []);
    } catch (error) {
      console.error("🔴 Error fetching branches:", error);
    }
  };

  const fetchCustomers = async (branchId) => {
    try {
      const res = await getCustomers(branchId);
      setCustomers(res.data || []);
    } catch (error) {
      console.error("🔴 Error fetching customers:", error);
    }
  };

  const handleCreateOrUpdateCustomer = async (customerData) => {
    try {
      if (!customerData.branch_id) customerData.branch_id = null;
      else customerData.branch_id = parseInt(customerData.branch_id);

      const isEditMode = !!customerData.id;
      const phoneChanged = isEditMode && customerData.phone !== editCustomer?.phone;

      if (!isEditMode || phoneChanged) {
        const res = await checkDuplicatePhone(customerData.phone, customerData.branch_id);
        if (res.data.exists) {
          alert("❌ เบอร์โทรนี้มีอยู่ในสาขานี้แล้ว กรุณาตรวจสอบ");
          return;
        }
      }

      const confirmMessage = customerData.id
        ? "📌 คุณต้องการแก้ไขข้อมูลลูกค้านี้หรือไม่?"
        : "📌 คุณต้องการเพิ่มลูกค้าใหม่หรือไม่?";
      if (!window.confirm(confirmMessage)) return;

      const response = customerData.id
        ? await updateCustomer(customerData.id, customerData)
        : await createCustomer(customerData);

      if ([200, 201].includes(response.status)) {
        alert("✅ บันทึกข้อมูลลูกค้าสำเร็จ!");
        fetchCustomers(selectedBranch);
        setShowAddModal(false);
        setEditCustomer(null);
      } else alert("❌ ไม่สามารถบันทึกข้อมูลลูกค้าได้");
    } catch (error) {
      const message = error.response?.data?.message || "เกิดข้อผิดพลาด ไม่สามารถบันทึกลูกค้าได้";
      alert(`❌ ${message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้าคนนี้?")) return;
    try {
      const response = await deleteCustomer(id);
      if (response.status === 200) {
        alert("✅ ลบลูกค้าสำเร็จ");
        fetchCustomers(selectedBranch);
      } else alert("❌ ลบลูกค้าไม่สำเร็จ");
    } catch (error) {
      const message = error.response?.data?.message || "เกิดข้อผิดพลาด ไม่สามารถลบลูกค้าได้";
      alert(`❌ ${message}`);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.phone?.includes(term) ||
      customer.address?.toLowerCase().includes(term) ||
      customer.status?.toLowerCase().includes(term) ||
      customer.notes?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="appointments-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👤 ระบบจัดการลูกค้า</h2>
      </div>

      {isSuperAdmin && (
        <div className="mb-3">
          <label className="form-label fw-semibold">เลือกสาขา</label>
          <select
            className="form-control"
            value={selectedBranch || ""}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">-- เลือกสาขา --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="queue-card-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="🔍 ค้นหาชื่อลูกค้า หรือเบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="btn-split"
            onClick={() => setShowAddModal(true)}
            disabled={!selectedBranch && isSuperAdmin}
          >
            <span className="btn-text">เพิ่มลูกค้า</span>
            <span className="btn-icon">
              <FaPlus />
            </span>
          </button>
        </div>

        {filteredCustomers.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>รหัสลูกค้า</th>
                <th>ชื่อ</th>
                <th>เบอร์โทร</th>
                <th>ที่อยู่</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
                <th>แก้ไข</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.customer_code}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td  className="td-addr">{customer.address}</td>
                  <td>{customer.status}</td>
                  <td className="td-notes">{customer.notes}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      title="แก้ไข"
                      onClick={() => {
                        setEditCustomer(customer);
                        setShowAddModal(true);
                      }}
                    >
                      ✏️
                    </button>
                </td>
                <td>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      title="ลบ"
                      onClick={() => handleDelete(customer.id)}
                    >
                      ❌
                    </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-muted py-3">❌ ไม่พบข้อมูลลูกค้า</div>
        )}
      </div>

      {showAddModal && (
        <AddCustomerModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditCustomer(null);
          }}
          onSave={handleCreateOrUpdateCustomer}
          customerData={editCustomer}
          branches={branches}
          isSuperAdmin={isSuperAdmin}
        />
      )}
    </div>
  );
};

export default CustomerManagement;