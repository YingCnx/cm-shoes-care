import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";

const CameraCapture = forwardRef(({ onCapture, label }, ref) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    useImperativeHandle(ref, () => ({
        stopCamera: () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
    }));

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(s => {
                videoRef.current.srcObject = s;
                setStream(s);
            })
            .catch(err => console.error("ไม่สามารถเปิดกล้อง:", err));

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            const file = new File([blob], `${label}.jpg`, { type: "image/jpeg" });
            onCapture(file);
        }, "image/jpeg");
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <video ref={videoRef} autoPlay playsInline width="100%" style={{ border: "1px solid #ccc" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button type="button" className="btn btn-primary mt-2" onClick={captureImage}>
                📸 ถ่ายรูป
            </button>
        </div>
    );
});

export default CameraCapture;
