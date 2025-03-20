import axios from 'axios';

// ✅ ตั้งค่า API Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ✅ ดึง Token จาก localStorage และใส่ใน Header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

//======================= 🏢 AUTH =======================//
// ✅ ล็อกอิน
export const loginEmployee = (email, password) => API.post("/auth/login", { email, password });
export const loginAdmin = (email, password) => API.post("/auth/admin/login", { email, password });

// ✅ จัดการผู้ใช้
export const createAdmin = (email, password) => API.post("/auth/admin/create-admin", { email, password });
export const getUsers = () => API.get("/auth/admin/get-admins");
export const deleteUser = (id) => API.delete(`/auth/admin/delete-admin/${id}`);

//======================= 📆 APPOINTMENTS =======================//
export const getAppointments = (branch_id = null) => API.get("/appointments", { params: { branch_id } });
export const createAppointment = (data) => API.post('/appointments/create', data);
export const updateAppointmentStatus = (id, status) => API.put(`/appointments/${id}/status`, { status });
export const updateAppointmentQueueId  = (id, queue_id) => API.put(`/appointments/${id}/queue-id`, { queue_id });
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

//======================= 🏷️ QUEUE =======================//
export const createQueue = async (queueData) => {
  try {
      const response = await API.post("/queue", queueData);
      //console.log("📌 Debug: API Response", response); // ✅ Debug Response
      return response.data; // ✅ Return queue_id
  } catch (error) {
      console.error("🔴 Error in createQueue API:", error);
      throw error;
  }
};
export const getQueue = (branch_id = null) => {
  //console.log("📌 Debug: Calling API with branch_id =", branch_id);
  return API.get("/queue", { params: { branch_id } });
};
export const getQueueDetail = (id) => API.get(`/queue/${id}`);
export const updateQueueStatus = (id, status, total_price) => API.put(`/queue/${id}/status`, { status, total_price });
export const deleteQueue = (id) => API.delete(`/queue/${id}`);
// ✅ อัปเดตรายละเอียดคิว (เพิ่ม-ลบ บริการ)
export const updateQueue = async (id, updatedData) => {
  console.log("📌 Debug: Sending to API", `/queue/${id}`, updatedData);
  return API.put(`/queue/${id}`, updatedData);
};
//======================= 👟 QUEUE ITEMS =======================//
// ✅ เพิ่มรองเท้าพร้อมรูปภาพ
export const addQueueItems = (queue_id, shoeData) => {
  const formData = new FormData();

  console.log("📌 Debug: FormData ก่อนส่งไป API", Object.fromEntries(shoeData.entries()));


  formData.append("queue_id", queue_id);
  formData.append("service_id", shoeData.get("service_id") || "");
  formData.append("price_per_pair", shoeData.get("price_per_pair") || "");
  formData.append("brand", shoeData.get("brand") || "");
  formData.append("model", shoeData.get("model") || "");
  formData.append("color", shoeData.get("color") || "");
  formData.append("notes", shoeData.get("notes") || "");

  if (shoeData.get("front")) formData.append("image_front", shoeData.get("front"));
  if (shoeData.get("back")) formData.append("image_back", shoeData.get("back"));
  if (shoeData.get("left")) formData.append("image_left", shoeData.get("left"));
  if (shoeData.get("right")) formData.append("image_right", shoeData.get("right"));
  if (shoeData.get("top")) formData.append("image_top", shoeData.get("top"));
  if (shoeData.get("bottom")) formData.append("image_bottom", shoeData.get("bottom"));

  console.log("📌 Debug: FormData Entries");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  return API.post(`/queue-items/${queue_id}/items`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};



// ✅ อัพโหลดรูปภาพ AFTER
export const uploadAfterImages = async (queue_id, item_id, formData) => {
  console.log("📌 Debug: Uploading images for queue_id:", queue_id, "item_id:", item_id);
  
  try {
      const res = await API.put(`/queue-items/${queue_id}/items/${item_id}/after-images`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("📌 Debug: Response จาก API", res.data);
      return res.data;
  } catch (error) {
      console.error("🔴 Error uploading after images:", error);
      throw error;
  }
};



// ✅ จัดการบริการในคิว
export const getQueueItems = (queue_id) => API.get(`/queue-items/${queue_id}`);
export const deleteQueueItem = (queue_id, queue_item_id) => API.delete(`/queue-items/${queue_id}/items/${queue_item_id}`);

// ✅ ฟังก์ชันสร้างใบแจ้งราคา
export const generateInvoice = (queue_id) => API.post(`/queue/${queue_id}/generate-invoice`);

//======================= 🛠️ SERVICES =======================//
export const getAllServices = (branch_id = null) => {
  return API.get("/services", { params: branch_id ? { branch_id } : {} });
};
export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post("/services", data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

//======================= 💳 EXPENSE =======================//
export const getAllExpenses = () => API.get("/expenses");
export const getExpenses = (queue_id) => API.get(`/expenses/${queue_id}`);
export const createExpense = (data) => API.post("/expenses", data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (queue_id, id) => API.delete(`/expenses/${queue_id}/id/${id}`);
export const getTotalExpensesByQueueId = (queue_id) => API.get(`/expenses/total/${queue_id}`);


//======================= 💳 PAYMENTS =======================//
export const createPayment = (data) => API.post("/payments", data);
export const cancelPayment = (queue_id) => API.delete(`/payments/cancel/${queue_id}`);
export const getCompletedQueues = () => API.get("/payments/completed-queues");
export const processPayment = (queue_id, additional_fees, discount, total_amount, payment_method) => {
  return API.post("/payments", { queue_id, additional_fees, discount, total_amount, payment_method });
}; 
export const getPaymentByQueueId = (queue_id) => API.get(`/payments/${queue_id}`);
export const getRevenue = () => API.get('/revenue');

//======================= 🏢 BRANCHES =======================//
export const getBranches = async () => {
  try {
    const res = await API.get("/branches");
    //console.log("📌 Debug: Branches Data", res.data);
    return res;
  } catch (error) {
    console.error("🔴 Error fetching branches:", error.response?.data || error.message);
    throw error;
  }
};
export const getBranchesById = (id) => API.get(`/branches/${id}`);
export const createBranch = (data) => API.post("/branches", data);
export const updateBranch = (id, data) => API.put(`/branches/${id}`, data);
export const deleteBranch = (id) => API.delete(`/branches/${id}`);

//======================= 👥 EMPLOYEES =======================//

export const getEmployees = (branch_id = null) => API.get("/employees", { params: { branch_id } });
export const createEmployee = (data) => API.post("/employees", data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

//======================= 👥 PAYOUTS =======================//
export const getPayouts = (params) => API.get("/payouts", { params });
export const createPayout = (data) => API.post("/payouts", data);
export const updatePayout = (id, data) => API.put(`/payouts/${id}`, data);
export const deletePayout = (id) => API.delete(`/payouts/${id}`);


//======================= 👥 Reports =======================//
export const getReports = ({ branch_id, report_type, start_date, end_date }) => {
  return API.get("/reports", {
      params: { branch_id, report_type, start_date, end_date },
  });
};