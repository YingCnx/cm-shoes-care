import express from 'express';
import dropRoutes from './dropRoutes.js';
import otpRoutes from './otpRoutes.js';
import { checkClosed } from '../../controllers/locker/SlotController.js';

const router = express.Router();

// ✅ รวม subroutes ทั้งหมด
router.use('/drop', dropRoutes);
router.use('/otp', otpRoutes);

// ✅ ฟีเจอร์แยกสำหรับเช็คสถานะตู้
router.get('/slot/checkClosed/:slotNumber', checkClosed);

export default router;
