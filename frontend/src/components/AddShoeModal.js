import React, { useState } from "react";
import "../assets/css/bootstrap.min.css";
import './AddShoeModal.css';
import CameraCaptureModal from './CameraCaptureModal';

const AddShoeModal = ({ show, onClose, onAddShoe, services }) => {
    const [selectedService, setSelectedService] = useState('');
    const [shoeData, setShoeData] = useState({
        brand: '',
        model: '',
        color: '',
        notes: '',
        images: { front: null, back: null, left: null, right: null, top: null, bottom: null }
    });
    const [currentPosition, setCurrentPosition] = useState(null);

    const handleCaptureImage = (file) => {
        if (!currentPosition) return;
        setShoeData(prev => ({
            ...prev,
            images: { ...prev.images, [currentPosition]: file }
        }));
        setCurrentPosition(null);
    };

    const handleSave = () => {
        if (!selectedService || !shoeData.brand || !shoeData.model || !shoeData.color) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const requiredImages = ["front", "back", "left", "right", "top", "bottom"];
        const missing = requiredImages.filter(pos => !shoeData.images[pos]);

/*         if (missing.length > 0) {
            alert(`❌ กรุณาถ่ายรูปให้ครบทุกมุม! ยังขาด: ${missing.join(", ").toUpperCase()}`);
            return;
        } */

        if (!window.confirm("คุณต้องการเพิ่มรองเท้าคู่นี้ลงในคิวหรือไม่?")) return;

        onAddShoe(selectedService, shoeData);
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="add-shoe-modal-overlay">
                <div className="add-shoe-modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
                    <h2 className="text-center mb-3">➕ เพิ่มรองเท้า</h2>

                    <div className="mb-3">
                        <label className="form-label">เลือกบริการ</label>
                        <select className="form-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                            <option value="">-- กรุณาเลือกบริการ --</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.service_name} ({parseFloat(service.base_price || 0).toFixed(2)} บาท/คู่)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">แบรนด์</label>
                            <input type="text" className="form-control" value={shoeData.brand}
                                onChange={(e) => setShoeData({ ...shoeData, brand: e.target.value })} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">รุ่น</label>
                            <input type="text" className="form-control" value={shoeData.model}
                                onChange={(e) => setShoeData({ ...shoeData, model: e.target.value })} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">สี</label>
                            <input type="text" className="form-control" value={shoeData.color}
                                onChange={(e) => setShoeData({ ...shoeData, color: e.target.value })} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">หมายเหตุ</label>
                            <textarea className="form-control" rows="2" value={shoeData.notes}
                                onChange={(e) => setShoeData({ ...shoeData, notes: e.target.value })}></textarea>
                        </div>
                    </div>

                    <h4 className="text-center mt-4">📷 ถ่ายรูปแต่ละมุม</h4>
                    <div className="row text-center">
                        {["front", "back", "left", "right", "top", "bottom"].map((pos, idx) => (
                            <div key={idx} className="col-6 mb-4">
                                <button className="btn btn-outline-primary w-100" onClick={() => setCurrentPosition(pos)}>
                                    📷 ถ่ายรูป {pos.toUpperCase()}
                                </button>
                                {shoeData.images[pos] && (
                                    <img src={URL.createObjectURL(shoeData.images[pos])} alt={`preview-${pos}`}
                                        className="img-thumbnail mt-2" width="100" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn btn-danger" onClick={onClose}>❌ ปิด</button>
                        <button className="btn btn-success" onClick={handleSave}>✅ บันทึก</button>
                    </div>
                </div>
            </div>

            <CameraCaptureModal
                show={!!currentPosition}
                onClose={() => setCurrentPosition(null)}
                onCapture={handleCaptureImage}
            />
        </>
    );
};

export default AddShoeModal;
