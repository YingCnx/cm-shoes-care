import Payment from "../models/Payment.js";
import Queue from "../models/Queue.js";

// ✅ ดึงข้อมูล Queue ที่ต้องชำระเงิน
export const getCompletedQueues = async (req, res) => {
    try {
        const queues = await Payment.getCompletedQueues();
        res.json(queues);
    } catch (error) {
        console.error("🔴 Error fetching completed queues:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ บันทึกการชำระเงิน
export const createPayment = async (req, res) => {
    try {
        const { queue_id, discount, total_amount, payment_method } = req.body;
        const payment_status = "ชำระเงินแล้ว";
        if (!queue_id || total_amount === undefined || !payment_method) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const newPayment = await Payment.create({ queue_id, discount, total_amount, payment_method, payment_status });
        await Queue.updatePaymentStatus(queue_id, payment_status);

        res.status(201).json({ message: "ชำระเงินเรียบร้อย!",payment_id: newPayment.id });
    } catch (error) {
        console.error("🔴 Error processing payment:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ ดึงข้อมูลการชำระเงินของ Queue
export const getPaymentByQueueId = async (req, res) => {
    try {
        const { queue_id } = req.params;
        //console.log("🔍 Fetching Payment for Queue ID:", queue_id);

        const payment = await Payment.getPaymentByQueueId(queue_id);
        if (!payment) {
            return res.status(404).json({ message: "❌ ไม่พบข้อมูลการชำระเงิน" });
        }

        res.json(payment);
    } catch (error) {
        console.error("🔴 Error fetching payment details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ ยกเลิกการชำระเงิน
export const cancelPayment = async (req, res) => {
    try {
        const { queue_id } = req.params;

        // ✅ ตรวจสอบว่ามีการชำระเงินหรือไม่
        const payment = await Payment.getPaymentByQueueId(queue_id);

        if (payment) {
            // ✅ ลบข้อมูลการชำระเงินใน `payments`
            await Payment.deleteByQueueId(queue_id);
        } else {
            console.warn(`⚠️ ไม่มีข้อมูลการชำระเงินสำหรับ Queue ID: ${queue_id}`);
        }

        // ✅ อัปเดต `queue.payment_status` กลับเป็นค่าเริ่มต้น เช่น "รอชำระเงิน"
        await Queue.updatePaymentStatus(queue_id, "pending");

        res.status(200).json({ message: "✅ ยกเลิกการชำระเงินเรียบร้อย!" });
    } catch (error) {
        console.error("🔴 Error cancelling payment:", error);
        res.status(500).json({ error: "❌ ไม่สามารถยกเลิกการชำระเงินได้" });
    }
};
