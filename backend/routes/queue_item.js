import express from "express";
import { 
  addQueueItem, 
  uploadAfterImages, 
  deleteQueueItem 
} from "../controllers/queueItemController.js";
import multer from "multer";
import crypto from 'crypto';

const router = express.Router();

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}_${sanitized}`);
  }
});

const upload = multer({ storage });

// ✅ API เพิ่มรองเท้า
router.post("/:queue_id/items", upload.fields([
  { name: "image_front", maxCount: 1 },
  { name: "image_back", maxCount: 1 },
  { name: "image_left", maxCount: 1 },
  { name: "image_right", maxCount: 1 },
  { name: "image_top", maxCount: 1 },
  { name: "image_bottom", maxCount: 1 }
]), addQueueItem);

// ✅ API อัปโหลดรูป After
router.put("/:queue_id/items/:item_id/after-images", upload.fields([
  { name: "image_after_front", maxCount: 1 },
  { name: "image_after_back", maxCount: 1 },
  { name: "image_after_left", maxCount: 1 },
  { name: "image_after_right", maxCount: 1 },
  { name: "image_after_top", maxCount: 1 },
  { name: "image_after_bottom", maxCount: 1 }
]), uploadAfterImages);



// ✅ API ลบรายการรองเท้า
router.delete("/:queue_id/items/:queue_item_id", deleteQueueItem);

export default router;
