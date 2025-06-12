import React, { useState, useEffect } from "react";
import "../assets/css/bootstrap.min.css";
import "./ShoeDetailModal.css";
import CameraCaptureModal from "./CameraCaptureModal";


const ShoeDetailModal = ({ show, onClose, shoe, queue_id, fetchQueueDetail, uploadAfterImages }) => {
    const Backend_URL = 'http://localhost:5000';

    const [updatedImages, setUpdatedImages] = useState({});
    const [currentImages, setCurrentImages] = useState({});
    const [previewImage, setPreviewImage] = useState(null); // ✅ สำหรับภาพขยาย
    const [currentBeforeImages, setCurrentBeforeImages] = useState({
        front: shoe?.image_front ? `${Backend_URL}${shoe.image_front}` : null,
        back: shoe?.image_back ? `${Backend_URL}${shoe.image_back}` : null,
        left: shoe?.image_left ? `${Backend_URL}${shoe.image_left}` : null,
        right: shoe?.image_right ? `${Backend_URL}${shoe.image_right}` : null,
        top: shoe?.image_top ? `${Backend_URL}${shoe.image_top}` : null,
        bottom: shoe?.image_bottom ? `${Backend_URL}${shoe.image_bottom}` : null,
    });

    const [updatedBeforeImages, setUpdatedBeforeImages] = useState({});
    const [currentBeforeCapturePosition, setCurrentBeforeCapturePosition] = useState(null);

    const [currentCapturePosition, setCurrentCapturePosition] = useState(null);

    useEffect(() => {
        if (shoe) {
            setCurrentImages({
                front: shoe.image_after_front ? `${Backend_URL}${shoe.image_after_front}` : null,
                back: shoe.image_after_back ? `${Backend_URL}${shoe.image_after_back}` : null,
                left: shoe.image_after_left ? `${Backend_URL}${shoe.image_after_left}` : null,
                right: shoe.image_after_right ? `${Backend_URL}${shoe.image_after_right}` : null,
                top: shoe.image_after_top ? `${Backend_URL}${shoe.image_after_top}` : null,
                bottom: shoe.image_after_bottom ? `${Backend_URL}${shoe.image_after_bottom}` : null,
            });
        }
    }, [shoe]);

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
    
    const handleSaveImages = async () => {
        if (!queue_id || !shoe) {
            alert("❌ ไม่พบ queue_id หรือ shoe item");
            return;
        }

        const positions = Object.keys(updatedImages);
        if (positions.length === 0) {
            alert("❌ กรุณาเลือกรูป AFTER อย่างน้อย 1 มุมก่อนบันทึก");
            return;
        }

        const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการบันทึกรูป AFTER?");
        if (!confirm) return;

        const formData = new FormData();
        for (const position of positions) {
            const file = updatedImages[position];
            if (file instanceof File) {
                formData.append(`image_after_${position}`, file);
            }
        }

        try {
            await uploadAfterImages(queue_id, shoe.queue_item_id, formData);
            alert("✅ อัปโหลดรูป AFTER สำเร็จ!");
            fetchQueueDetail();
            onClose(); // ปิด modal
            setUpdatedImages(prev => {
                const copy = { ...prev };
                positions.forEach(pos => delete copy[pos]);
                return copy;
            });
        } catch (error) {
            console.error("🔴 Error uploading after images:", error);
            alert("❌ อัปโหลดรูปไม่สำเร็จ!");
        }
    };


    if (!show || !shoe) return null;

    return (
        <>
            <div className="shoe-detail-modal-overlay">
                <div className="shoe-detail-modal-content card p-4 shadow">
                    <h3 className="text-center">รายละเอียดรองเท้า</h3>
                    <div className="row mb-6">
                        <div className="col-md-6">
                        <p><strong>แบรนด์:</strong> {shoe.brand}</p>
                        </div>
                        <div className="col-md-6">
                        <p><strong>รุ่น:</strong> {shoe.model}</p>
                        </div>
                    </div>
                    <div className="row mb-6">
                        <div className="col-md-6">
                        <p><strong>สี:</strong> {shoe.color}</p>
                        </div>
                        <div className="col-md-6">
                        <p><strong>หมายเหตุ:</strong> {shoe.notes || "-"}</p>
                        </div>
                    </div>              
                    <h4 className="text-center">ภาพ Before & After</h4>
                    <table className="table table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>ตำแหน่ง</th>
                                <th>Before</th>
                                <th>After (เปลี่ยนรูปได้)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {["front", "back", "left", "right", "top", "bottom"].map(position => (
                                <tr key={position}>
                                    <td><strong>{position.toUpperCase()}</strong></td>
                                    <td>
                                        {shoe[`image_before_${position}`] ? (
                                            <img
                                                src={`${Backend_URL}${shoe[`image_before_${position}`]}`}
                                                alt={`before-${position}`}
                                                width="80"
                                                className="img-thumbnail"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setPreviewImage(`${Backend_URL}${shoe[`image_before_${position}`]}`)}
                                            />
                                        ) : "-"}
                                    </td>
                                    <td>
                                        {currentImages[position] ? (
                                            <div className="d-flex flex-column align-items-center">
                                                <img
                                                    src={currentImages[position]}
                                                    alt={`after-${position}`}
                                                    width="80"
                                                    className="img-thumbnail mb-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setPreviewImage(currentImages[position])}
                                                />
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => setCurrentCapturePosition(position)}
                                                >
                                                    📸 เปลี่ยนรูป
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="d-grid">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => setCurrentCapturePosition(position)}
                                                >
                                                    📸 ถ่ายใหม่
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-center mt-3">
                        
                        <button className="btn btn-danger mx-2" onClick={onClose}>
                            ❌ ปิด
                        </button>
                        <button className="btn btn-success mx-2" onClick={handleSaveImages}>
                            ✅ บันทึก
                        </button>
                    </div>
                </div>
            </div>

            <CameraCaptureModal
                show={!!currentCapturePosition}
                onClose={() => setCurrentCapturePosition(null)}
                onCapture={(file) => {
                    setCurrentImages(prev => ({
                        ...prev,
                        [currentCapturePosition]: URL.createObjectURL(file)
                    }));
                    setUpdatedImages(prev => ({
                        ...prev,
                        [currentCapturePosition]: file
                    }));
                    setCurrentCapturePosition(null);
                }}
            />

            {previewImage && (
                <div className="fullscreen-overlay" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} alt="preview" className="fullscreen-image" />
                </div>
            )}
        </>
    );
};

export default ShoeDetailModal;
