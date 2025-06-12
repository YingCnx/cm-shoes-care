import React, { useEffect, useState } from "react";
import "../assets/css/bootstrap.min.css";
import "./EditQueueModal.css";
import { getQueueDetail } from "../services/api";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
};

const EditQueueModal = ({ show, onClose, queueId, onSave }) => {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDateLocal = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchQueue = async () => {
            if (!queueId || !show) return;

            setLoading(true);
            try {
                const res = await getQueueDetail(queueId);
                const data = res.data;
                setForm({
                    queue_id: data.queue_id,
                    customer_name: data.customer_name,
                    phone: data.phone,
                    location: data.location || "",
                    total_pairs: data.total_pairs,
                    received_date: data.received_date || "",
                    delivery_date: data.delivery_date || "",
                });
            } catch (err) {
                console.error("Error loading queue data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQueue();
    }, [queueId, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFields = {
            queue_id: form.queue_id,
            location: form.location,
            total_pairs: form.total_pairs,
            received_date: formatDateLocal(form.received_date),
            delivery_date: formatDateLocal(form.delivery_date),
        };
        onSave(updatedFields); 
    };

    if (!show || !form) return null;

    return (
        <div className="payout-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="editqueue-modal-overlay">
                <div className="editqueue-modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">✏️ แก้ไขข้อมูลคิว</h4>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p>⏳ กำลังโหลดข้อมูล...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">ชื่อลูกค้า</label>
                                    <input type="text" className="form-control" value={form.customer_name} readOnly />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">เบอร์โทร</label>
                                    <input type="text" className="form-control" value={form.phone} readOnly />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">สถานที่</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">จำนวนรองเท้า (คู่)</label>
                                    <input type="number" className="form-control" value={form.total_pairs} readOnly />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">วันที่รับ</label>                                    
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.received_date ? formatDateLocal(form.received_date) : ""}
                                        onChange={(e) => setForm({ ...form, received_date: e.target.value })}
                                        />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">กำหนดส่ง</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.delivery_date ? formatDateLocal(form.delivery_date) : ""}
                                        onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                                        />
                                </div>

                                <div className="modal-footer d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary">
                                        💾 บันทึกการแก้ไข
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQueueModal;
