// middleware/verifyLocker.js
const ALLOWED_LOCKERS = {
  LKR010: 'abc123XYZ',
};

export const verifyLocker = (req, res, next) => {
  const lockerId = req.headers['x-locker-id'];
  const lockerSecret = req.headers['x-locker-secret'];

  if (!lockerId || !lockerSecret) {
    return res.status(401).json({ error: 'ไม่พบข้อมูลตู้' });
  }

  const expectedSecret = ALLOWED_LOCKERS[lockerId];
  if (!expectedSecret || lockerSecret !== expectedSecret) {
    return res.status(401).json({ error: 'ตู้ไม่ได้รับอนุญาต' });
  }

  req.locker_id = lockerId;
  next();
};