// ✅ InvoiceModal.js พร้อมธีมใหม่ (ฟ้า/แดงอ่อน)
import React from "react";
import "./InvoiceModal.css";

const InvoiceModal = ({ show, onClose, imageBase64 }) => {
  if (!show) return null;

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=300,height=600");
    win.document.write(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 5px;
              font-family: 'Tahoma', sans-serif;
              width: 58mm;
              text-align: left;
            }
            img {
              width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${imageBase64}" />
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageBase64;
    link.download = "invoice.png";
    link.click();
  };

  return (
    <div className="invoice-modal-overlay" onClick={(e) => {
      if (e.target.classList.contains("invoice-modal-overlay")) {
        onClose();
      }
    }}>
      <div className="invoice-modal-content">
        <div className="invoice-modal-header">
          <button className="btn-theme btn-fixed" onClick={handlePrint}>🖨️</button>
          <button className="btn-theme btn-fixed" onClick={handleDownload}>⬇️</button>
          <button className="btn-theme btn-fixed close" onClick={onClose}>❌</button>
        </div>
        <div className="invoice-modal-body">
          <img src={imageBase64} alt="ใบแจ้งราคา" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
