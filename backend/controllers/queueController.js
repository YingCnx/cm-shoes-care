import Queue from "../models/Queue.js";
import Expense from "../models/expense.js";

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// ✅ 1️⃣ เพิ่มคิวใหม่
export const createQueue = async (req, res) => {
  try {
      const { customer_name, phone, location, total_pairs, delivery_date, branch_id } = req.body;

      if (!customer_name || !phone || !total_pairs || !delivery_date || !branch_id) {
          return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
      }

      const queue_id = await Queue.create({
          customer_name,
          phone,
          location,
          total_pairs,
          total_price: 0, // ✅ ให้ default เป็น 0
          delivery_date,
          branch_id
      });

      res.status(201).json({ message: "✅ คิวถูกสร้างเรียบร้อย", queue_id });
  } catch (error) {
      console.error("🔴 Error adding to queue:", error.message);
      res.status(500).json({ message: error.message });
  }
};

// ✅ 2️⃣ ดึงคิวทั้งหมด
export const getAllQueues = async (req, res) => {
  try {
    const { branch_id } = req.query; // ✅ รับค่า branch_id จาก Query Params
    const user = req.user; // ✅ ดึงข้อมูล User จาก Middleware

    //console.log("📌 Debug: User Data:", user);
    //console.log("📌 Debug: branch_id =", branch_id);

    let queues;
    if (user.isSuperAdmin) {
      queues = branch_id ? await Queue.getByBranch(branch_id) : await Queue.getAll();
    } else {
      queues = await Queue.getByBranch(user.branch_id);
    }

    ///console.log("✅ Queues Fetched:", queues);
    res.json(queues);
  } catch (error) {
    console.error("🔴 Error fetching queues:", error.message);
    res.status(500).json({ message: "❌ ไม่สามารถดึงข้อมูลคิวได้" });
  }
};





