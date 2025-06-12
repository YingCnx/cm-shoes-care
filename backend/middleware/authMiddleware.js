import jwt from "jsonwebtoken";

// ✅ ตรวจแค่ Token ว่า login แล้ว
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ ตรวจสิทธิ์เฉพาะ SuperAdmin
export const verifySuperAdmin = (req, res, next) => {
  if (!req.user?.role || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "ต้องเป็น SuperAdmin เท่านั้น" });
  }
  next();
};

export default authMiddleware;
