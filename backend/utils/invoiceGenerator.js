import fs from 'fs';
import path from 'path';

const generateInvoiceImage = async (queue) => {
    try {
        // ✅ กำหนด path ของไฟล์
        const invoiceDir = path.join(process.cwd(), 'public/invoices'); // ✅ ตรวจสอบโฟลเดอร์
        const invoicePath = path.join(invoiceDir, `invoice_${queue._id}.jpg`);

        // ✅ สร้างโฟลเดอร์ invoices ถ้ายังไม่มี
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }

        console.log("📌 Creating invoice at:", invoicePath);
        // 📌 จำลองการสร้างไฟล์ (ควรเปลี่ยนเป็นโค้ดที่สร้างรูปจริง)
        fs.writeFileSync(invoicePath, "This is a sample invoice image");
        console.log("✅ Invoice created successfully!");
        return `/public/invoices/invoice_${queue._id}.jpg`;
    } catch (error) {
        console.error("🔴 Error creating invoice image:", error);
        throw error;
    }
};

export default generateInvoiceImage;