// ✅ 3️⃣ ดึงคิวตาม ID
export const getQueueById = async (req, res) => {
  try {
    const queue = await Queue.getById(req.params.id);
    if (!queue) return res.status(404).json({ message: "Queue not found" });
    res.json(queue);
  } catch (error) {
    console.error("🔴 Error fetching queue by ID:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4️⃣ อัปเดตสถานะคิว
export const updateQueueStatus = async (req, res) => {
  const { status, total_price } = req.body;
  const queueId = parseInt(req.params.id, 10);
  if (isNaN(queueId)) {
    return res.status(400).json({ message: "Invalid queue ID" });
  }
  try {
    const result = await Queue.updateStatus(queueId, status, total_price);
    res.json(result);
  } catch (error) {
    console.error("🔴 Error updating queue status:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// ✅ 5️⃣ ลบคิว
export const deleteQueue = async (req, res) => {
  try {
    const result = await Queue.delete(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("🔴 Error deleting queue:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0'); // ✅ เติม 0 ถ้าจำนวนน้อยกว่า 10
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // ✅ เดือนเริ่มจาก 0 ต้อง +1
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

//สร้างใบแจ้งราคา
export const generateInvoice = async (req, res) => {
  try {
      const queue_id = req.params.queue_id;
      //console.log("📌 Debug: queue_id =", queue_id);

      // ✅ ดึงข้อมูล Queue และ Expense จาก Database
      const queue = await Queue.getById(queue_id);
      const expenses = await Expense.getById(queue_id);

      if (!queue) {
          return res.status(404).json({ message: "ไม่พบคิวนี้ในระบบ" });
      }

      //console.log("✅ Queue Data:", queue);
      //console.log("✅ Expenses Data:", expenses);

      const totalPrice = parseFloat(queue.total_price) || 0;

      // ✅ ตรวจสอบโฟลเดอร์ `public/invoices`
      const invoiceDir = path.join(process.cwd(), 'public/invoices');
      if (!fs.existsSync(invoiceDir)) {
          fs.mkdirSync(invoiceDir, { recursive: true });
      }

      // ✅ กำหนด Path ของไฟล์ใบแจ้งราคา
      const invoicePath = path.join(invoiceDir, `invoice_${queue_id}.png`);

      // ✅ ถ้ามีไฟล์อยู่แล้วให้ลบทิ้งก่อน
      if (fs.existsSync(invoicePath)) {
          fs.unlinkSync(invoicePath);
          //console.log(`🔄 Deleted old invoice: ${invoicePath}`);
      }

      // ✅ สร้าง Canvas
      const canvas = createCanvas(600, 1000);
      const ctx = canvas.getContext('2d');

      // ✅ ตั้งค่าพื้นหลังสีขาว
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ✅ ตั้งค่าฟอนต์ภาษาไทย
      ctx.fillStyle = 'black';
      ctx.font = '28px "Noto Sans Thai"';

      // ✅ ใส่หัวข้อใบแจ้งราคา
      // ✅ ใส่หัวข้อใบแจ้งราคา
      ctx.fillText('🏠 ร้านซักเกิบแอนด์สปา', 150, 50);
      ctx.font = '24px "Noto Sans Thai"';
      ctx.fillText(`📍 สาขา: ${queue.branch_name}`, 150, 80);  // ✅ แสดงชื่อสาขา

      // ✅ รายละเอียดลูกค้า
      ctx.font = 'bold 24px "Noto Sans Thai"';
      ctx.fillText(`📜 ใบแจ้งราคา`, 50, 130);
      ctx.font = '22px "Noto Sans Thai"';
      ctx.fillText(`🆔 หมายเลขคิว: #${queue_id}`, 50, 170);
      ctx.fillText(`👤 ลูกค้า: ${queue.customer_name}`, 50, 200);
      ctx.fillText(`📞 เบอร์โทร: ${queue.phone}`, 50, 230);
      ctx.fillText(`📅 วันที่: ${formatDate(new Date())}`, 50, 260);

      // ✅ เส้นแบ่ง
      ctx.fillText(`-------------------------------------------------`, 50, 290);

      // ✅ รายการบริการ
      ctx.font = 'bold 22px "Noto Sans Thai"';
      ctx.fillText(`📌 รายการบริการ:`, 50, 320);
      ctx.font = '22px "Noto Sans Thai"';
      
      let startY = 360;
      queue.queue_items.forEach((item, index) => {
          ctx.fillText(`${index + 1}. ${item.brand} ${item.model} สี${item.color} - ${item.price_per_pair} บาท`, 50, startY);
          startY += 40;
      });

      // ✅ เส้นแบ่ง
      ctx.fillText(`-------------------------------------------------`, 50, startY + 10);

      // ✅ รายการค่าใช้จ่ายเพิ่มเติม
      ctx.font = 'bold 22px "Noto Sans Thai"';
      ctx.fillText(`💰 ค่าใช้จ่ายเพิ่มเติม:`, 50, startY + 40);
      ctx.font = '22px "Noto Sans Thai"';

      startY += 80;
      if (expenses.length > 0) {
          expenses.forEach((expense, index) => {
              ctx.fillText(`${index + 1}. ${expense.description} - ${expense.amount} บาท`, 50, startY);
              startY += 40;
          });
      } else {
          ctx.fillText("ไม่มีค่าใช้จ่ายเพิ่มเติม", 50, startY);
          startY += 40;
      }

      // ✅ รวมยอด
      ctx.font = 'bold 24px "Noto Sans Thai"';
      ctx.fillText(`💰 รวมทั้งหมด: ${totalPrice.toFixed(2)} บาท`, 50, startY + 40);

      // ✅ เพิ่มข้อความแจ้งเตือน
      ctx.fillText(`⚠️ กรุณาชำระเงินก่อนรับสินค้า`, 50, startY + 100);

      // ✅ บันทึกเป็นไฟล์ PNG (บันทึกทับไฟล์เดิม)
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(invoicePath, buffer);

      //console.log("✅ Invoice created at:", invoicePath);

      const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
      res.json({ image_url: `${BASE_URL}/public/invoices/invoice_${queue_id}.png` });

  } catch (error) {
      console.error("🔴 Error generating invoice:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้างใบแจ้งราคา" });
  }
};


