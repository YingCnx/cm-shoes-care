// AddLockerModal.js
import React, { useState, useEffect } from 'react';
import { getBranches, createLocker, updateLocker } from '../services/api';
import { checkSession } from '../services/authService';

const AddLockerModal = ({ show, onClose, onSaved, editData = null }) => {
  const [form, setForm] = useState({
    name: '',
    branch_id: '',
    address: '',
    latitude: '',
    longitude: '',
    sim_number: '',
    device_serial: '',
    firmware_version: '',
    note: '',
    slot_count: 8
  });

  const [branches, setBranches] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    if (show) {
      init();
      setGeneratedCode(null);
      if (editData) setForm(editData);
    }
  }, [show, editData]);

  const init = async () => {
    try {
      const user = await checkSession();
    
      setIsSuperAdmin(user.role === 'superadmin');
      const res = await getBranches();
      setBranches();
      //console.log(res);
      if (user.role !== 'superadmin') {
        const userBranch = res.data.find(b => b.id === user.branch_id);
       // console.log(userBranch);
        if (userBranch) {
          setForm((prev) => ({ ...prev, branch_id: userBranch.id }));
          setBranchName(userBranch.name);
        }
      }
    } catch (err) {
      console.error("🔴 Error initializing modal:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const confirmSave = window.confirm("คุณต้องการบันทึกข้อมูลตู้ใช่หรือไม่?");
      if (!confirmSave) return; // ถ้าไม่ยืนยัน ให้ยกเลิก

      if (editData) {
        await updateLocker(editData.id, form);
        onSaved();
        onClose();
      } else {
        const res = await createLocker(form);
        setGeneratedCode(res.data?.code || null);
        onSaved();
        onClose(); 
      }
    } catch (err) {
      console.error("🔴 Error saving locker:", err);
      alert("ไม่สามารถบันทึกข้อมูลตู้ได้ กรุณาลองใหม่");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">{editData ? 'แก้ไขข้อมูลตู้' : 'เพิ่มตู้ Locker'}</h5>
            <button onClick={onClose} className="btn-close"></button>
          </div>

          <div className="modal-body">
            {generatedCode && !editData && (
              <div className="alert alert-success">
                ✅ เพิ่มตู้เรียบร้อย! รหัสตู้ที่สร้างคือ <strong>{generatedCode}</strong>
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6">
                <label>ชื่อ</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                {isSuperAdmin ? (
                  <>
                    <label>สาขา</label>
                    <select name="branch_id" className="form-control" value={form.branch_id} onChange={handleChange}>
                      <option value="">-- เลือกสาขา --</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label>สาขา</label>
                    <input type="text" className="form-control" value={branchName} disabled />
                  </>
                )}
              </div>

              <div className="col-md-12">
                <label>ที่อยู่</label>
                <textarea name="address" className="form-control" value={form.address} onChange={handleChange}></textarea>
              </div>

              <div className="col-md-6">
                <label>ละติจูด</label>
                <input type="text" name="latitude" className="form-control" value={form.latitude} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>ลองจิจูด</label>
                <input type="text" name="longitude" className="form-control" value={form.longitude} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label>เบอร์ซิม</label>
                <input type="text" name="sim_number" className="form-control" value={form.sim_number} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>Device Serial</label>
                <input type="text" name="device_serial" className="form-control" value={form.device_serial} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label>Firmware Version</label>
                <input type="text" name="firmware_version" className="form-control" value={form.firmware_version} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label>จำนวนช่อง</label>
                <input type="number" name="slot_count" className="form-control" value={form.slot_count} onChange={handleChange} />
              </div>

              <div className="col-md-12">
                <label>หมายเหตุ</label>
                <textarea name="note" className="form-control" value={form.note} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>ปิด</button>
            <button className="btn btn-primary" onClick={handleSubmit}>{editData ? 'อัปเดต' : 'บันทึก'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLockerModal;
