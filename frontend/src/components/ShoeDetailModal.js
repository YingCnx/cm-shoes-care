import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";

const ShoeDetailModal = ({ show, onClose, shoe, queue_id, fetchQueueDetail, uploadAfterImages }) => {
    console.log("📌 Debug: queue_id ที่ได้รับใน ShoeDetailModal:", queue_id);

    if (!show || !shoe) return null;
    if (!queue_id) {
        console.error("🔴 Error: queue_id ไม่ถูกส่งมา!");
        return null;
    }


    const Backend_URL = 'http://localhost:5000';

    // ✅ กำหนดค่าเริ่มต้นจาก API
    const [updatedImages, setUpdatedImages] = useState({});
    const [currentImages, setCurrentImages] = useState({
        front: shoe.image_after_front ? `${Backend_URL}${shoe.image_after_front}` : null,
        back: shoe.image_after_back ? `${Backend_URL}${shoe.image_after_back}` : null,
        left: shoe.image_after_left ? `${Backend_URL}${shoe.image_after_left}` : null,
        right: shoe.image_after_right ? `${Backend_URL}${shoe.image_after_right}` : null,
        top: shoe.image_after_top ? `${Backend_URL}${shoe.image_after_top}` : null,
        bottom: shoe.image_after_bottom ? `${Backend_URL}${shoe.image_after_bottom}` : null,
    });

    // ✅ เมื่อ `shoe` เปลี่ยน ให้รีเซ็ตค่า currentImages ใหม่
    useEffect(() => {
        setCurrentImages({
            front: shoe.image_after_front ? `${Backend_URL}${shoe.image_after_front}` : null,
            back: shoe.image_after_back ? `${Backend_URL}${shoe.image_after_back}` : null,
            left: shoe.image_after_left ? `${Backend_URL}${shoe.image_after_left}` : null,
            right: shoe.image_after_right ? `${Backend_URL}${shoe.image_after_right}` : null,
            top: shoe.image_after_top ? `${Backend_URL}${shoe.image_after_top}` : null,
            bottom: shoe.image_after_bottom ? `${Backend_URL}${shoe.image_after_bottom}` : null,
        });
    }, [shoe]);

    // ✅ ฟังก์ชันอัปโหลดรูป
    const handleImageChange = (event, position) => {
        const file = event.target.files[0];
        if (file) {
            setUpdatedImages(prev => ({
                ...prev,
                [position]: file
            }));
            setCurrentImages(prev => ({
                ...prev,
                [position]: URL.createObjectURL(file)
            }));
        }
    };

    // ✅ ฟังก์ชันบันทึกภาพ
    const handleSaveImages = async () => {
        if (!queue_id) {
            alert("❌ ไม่พบ `queue_id`!");
            return;
        }
    
        if (Object.keys(updatedImages).length === 0) {
            alert("❌ กรุณาเลือกรูปที่ต้องการอัปโหลดก่อนกดบันทึก!");
            return;
        }
    
        const formData = new FormData();
        Object.keys(updatedImages).forEach(position => {
            formData.append(`image_after_${position}`, updatedImages[position]);
        });
    
        console.log("📌 Debug: FormData ก่อนส่งไป API");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
    
        try {
            console.log("📌 Debug: Uploading images for queue_id:", queue_id, "queue_item_id:", shoe.queue_item_id);
            await uploadAfterImages(queue_id, shoe.queue_item_id, formData);
            alert("✅ อัปโหลดรูป After สำเร็จ!");
            fetchQueueDetail(); // ✅ รีโหลดข้อมูลใหม่
            onClose(); // ✅ ปิด Modal
        } catch (error) {
            console.error("🔴 Error uploading after images:", error);
            alert("❌ อัปโหลดรูปไม่สำเร็จ!");
        }
    };
    
    
    

    return (
        <div className="modal-overlay">
            <div className="modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="text-center">👟 รายละเอียดรองเท้า</h2>

                {/* ✅ ข้อมูลรองเท้า */}
                <div className="mb-3">
                    <p><strong>แบรนด์:</strong> {shoe.brand}</p>
                    <p><strong>รุ่น:</strong> {shoe.model}</p>
                    <p><strong>สี:</strong> {shoe.color}</p>
                    <p><strong>หมายเหตุ:</strong> {shoe.notes || "-"}</p>
                </div>

                {/* ✅ ตาราง Before & After */}
                <h3 className="text-center">📷 ภาพ Before & After</h3>
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>ตำแหน่ง</th>
                            <th>Before</th>
                            <th>After (เปลี่ยนรูปได้)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {["front", "back", "left", "right", "top", "bottom"].map((position) => (
                            <tr key={position}>
                                <td><strong>{position.toUpperCase()}</strong></td>
                                <td>
                                    {shoe[`image_before_${position}`] ? (
                                        <img src={`${Backend_URL}${shoe[`image_before_${position}`]}`} 
                                             alt={`before-${position}`} width="80" className="img-thumbnail" />
                                    ) : "-"}
                                </td>
                                <td>
                                    <label className="upload-label">
                                        <input type="file" accept="image/*" 
                                            onChange={(e) => handleImageChange(e, position)} 
                                            hidden />
                                        {currentImages[position] ? (
                                            <img src={currentImages[position]} 
                                                alt={`after-preview-${position}`} width="80" className="img-thumbnail" />
                                        ) : (
                                            <button className="btn btn-warning btn-sm">📤 Upload</button>
                                        )}
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ✅ ปุ่มบันทึกและปิด Modal */}
                <div className="text-center mt-3">
                    <button className="btn btn-success mx-2" onClick={handleSaveImages}>
                        ✅ บันทึก
                    </button>
                    <button className="btn btn-danger mx-2" onClick={onClose}>
                        ❌ ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShoeDetailModal;
