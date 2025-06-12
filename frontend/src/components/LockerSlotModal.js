import React, { useEffect, useState } from 'react';
import { getLockerSlots, updateSlotStatus } from '../services/api';
import { Modal, Button, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';

const statusOptions = [
  'available',
  'occupied',
  'pending_pickup',
  'locked',
  'maintenance',
  'reserved'
];

const statusLabels = {
  available: 'ว่าง',
  occupied: 'มีของอยู่',
  pending_pickup: 'รอลูกค้ามารับ',
  locked: 'ล็อก',
  maintenance: 'ปิดปรับปรุง',
  reserved: 'ถูกจองไว้',
};

const statusStyles = {
  available: 'bg-success',
  occupied: 'bg-danger',
  pending_pickup: 'bg-warning text-dark',
  locked: 'bg-dark',
  maintenance: 'bg-primary',
  reserved: 'bg-secondary',
};

const LockerSlotModal = ({ show, lockerId, onClose }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (show && lockerId) {
      fetchSlots();
    }
  }, [show, lockerId]);

  const fetchSlots = async () => {
    try {
      const res = await getLockerSlots(lockerId);
      setSlots(res.data);
    } catch (err) {
      console.error("🔴 Error loading slots:", err);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setNewStatus(slot.status);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateSlotStatus(selectedSlot.id, newStatus);
      setSelectedSlot(null);
      fetchSlots();
    } catch (err) {
      alert("❌ ไม่สามารถอัปเดตสถานะได้");
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>จัดการช่อง Locker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          {slots.map((slot) => (
            <div key={slot.id} className="col-4 col-md-3 col-lg-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>
                  #{slot.slot_number} ({statusLabels[slot.status]})
                </Tooltip>}
              >
                <div
                  className={`card text-white text-center shadow-sm ${statusStyles[slot.status]}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSlotClick(slot)}
                >
                  <div className="card-body p-2">
                    <strong>#{slot.slot_number}</strong>
                    <div style={{ fontSize: '0.8em' }}>{statusLabels[slot.status]}</div>
                  </div>
                </div>
              </OverlayTrigger>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>ปิด</Button>
      </Modal.Footer>

      {/* ✅ Modal แก้ไขสถานะ */}
      {selectedSlot && (
        <Modal show centered onHide={() => setSelectedSlot(null)}>
          <Modal.Header closeButton>
            <Modal.Title>แก้ไขสถานะช่อง #{selectedSlot.slot_number}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedSlot(null)}>ยกเลิก</Button>
            <Button variant="primary" onClick={handleStatusUpdate}>บันทึก</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Modal>
  );
};

export default LockerSlotModal;
