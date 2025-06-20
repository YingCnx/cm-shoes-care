import express from 'express';
import dropRoutes from './dropRoutes.js';
import otpRoutes from './otpRoutes.js';
import { checkClosed, startDeposit, findAvailableSlot } from '../../controllers/locker/SlotController.js';

const router = express.Router();

// ✅ รวม subroutes ทั้งหมด
router.use('/drop', dropRoutes);
router.use('/otp', otpRoutes);

// ✅ ฟีเจอร์แยกสำหรับเช็คสถานะตู้
router.get('/slot/checkClosed/:slotId', checkClosed);
router.post('/deposit/start', startDeposit);
router.get('/slot/findAvailableSlot/:total_pairs', findAvailableSlot);
export default router;
