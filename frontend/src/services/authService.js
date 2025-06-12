import api from "./api";

// ✅ Login Admin
export const loginAdmin = async (email, password) => {
  return await api.post("/auth/admin/login", { email, password });
};

export const loginEmployee = (email, password) => {
  return api.post("/auth/login", { email, password });
};

// ✅ Logout
export const logout = async () => {
  return await api.post("/auth/logout");
};

// ✅ ตรวจ session ยังใช้ได้หรือไม่
export const checkSession = async () => {
  try {
    const res = await api.get("/auth/check"); // ต้องมี endpoint นี้ใน backend
    return res.data; // เช่น { role: "admin", email: "..." }
  } catch (err) {
    return null;
  }
};
