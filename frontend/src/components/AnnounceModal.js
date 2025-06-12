import React from 'react';
import './AnnounceModal.css';

const AnnounceModal = ({ show, onClose, title, appointments }) => {
  if (!show) return null;

  return (
    <div className="announce-modal-overlay" onClick={onClose}>
      <div className="announce-modal" onClick={(e) => e.stopPropagation()}>
        <div className="announce-modal-header">
          <h5 className="announce-modal-title">📢 {title || 'ประกาศนัดหมายวันนี้'}</h5>
          <button className="announce-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="announce-modal-body">
          {appointments?.length > 0 ? (
            <ul style={{ textAlign: 'left' }}>
              {appointments.map((appt, idx) => (
                <li key={idx}>
                  <strong>{appt.customer_name}</strong> เวลา {appt.appointment_time?.slice(0,5)} น. ที่ {appt.location}
                </li>
              ))}
            </ul>
          ) : (
            <p>ไม่มีนัดหมายวันนี้</p>
          )}
        </div>
        <div className="announce-modal-footer">
          <button className="announce-modal-button" onClick={onClose}>รับทราบ</button>
        </div>
      </div>
    </div>
  );
};

export default AnnounceModal; // ✅ สำคัญมาก
