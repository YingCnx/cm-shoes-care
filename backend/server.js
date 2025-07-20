import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import session from 'express-session';
import sharedSession from 'express-socket.io-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Session Middleware ใช้ร่วมทั้ง Express และ Socket
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ✅ เปลี่ยนเป็น true ถ้าใช้ HTTPS จริง
    maxAge: 8 * 60 * 60 * 1000, // 8 ชม.
    httpOnly: true,
    sameSite: 'Lax',
  }
});
app.use(sessionMiddleware); // ✅ ใช้กับ express

// ✅ Logging
app.use((req, res, next) => {
  console.log(`🌍 IP: ${req.ip}`);
  console.log(`📝 Headers:`, req.headers);
  next();
});

// ✅ Middleware พื้นฐาน
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// ✅ CORS แบบกำหนด Origin
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://app.suggerb.com",
  "https://app.suggerb.com",
  "http://locker.suggerb.com",
  "http://149.56.87.48",
  "http://203.172.89.175"
];
const credentialOrigins = allowedOrigins;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  if (credentialOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type", "Authorization", "X-Requested-With", "X-Locker-ID", "X-Locker-Secret"
  ].join(", "));
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Static
const setCORSHeaders = (res, path) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
};
app.use("/uploads", express.static("uploads", { setHeaders: setCORSHeaders }));
app.use("/public", express.static("public", { setHeaders: setCORSHeaders }));

// ✅ Routes
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
import notificationRoutes from './routes/notificationRoutes.js';
import adminLockerRoutes from "./routes/lockerRoutes.js";
import lockerRoutes from './routes/locker/index.js';
import statusRoutes from "./routes/statusRoutes.js";

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
app.use('/api/notifications', notificationRoutes);
app.use("/api/adminLocker", adminLockerRoutes);
app.use('/api/locker', lockerRoutes);
app.use("/api/statuses", statusRoutes);

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
let server;
if (fs.existsSync("./certs/key.pem") && fs.existsSync("./certs/cert.pem")) {
  const httpsOptions = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };
  server = https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server on port ${PORT}`);
  });
} else {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP Server on port ${PORT}`);
  });
}

// ✅ Uncaught Errors
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Rejection:', err);
});

// ✅ Socket.IO พร้อม session
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

io.on('connection', (socket) => {
  const user = socket.handshake.session?.user;

  if (!user || !user.branch_id) {
    console.log(`❌ Blocked socket: ${socket.id}`);
    return socket.disconnect();
  }

  const room = `branch-${user.branch_id}`;
  socket.join(room);
  console.log(`✅ ${user.username || 'Unknown'} joined ${room}`);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });

  socket.on('ping-server', () => {
    socket.emit('pong-client', { message: 'pong from server!' });
  });
});

// ✅ ให้ใช้ได้ใน controller
app.set('io', io);

// ✅ ทดสอบส่ง
app.get('/test-io', (req, res) => {
  const io = req.app.get('io');
  const user = req.session?.user;
  if (!user?.branch_id) return res.status(401).send('Unauthorized');

  const data = {
    id: Date.now(),
    type: 'info',
    message: '🔔 แจ้งเตือนทดสอบ',
  };

  io.to(`branch-${user.branch_id}`).emit('new-notification', data);
  res.send('✅ แจ้งเตือนส่งไปยัง branch-' + user.branch_id);
});
