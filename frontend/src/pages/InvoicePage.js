import React, { useState, useEffect } from 'react';
import { processPayment } from '../services/api'; // ✅ เรียก API
import { checkSession } from "../services/authService";

const InvoicePage = ({ queue }) => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    
    useEffect(() => {
    const verify = async () => {
        const user = await checkSession();
        if (!user) {
        setTimeout(() => navigate("/login"), 0);
        }
    };
    verify();
    }, [navigate]);


    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("❌ กรุณาเลือกวิธีชำระเงิน");
            return;
        }

        const paymentData = {
            queue_id: queue.queue_id,
            amount: queue.total_price, // ✅ ใช้ยอดรวมจาก queue
            payment_method: paymentMethod,
            transaction_id: paymentMethod === "qr_code" ? "QR123456" : null, // ✅ Mock Transaction ID
        };

        try {
            const res = await processPayment(paymentData);
            alert("✅ ชำระเงินสำเร็จ!");
            setIsPaid(true);
        } catch (error) {
            console.error("🔴 Error processing payment:", error);
        }
    };

    return (
        <div className="invoice-page">
            <h1>📜 ใบแจ้งราคา</h1>

            {/* ตารางบริการที่ใช้ */}
            <table>
                <thead>
                    <tr>
                        <th>บริการ</th>
                        <th>จำนวนคู่</th>
                        <th>ราคารวม</th>
                    </tr>
                </thead>
                <tbody>
                    {queue.services.map((service, index) => (
                        <tr key={index}>
                            <td>{service.service_name}</td>
                            <td>{service.pair_count}</td>
                            <td>{(service.pair_count * service.price_per_pair).toFixed(2)} บาท</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="2"><strong>ยอดรวม</strong></td>
                        <td><strong>{queue.total_price.toFixed(2)} บาท</strong></td>
                    </tr>
                </tbody>
            </table>

            {/* เลือกวิธีชำระเงิน */}
            <h2>💳 เลือกวิธีชำระเงิน</h2>
            <div className="payment-options">
                <label>
                    <input type="radio" name="payment" value="qr_code" onChange={() => setPaymentMethod("qr_code")} /> โอนเงินผ่าน QR Code
                </label>
                <label>
                    <input type="radio" name="payment" value="cash" onChange={() => setPaymentMethod("cash")} /> ชำระเงินสด
                </label>
            </div>

            {/* ปุ่มชำระเงิน */}
            {!isPaid ? (
                <button onClick={handlePayment} disabled={!paymentMethod}>✅ ชำระเงิน</button>
            ) : (
                <p className="paid-text">✅ ชำระเงินเรียบร้อยแล้ว</p>
            )}

            {/* แสดง QR Code */}
            {paymentMethod === "qr_code" && !isPaid && (
                <div className="qr-code">
                    <h3>📌 สแกน QR Code เพื่อชำระเงิน</h3>
                    <img src="/path/to/qrcode.jpg" alt="QR Code" width="200" />
                </div>
            )}
        </div>
    );
};

export default InvoicePage;
