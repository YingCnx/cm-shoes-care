import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // ✅ ตัดคำว่า 'Bearer '
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("📌 Debug: Authenticated User", req.user);
    next(); // ✅ ต้องมี next() เพื่อให้ผ่านไปที่ Controller
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
