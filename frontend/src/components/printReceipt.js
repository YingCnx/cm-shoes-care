export const printReceipt = (payment_id,queue, serviceSummary, discount, totalAmountAfterDiscount, paymentMethod) => {
    const receiptWindow = window.open("", "_blank");

    // ✅ กำหนดสไตล์ใบเสร็จ
    receiptWindow.document.write(`
        <html>
        <head>
            <title>ใบเสร็จรับเงิน - ร้านซักเกิบแอนด์สปา เชียงใหม่</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                .receipt-container { width: 350px; margin: auto; padding: 20px; border: 1px solid #000; text-align: left; }
                h2, h3 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #000; padding: 5px; text-align: center; }
                .text-right { text-align: right; }
                .total-section { font-size: 1.2em; font-weight: bold; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <h2>ร้านซักเกิบแอนด์สปา เชียงใหม่</h2>
                <p><strong>ใบเสร็จรับเงิน</strong></p>
                <p>เลขที่เอกสาร: <strong>#${payment_id}</strong></p>
                <p>วันที่ออกใบเสร็จ: <strong>${new Date().toLocaleDateString()}</strong></p>
                <p>ลูกค้า: <strong>${queue.customer_name}</strong></p>
                <p>เบอร์โทร: <strong>${queue.phone}</strong></p>
                <p>สถานที่: <strong>${queue.location}</strong></p>

                <h3>📝 รายการบริการ</h3>
                <table>
                    <thead>
                        <tr>
                            <th>บริการ</th>
                            <th>จำนวน</th>
                            <th>ราคารวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${serviceSummary.map(service => `
                            <tr>
                                <td>${service.service_name}</td>
                                <td>${service.total_pairs}</td>
                                <td>${Number(service.total_price).toFixed(2)} ฿</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <h3>💰 สรุปยอดชำระ</h3>
                <p class="text-right">ส่วนลด: <strong>- ${Number(discount).toFixed(2)} ฿</strong></p>
                <p class="total-section text-right">ยอดรวมสุทธิ: <strong>${Number(totalAmountAfterDiscount).toFixed(2)} ฿</strong></p>
                <p class="text-right">วิธีชำระเงิน: <strong>${paymentMethod}</strong></p>
                
                <h3 style="text-align: center;">🙏 ขอบคุณที่ใช้บริการ</h3>
            </div>
            <script>
                window.print();
                setTimeout(() => window.close(), 1000);
            </script>
        </body>
        </html>
    `);

    receiptWindow.document.close();
};
