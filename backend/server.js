import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import cookieParser from 'cookie-parser';

// ✅ โหลด environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Logging Request ก่อน routing
app.use((req, res, next) => {
  console.log(`🌍 Client IP: ${req.ip}`);
  console.log(`📝 Headers:`, req.headers);
  next();
});

// ✅ Middleware พื้นฐาน
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",         // Frontend หลัก
  "http://localhost:5173",         // Smart Locker Frontend
  "http://app.suggerb.com",
  "https://app.suggerb.com",
  "http://locker.suggerb.com",
  "http://149.56.87.48"
];

const credentialOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://app.suggerb.com",
  "https://app.suggerb.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  if (credentialOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Locker-ID",
    "X-Locker-Secret"
  ].join(", "));

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ โหลด static files และจัดการ Cross-Origin Policy
const setCORSHeaders = (res, path) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
};


app.use("/uploads", express.static("uploads", { setHeaders: setCORSHeaders }));
app.use("/public", express.static("public", { setHeaders: setCORSHeaders }));

// ✅ นำเข้า Routes
import authRoutes from './routes/auth.js';
import appointmentsRoutes from './routes/appointments.js';
import queueRoutes from './routes/queue.js';
import queueItemRoutes from './routes/queue_item.js'; 
import serviceRoutes from './routes/services.js';
import paymentRoutes from './routes/payment.js';
import employeeRoutes from './routes/employee.js';
import branchesRoutes from './routes/branch.js';
import customerRoutes from "./routes/customer.js";
import expenseRoutes from './routes/expense.js';
import reportRoutes from "./routes/report.js";
import payoutRoutes from "./routes/payout.js";
import backupRoutes from "./routes/backup.js";
import adminLockerRoutes  from "./routes/lockerRoutes.js";
import lockerRoutes from './routes/locker/index.js';

// ✅ เชื่อม Route หลัก
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/queue-items', queueItemRoutes);  
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/branches', branchesRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/adminLocker", adminLockerRoutes );
app.use('/api/locker', lockerRoutes);



// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ รองรับ HTTPS และ fallback ไป HTTP ถ้า cert ไม่มี
if (fs.existsSync("./certs/key.pem") && fs.existsSync("./certs/cert.pem")) {
  const httpsOptions = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP Server running on port ${PORT}`);
  });
}

// ✅ จัดการ Error ที่ไม่ได้ catch
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Rejection:', err);
});
