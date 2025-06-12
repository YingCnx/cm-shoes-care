import QueueItem from "../models/QueueItem.js";
import Queue from "../models/Queue.js";
import pool from "../config/database.js";

import fs from 'fs';
import path from 'path';


// ✅ 1️⃣ เพิ่มรองเท้าพร้อมอัปโหลดรูป
export const addQueueItem = async (req, res) => {
  try {
    //console.log("📌 Debug: Request body:", req.body);
    //console.log("📌 Debug: Uploaded files:", req.files);

    const { queue_id } = req.params;
    const { service_id, brand, model, color, notes, price_per_pair } = req.body;
    const parsedPrice = parseFloat(price_per_pair) || 0;

    if (!queue_id || !service_id || !brand || !model || !color) {
      return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const uploadedFiles = req.files ?? {};

    const newShoe = {
      queue_id,
      service_id,
      price_per_pair: parsedPrice,
      brand,
      model,
      color,
      notes,
      image_front: uploadedFiles.image_front?.[0]?.filename ? `/uploads/${uploadedFiles.image_front[0].filename}` : null,
      image_back: uploadedFiles.image_back?.[0]?.filename ? `/uploads/${uploadedFiles.image_back[0].filename}` : null,
      image_left: uploadedFiles.image_left?.[0]?.filename ? `/uploads/${uploadedFiles.image_left[0].filename}` : null,
      image_right: uploadedFiles.image_right?.[0]?.filename ? `/uploads/${uploadedFiles.image_right[0].filename}` : null,
      image_top: uploadedFiles.image_top?.[0]?.filename ? `/uploads/${uploadedFiles.image_top[0].filename}` : null,
      image_bottom: uploadedFiles.image_bottom?.[0]?.filename ? `/uploads/${uploadedFiles.image_bottom[0].filename}` : null
    };

    //console.log("📌 Debug: Data being inserted into DB:", newShoe);
    
    await QueueItem.add(newShoe);
    await Queue.updateTotalPairsAndPrice(queue_id);
    res.status(201).json({ message: "✅ เพิ่มรองเท้าเรียบร้อย!" });

  } catch (error) {
    console.error("🔴 Error adding shoe:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ 2️⃣ อัปโหลดรูป AFTER
export const uploadAfterImages = async (req, res) => {
  try {
      //console.log("📌 Debug: Uploaded After Images:", req.files);

      const { queue_id, item_id } = req.params;

      if (!req.files || req.files.length === 0) {
          console.error("❌ ไม่มีไฟล์ถูกอัปโหลด!");
          return res.status(400).json({ message: "❌ ไม่พบไฟล์ที่อัปโหลด!" });
      }

      // ✅ แปลงชื่อไฟล์ที่อัปโหลดให้ตรงกับฐานข้อมูล
      const uploadedFiles = {};
      for (const field in req.files) {
          const file = req.files[field][0]; // เพราะแต่ละ field มี array
          if (file) {
              uploadedFiles[field] = `/uploads/${file.filename}`;
          }
      }

      ////console.log("📌 Debug: ไฟล์ที่อัปโหลดสำเร็จ", uploadedFiles);

      // ✅ ตรวจสอบว่า queue_item มีอยู่จริง
      const itemExists = await pool.query("SELECT * FROM queue_items WHERE id = $1 AND queue_id = $2", [item_id, queue_id]);
      if (itemExists.rows.length === 0) {
          return res.status(404).json({ message: "❌ ไม่พบข้อมูลรองเท้าใน Queue นี้!" });
      }

      // ✅ อัปเดตเฉพาะรูปที่มีการอัปโหลด
      await pool.query(`
          UPDATE queue_items 
          SET image_after_front = COALESCE($1, image_after_front),
              image_after_back = COALESCE($2, image_after_back),
              image_after_left = COALESCE($3, image_after_left),
              image_after_right = COALESCE($4, image_after_right),
              image_after_top = COALESCE($5, image_after_top),
              image_after_bottom = COALESCE($6, image_after_bottom)
          WHERE id = $7 AND queue_id = $8`,
          [
              uploadedFiles.image_after_front || itemExists.rows[0].image_after_front,
              uploadedFiles.image_after_back || itemExists.rows[0].image_after_back,
              uploadedFiles.image_after_left || itemExists.rows[0].image_after_left,
              uploadedFiles.image_after_right || itemExists.rows[0].image_after_right,
              uploadedFiles.image_after_top || itemExists.rows[0].image_after_top,
              uploadedFiles.image_after_bottom || itemExists.rows[0].image_after_bottom,
              item_id,
              queue_id
          ]
      );

      //console.log("📌 Debug: อัปเดตข้อมูลในฐานข้อมูลสำเร็จ!", uploadedFiles);

      res.status(200).json({ message: "✅ อัปเดตรูป After สำเร็จ!", data: uploadedFiles });

  } catch (error) {
      console.error("🔴 Error uploading After images:", error);
      res.status(500).json({ message: "❌ Server Error" });
  }
};





// ✅ 3️⃣ ลบรายการรองเท้า (Queue Item)

export const deleteQueueItem = async (req, res) => {
  try {
    const { queue_id, queue_item_id } = req.params;

    const item = await QueueItem.getById(queue_item_id);
    if (!item) {
      return res.status(404).json({ message: "❌ ไม่พบรายการรองเท้า" });
    }

    // ✅ ลบไฟล์ภาพทั้งหมด (ถ้ามี)
    const fields = [
      "image_before_front", "image_before_back", "image_before_left", "image_before_right", "image_before_top", "image_before_bottom",
      "image_after_front", "image_after_back", "image_after_left", "image_after_right", "image_after_top", "image_after_bottom"
    ];

    fields.forEach(field => {
      const imgPath = item[field];
      if (imgPath) {
        const fullPath = path.join("uploads", path.basename(imgPath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });

    await QueueItem.delete(queue_item_id);
    await Queue.updateTotalPairsAndPrice(queue_id);

    res.status(200).json({ message: "✅ ลบรายการรองเท้าและรูปภาพเรียบร้อย!" });
  } catch (error) {
    console.error("🔴 Error deleting queue item:", error);
    res.status(500).json({ message: "❌ ลบรายการรองเท้าล้มเหลว" });
  }
};
