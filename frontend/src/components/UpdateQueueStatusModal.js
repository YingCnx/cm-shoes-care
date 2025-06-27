import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";
import "./UpdateQueueStatusModal.css";
import { createAppointment } from "../services/api"; // ✅ เพิ่ม import สำหรับสร้างนัดหมาย

const UpdateQueueStatusModal = ({
  show,
  handleClose,
  handleUpdate,
  queueId,
  currentStatus,
  totalPrice,
  queue,
}) => {
  const statusMap = {
    "": "รับเข้า",
    "รับเข้า": "อยู่ระหว่างทำความสะอาด",
    "อยู่ระหว่างทำความสะอาด": "เตรียมส่ง",
    "เตรียมส่ง": "กำลังจัดส่ง",
    "กำลังจัดส่ง": "จัดส่งสำเร็จ",
  };

  const newStatus = statusMap[currentStatus] || currentStatus;
  const [status, setStatus] = useState(newStatus);
  const [price, setPrice] = useState(parseFloat(totalPrice).toFixed(2));

  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");

   const [appointmentDate, setAppointmentDate] = useState(() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate());
          return tomorrow.toISOString().split('T')[0];
      });
      const [appointmentTime, setAppointmentTime] = useState('10:00');

  useEffect(() => {
    setStatus(newStatus);
    setPrice(parseFloat(totalPrice).toFixed(2));
  }, [currentStatus, totalPrice]);

  useEffect(() => {
    if (status === "เตรียมส่ง" && queue) {
      const loc = queue.location || "";
      const src = queue.source || "";

      if (src === "locker") {
        setDeliveryMethod("Locker");
      } else if (loc === "Walk-in") {
        setDeliveryMethod("Walk-in");
      } else {
        setDeliveryMethod("Delivery");
        setDeliveryLocation(loc);
      }
    }
  }, [status, queue]);

  const handleSubmit = async () => {
    if (!window.confirm(`คุณต้องการเปลี่ยนสถานะเป็น "${status}" หรือไม่?`)) return;

    const totalQueuePrice = parseFloat(price) || 0;
    if (totalQueuePrice === 0) {
      alert("❌ กรุณาเพิ่มรายละเอียดก่อนอัปเดตสถานะ!");
      return;
    }

    let deliveryData = {};
    if (status === "เตรียมส่ง") {
      if (deliveryMethod === "Delivery") {
        if (!appointmentDate || !appointmentTime || !deliveryLocation) {
          alert("❌ กรุณากรอกวันที่, เวลา และสถานที่จัดส่งให้ครบ");
          return;
        }
      }

      deliveryData = {
        deliveryMethod,
        appointmentDate,
        appointmentTime,
        deliveryLocation,
      };
    }

    // ✅ อัปเดตสถานะคิว
    await handleUpdate(queueId, status, totalQueuePrice, deliveryData);

    // ✅ สร้างนัดหมาย ถ้าเป็น Delivery
    if (status === "เตรียมส่ง" && deliveryMethod === "Delivery" && queue) {
      const appointmentPayload = {
        customer_id: queue.customer_id,
        customer_name: queue.customer_name,
        phone: queue.phone,
        location: deliveryLocation,
        shoe_count: queue.total_pairs || 1,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        branch_id: queue.branch_id,
        appointment_type: "delivery",
        queue_id: queue.id,
      };

      try {
        //console.log("dt",appointmentPayload);
        await createAppointment(appointmentPayload);
        alert("✅ สร้างนัดหมายจัดส่งสำเร็จ!");
      } catch (error) {
        console.error("🔴 Error creating delivery appointment:", error);
        alert("❌ ไม่สามารถสร้างนัดหมายจัดส่งได้");
      }
    }

    if (status === "เตรียมส่ง") {
      alert("‼️ อย่าลืมอัปโหลดรูป After นะคะ");
    }

    handleClose();
  };

  if (!show) return null;

  const isLocker = queue?.source === "locker";

  return (
    <div className="update-queues-modal-overlay">
      <div className="update-queues-modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
        <h2 className="text-center mb-3">🔄 อัปเดตสถานะคิว</h2>

        <div className="mb-3">
          <label className="form-label">อัปเดตสถานะคิวเป็น</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {[...new Set(Object.values(statusMap))].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          </div>
        {status === "เตรียมส่ง" && (
          <div className="mb-3">
            <label className="form-label">📦 ช่องทางจัดส่ง</label>
            <select
              className="form-select"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              disabled={isLocker} // 🔒 ถ้าเป็น locker ห้ามเปลี่ยน
            >
              <option value="Walk-in">Walk-in</option>
              <option value="Delivery">นัดส่ง</option>

              {/* ✅ แสดง Locker เฉพาะกรณีมาจาก locker เท่านั้น */}
              {isLocker && <option value="Locker">Locker</option>}
            </select>

            {/* 🎯 เฉพาะ Delivery: แสดงฟอร์มนัดส่ง */}
            {deliveryMethod === "Delivery" && (
              <div className="mt-3">
                <label className="form-label">📅 วันที่นัดส่ง</label>
                <input type="date" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                <label className="form-label mt-2">⏰ เวลานัดส่ง</label>
                <input type="time" className="form-control" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                <label className="form-label mt-2">📍 สถานที่นัดส่ง</label>
                <input type="text" className="form-control" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
              </div>
            )}

            {/* ✅ แสดงข้อความเฉพาะกรณี Locker */}
            {deliveryMethod === "Locker" && isLocker && (
              <div className="mt-3 text-muted">
                ระบบจะจัดการเลือกตู้ Locker และช่องให้อัตโนมัติ
              </div>
            )}
          </div>
        )}

        <div className="modal-actions mt-4">
          <button className="btn btn-success" onClick={handleSubmit}>✅ บันทึก</button>
          <button className="btn btn-danger me-2" onClick={handleClose}>❌ ปิด</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateQueueStatusModal;
