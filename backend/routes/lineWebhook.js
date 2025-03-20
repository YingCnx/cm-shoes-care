import express from "express";
import axios from "axios";
import { getQueueStatusByPhone, getQueueStatusById } from "../models/Queue.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// ✅ รับ Webhook จาก LINE
router.post("/webhook", async (req, res) => {
    const events = req.body.events;

    for (const event of events) {
        if (event.type === "message" && event.message.type === "text") {
            const userMessage = event.message.text.trim();
            const replyToken = event.replyToken;
            let responseMessage = "❌ ไม่พบข้อมูล กรุณาตรวจสอบเบอร์โทรหรือรหัสคิว";

            if (/^\d{10}$/.test(userMessage)) { // ถ้าส่งเป็นเบอร์โทร
                const queueStatus = await getQueueStatusByPhone(userMessage);
                if (queueStatus) responseMessage = `📋 คิวของคุณ: ${queueStatus}`;
            } else if (/^\d+$/.test(userMessage)) { // ถ้าส่งเป็นรหัสคิว
                const queueStatus = await getQueueStatusById(userMessage);
                if (queueStatus) responseMessage = `📋 คิวของคุณ: ${queueStatus}`;
            }

            // ✅ ส่งข้อความตอบกลับไปที่ LINE
            await axios.post("https://api.line.me/v2/bot/message/reply", {
                replyToken,
                messages: [{ type: "text", text: responseMessage }]
            }, {
                headers: { "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`, "Content-Type": "application/json" }
            });
        }
    }
    res.sendStatus(200);
});

export default router;
