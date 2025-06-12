// src/components/CameraCaptureModal.js
import React, { useRef, useEffect } from 'react';
import './CameraCaptureModal.css';

const CameraCaptureModal = ({ show, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (show) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                })
                .catch(err => {
                    alert("❌ ไม่สามารถเปิดกล้องได้");
                    onClose();
                });
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [show]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
            onCapture(file);
            onClose();
        }, 'image/jpeg');
    };

    if (!show) return null;

    return (
        <div className="camera-modal-backdrop">
            <div className="camera-modal-body">
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="mt-2">
                    <button className="btn btn-success me-2" onClick={handleCapture}>📸 ถ่ายรูป</button>
                    <button className="btn btn-secondary" onClick={onClose}>❌ ยกเลิก</button>
                </div>
            </div>
        </div>
    );
};

export default CameraCaptureModal;
