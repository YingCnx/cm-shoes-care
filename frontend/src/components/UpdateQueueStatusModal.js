import React from "react";
import "../assets/css/bootstrap.min.css";

const UpdateQueueStatusModal = ({ show, handleClose, handleUpdate, queueId, currentStatus, totalPrice}) => {
    const statusMap = {
        "รับเข้า": "อยู่ระหว่างทำความสะอาด",
        "อยู่ระหว่างทำความสะอาด": "เตรียมส่ง",
        "เตรียมส่ง": "กำลังจัดส่ง",
        "กำลังจัดส่ง": "จัดส่งสำเร็จ"
    };

    const newStatus = statusMap[currentStatus] || currentStatus;
    const [status, setStatus] = React.useState(newStatus);
    const [price, setPrice] = React.useState(parseFloat(totalPrice).toFixed(2));

    React.useEffect(() => {
        setStatus(newStatus);
        setPrice(parseFloat(totalPrice).toFixed(2)); // ป้องกัน undefined
    }, [currentStatus, totalPrice]);

    const handleSubmit = () => {
        if (!window.confirm(`คุณต้องการเปลี่ยนสถานะเป็น "${status}" หรือไม่?`)) return;

        const totalQueuePrice = parseFloat(price) || 0;
        if (totalQueuePrice === 0) {
            alert("❌ กรุณาเพิ่มรายละเอียดก่อนอัปเดตสถานะ!");
            return;
        }

        //.log("data",queueId,status,totalQueuePrice);
        handleUpdate(queueId, status, totalQueuePrice);
        
        if (status === "เตรียมส่ง") {
            alert("!!อย่าลืม อัปโหลดรูป After นะคะ");
        }

        handleClose();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="text-center mb-3">🔄 อัปเดตสถานะคิว</h2>
                <div className="mb-3">
                    <label className="form-label">อัพเดทสถานะคิวเป็น</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        {Object.keys(statusMap).map(key => (
                            <option key={key} value={statusMap[key]}>{statusMap[key]}</option>
                        ))}
                    </select>
                </div>
               
                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn btn-secondary w-45" onClick={handleClose}>
                            ❌ ปิด
                        </button>
                        <button className="btn btn-success w-45" onClick={handleSubmit}>
                            ✅ บันทึก
                        </button>
                    </div>
                
            </div>
        </div>
    );
};

export default UpdateQueueStatusModal;
