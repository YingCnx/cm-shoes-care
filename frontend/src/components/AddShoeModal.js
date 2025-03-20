import React, { useState } from "react";
import "../assets/css/bootstrap.min.css";

const AddShoeModal = ({ show, onClose, onAddShoe, services }) => {
    const [selectedService, setSelectedService] = useState('');
    const [shoeData, setShoeData] = useState({
        brand: '',
        model: '',
        color: '',
        notes: '',
        images: { front: null, back: null, left: null, right: null, top: null, bottom: null }
    });

    // ✅ ฟังก์ชันอัปโหลดรูป Before
    const handleImageUpload = (event, position) => {
        const file = event.target.files[0];
        if (file) {
            setShoeData(prevData => ({
                ...prevData,
                images: { ...prevData.images, [position]: file }
            }));
        }
    };

    // ✅ ฟังก์ชันบันทึกข้อมูลรองเท้า
    const handleSave = () => {
        // ✅ ตรวจสอบว่ากรอกข้อมูลพื้นฐานครบ
        if (!selectedService || !shoeData.brand || !shoeData.model || !shoeData.color) {
            alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        // ✅ ตรวจสอบว่ารูปภาพครบทุกมุม
        const requiredImages = ["front", "back", "left", "right", "top", "bottom"];
        const missingImages = requiredImages.filter(position => !shoeData.images[position]);
    
        if (missingImages.length > 0) {
            alert(`❌ กรุณาอัปโหลดรูปภาพให้ครบทุกมุม! ยังขาด: ${missingImages.join(", ").toUpperCase()}`);
            return;
        }
    
        // ✅ เพิ่มการยืนยันก่อนบันทึก
        if (!window.confirm("คุณต้องการเพิ่มรองเท้าคู่นี้ลงในคิวหรือไม่?")) {
            return; // 🛑 ถ้ากด "ยกเลิก" ให้หยุดทำงาน
        }
    
        onAddShoe(selectedService, shoeData); // ✅ ส่งข้อมูลไปให้ `QueueDetail`
        onClose(); // ✅ ปิด Modal หลังจากบันทึก
    };
    

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content card p-4 shadow" style={{ backgroundColor: "#fff" }}>
                <h2 className="text-center mb-3">➕ เพิ่มรองเท้า</h2>

                {/* บริการที่เลือก */}
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

                {/* ฟอร์มกรอกข้อมูลรองเท้า */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">แบรนด์รองเท้า</label>
                        <input type="text" className="form-control" placeholder="Nike, Adidas, Puma..." 
                            value={shoeData.brand} onChange={(e) => setShoeData({ ...shoeData, brand: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">รุ่นรองเท้า</label>
                        <input type="text" className="form-control" placeholder="Air Max, Superstar..." 
                            value={shoeData.model} onChange={(e) => setShoeData({ ...shoeData, model: e.target.value })} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">สี</label>
                        <input type="text" className="form-control" placeholder="สีขาว, สีดำ..." 
                            value={shoeData.color} onChange={(e) => setShoeData({ ...shoeData, color: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">หมายเหตุเพิ่มเติม</label>
                        <textarea className="form-control" rows="2" placeholder="หมายเหตุ (ถ้ามี)" 
                            value={shoeData.notes} onChange={(e) => setShoeData({ ...shoeData, notes: e.target.value })}></textarea>
                    </div>
                </div>

                {/* อัปโหลดรูป Before */}
                <h4 className="text-center mt-4">📷 อัปโหลดรูป Before</h4>
                <div className="row text-center">
                    {["front", "back", "left", "right", "top", "bottom"].map((position, index) => (
                        <div key={index} className="col-4 mb-3">
                            <label className="form-label">{`รูปภาพ ${position.toUpperCase()}`}</label>
                            <input type="file" accept="image/*" className="form-control"
                                onChange={(e) => handleImageUpload(e, position)} />
                            {shoeData.images[position] && (
                                <img src={URL.createObjectURL(shoeData.images[position])} alt={`shoe-${position}`} 
                                    className="img-thumbnail mt-2" width="100" />
                            )}
                        </div>
                    ))}
                </div>

                {/* ปุ่ม */}
                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-secondary w-45" onClick={onClose}>
                        ❌ ปิด
                    </button>
                    <button className="btn btn-success w-45" onClick={handleSave}>
                        ✅ บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddShoeModal;
