// ✅ ตรวจว่า login แล้วหรือยัง (ทั้ง employee และ superadmin)
const authMiddleware = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบ" });
  }
  next();
};

// ✅ ตรวจสิทธิ์เฉพาะ SuperAdmin เท่านั้น
export const verifySuperAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "superadmin") {
    return res.status(403).json({ message: "ต้องเป็น SuperAdmin เท่านั้น" });
  }
  next();
};

export default authMiddleware;
