import express from 'express';
import { checkClosed } from '../../controllers/locker/SlotController.js';

const router = express.Router();
router.get('/checkClosed/:slotNumber', checkClosed);

export default router;