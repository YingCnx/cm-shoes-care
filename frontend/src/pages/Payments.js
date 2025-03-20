import React, { useState, useEffect } from "react";
import { getCompletedQueues } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import "bootstrap/dist/css/bootstrap.min.css";

const Payments = () => {
    const [queues, setQueues] = useState([]);
    const [selectedQueue, setSelectedQueue] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCompletedQueues();
    }, []);

    const fetchCompletedQueues = async () => {
        try {
            const res = await getCompletedQueues();
            setQueues(res.data || []); // ✅ ป้องกันค่า null
        } catch (error) {
            console.error("🔴 Error fetching completed queues:", error);
        }
    };

    const handleOpenPaymentModal = () => {
            if(queue.payment_status == "ชำระเงินแล้ว"){
                alert("ไม่สามารถชำระเงินซ้ำได้!");
                return;
            }
            setShowPaymentModal(true);
        };
    
        const handleConfirmPayment = async (discount, totalAmount, paymentMethod) => {
        const message = "เมื่อคุณชำระเงินแล้ว จะไม่สามารถแก้ไขข้อมูลใดๆ ได้อีก\nยืนยันการชำระเงินหรือไม่?";
        
        if (!window.confirm(message)) return;
    
        try {
            const paymentRes = await createPayment({
                queue_id,
                discount,
                total_amount: totalAmount,
                payment_method: paymentMethod,
            });
    
            const payment_id = paymentRes.data.payment_id || "N/A";
    
            alert("✅ ชำระเงินเรียบร้อย!");
            setShowPaymentModal(false);
    
            await fetchQueueDetail(); // ✅ รีเฟรชข้อมูลคิว
            navigate("/queue"); // ✅ กลับไปหน้าคิว
    
            // ✅ ถามว่าต้องการพิมพ์สลิปหรือไม่
            const confirmPrint = window.confirm("🖨 ต้องการพิมพ์สลิปหรือไม่?");
            if (confirmPrint) {
                printReceipt(payment_id,queue, getServiceSummary(), discount, totalAmount, paymentMethod);
            }
            
        } catch (error) {
            console.error("🔴 Error processing payment:", error);
            alert("❌ ไม่สามารถชำระเงินได้");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">💰 รายการคิวที่ต้องชำระเงิน</h1>

            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ลูกค้า</th>
                            <th>สถานที่</th>
                            <th>จำนวนคู่</th>
                            <th>ยอดรวม (บาท)</th>
                            <th>สถานะ</th>
                            <th>ดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queues.length > 0 ? (
                            queues.map((queue) => (
                                <tr key={queue.id}>
                                    <td>{queue.customer_name || "ไม่ระบุ"}</td>
                                    <td>{queue.location || "ไม่ระบุ"}</td>
                                    <td>{queue.total_pairs || 0}</td>
                                    <td>{(queue.total_price || 0).toLocaleString()} ฿</td>
                                    <td>
                                        <span className={`badge ${queue.status === "รอชำระเงิน" ? "bg-warning" : "bg-success"}`}>
                                            {queue.status}
                                        </span>
                                    </td>
                                    <td>
                                         <button className="btn btn-success btn-md me-3" onClick={handleOpenPaymentModal} >
                                            💰 ชำระเงิน
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">ไม่มีคิวที่ต้องชำระเงิน</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedQueue && (
                <PaymentModal queue={selectedQueue} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default Payments;
