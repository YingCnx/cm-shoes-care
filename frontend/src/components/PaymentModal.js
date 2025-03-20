import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";

const PaymentModal = ({ show, onClose, onConfirm, serviceSummary }) => {
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("เงินสด");

    useEffect(() => {
        setDiscount(0);
        setPaymentMethod("เงินสด");
    }, [show]);

    if (!show) return null;

    // ✅ ตรวจสอบว่า serviceSummary ไม่ใช่ `undefined` หรือ `null`
    const validServices = serviceSummary ? serviceSummary.filter(service => service !== null && service !== undefined) : [];

    // ✅ คำนวณยอดรวมจากค่าบริการทั้งหมด
    const totalPrice = validServices.reduce((sum, service) => sum + (parseFloat(service?.total_price) || 0), 0);

    // ✅ คำนวณยอดสุทธิหลังหักส่วนลด
    const totalAmount = totalPrice - discount < 0 ? 0 : totalPrice - discount;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>💰 สรุปการชำระเงิน</h2>
                <h6 className="text-danger" style={{ fontSize: '0.75rem' }}>
                    *เมื่อคุณชำระเงินแล้ว คุณจะไม่สามารถแก้ไขข้อมูลใดๆได้อีก 
                </h6>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>บริการ</th>
                            <th>จำนวน</th>
                            <th>ราคารวม (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validServices.length > 0 ? (
                            validServices.map((service, index) => (
                                <tr key={index}>
                                    <td>{service?.service_name || "-"}</td>
                                    <td>{service?.total_pairs || 0}</td>
                                    <td>{parseFloat(service?.total_price || 0).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">ไม่มีข้อมูล</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="2"><strong>ยอดรวม</strong></td>
                            <td><strong>{totalPrice.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>

                {/* ✅ ช่องกรอกส่วนลด */}
                <label>🎯 ส่วนลด (บาท):</label>
                <input
                    type="number"
                    className="form-control"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />

                {/* ✅ เลือกรูปแบบการชำระเงิน */}
                <label className="mt-3">💳 วิธีการชำระเงิน:</label>
                <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="เงินสด">เงินสด</option>
                    <option value="เงินโอน">เงินโอน</option>
                </select>

                {/* ✅ แสดงยอดสุทธิ */}
                <h3 className="mt-3">💰 ยอดสุทธิ: {totalAmount.toFixed(2)} บาท</h3>

                {/* ✅ ปุ่มยืนยันชำระเงิน */}
                <div className="modal-actions">
                    <button className="btn btn-danger" onClick={onClose}>❌ ปิด</button>
                    <button className="btn btn-success" onClick={() => onConfirm(discount, totalAmount, paymentMethod)}>
                        ✅ ยืนยันชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
