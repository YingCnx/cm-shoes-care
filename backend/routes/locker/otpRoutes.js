// routes/locker/otpRoutes.js
import express from 'express'; // ✅ ใช้ express ให้ถูก path
import { sendOTP, verifyOTP } from '../../controllers/locker/OtpController.js';
import { verifyLocker } from '../../middleware/verifyLocker.js';

const router = express.Router();

router.post('/send', verifyLocker, sendOTP);
router.post('/verify', verifyLocker, verifyOTP);

export default router;
