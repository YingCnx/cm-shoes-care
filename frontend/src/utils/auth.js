import { jwtDecode } from "jwt-decode"; 

// ✅ อ่าน cookie ตามชื่อที่ระบุ
export const getCookie = (name) => {
  const cookieStr = document.cookie;
  const cookies = cookieStr.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

// ✅ ตรวจ JWT หมดอายุจาก cookie
export const isTokenExpired = () => {
  try {
    const token = getCookie("token");
    if (!token) return true;

    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
};
