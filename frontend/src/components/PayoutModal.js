import React from "react";
import { formatDate } from "../utils/helper"; // Import formatDate function

const PayoutModal = ({ show, onClose, form, setForm, handleSubmit, handleDelete, isSuperAdmin, branches, selectedBranch }) => {
    if (!show) return null;

    return (
        <div className="payout-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{form.id ? "🔄 อัปเดตรายจ่าย" : "➕ เพิ่มรายจ่าย"}</h4>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* ✅ หากเป็น SuperAdmin ให้เลือกสาขา */}
                            {isSuperAdmin && !form.id && (
                                <div className="mb-3">
                                    <label className="form-label">เลือกสาขา</label>
                                    <select
                                        className="form-select"
                                        value={form.branch_id}
                                        onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- เลือกสาขา --</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ✅ หากเป็น Employee ให้กำหนด branch_id อัตโนมัติ */}
                            {!isSuperAdmin && !form.id && (
                                <input type="hidden" value={selectedBranch} readOnly />
                            )}

                            <div className="mb-3">
                                <label className="form-label">ประเภท</label>
                                <select className="form-select" value={form.payout_type} onChange={(e) => setForm({ ...form, payout_type: e.target.value })} required>
                                    <option value="">-- เลือกประเภท --</option>
                                    <option value="รายเดือน">รายเดือน</option>
                                    <option value="ค่าส่งรองเท้า">ค่าส่งรองเท้า</option>
                                    <option value="อุปกรณ์-น้ำยา">อุปกรณ์-น้ำยา</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">รายละเอียด</label>
                                <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">จำนวนเงิน (บาท)</label>
                                <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">วันที่จ่ายเงิน</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="payout_date"
                                    value={form.payout_date ? formatDate(form.payout_date) : ""}
                                    onChange={(e) => setForm({ ...form, payout_date: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">หมายเหตุ</label>
                                <textarea className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}></textarea>
                            </div>

                            <div className="modal-footer d-flex justify-content-between">
                                {form.id && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(form.id)}
                                    >
                                        🗑 ลบ
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary">{form.id ? "อัปเดต" : "บันทึก"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutModal;
