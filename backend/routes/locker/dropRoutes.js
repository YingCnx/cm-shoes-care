// routes/locker/dropRoutes.js
import express from 'express';
import { createLockerDrop } from '../../controllers/dropController.js';
import { verifyLocker } from '../../middleware/verifyLocker.js';

const router = express.Router();

router.post('/', verifyLocker, createLockerDrop);

export default router;