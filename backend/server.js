import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// ✅ นำเข้า Routes
import authRoutes from './routes/auth.js';
import appointmentsRoutes from './routes/appointments.js';
import queueRoutes from './routes/queue.js';
import queueItemRoutes from './routes/queue_item.js'; 
import serviceRoutes from './routes/services.js';
import paymentRoutes from './routes/payment.js';
import employeeRoutes from './routes/employee.js';
import branchesRoutes from './routes/branch.js';
import expenseRoutes from './routes/expense.js';
import reportRoutes from "./routes/report.js";
import payoutRoutes from "./routes/payout.js";
import lineWebhook from './routes/lineWebhook.js';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// ✅ จัดการ Static Files (`uploads` และ `public`)
const setCORSHeaders = (res, path) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
};

app.use("/uploads", express.static("uploads", { setHeaders: setCORSHeaders }));
app.use("/public", express.static("public", { setHeaders: setCORSHeaders }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/queue-items', queueItemRoutes);  
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/branches', branchesRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/reports", reportRoutes);
app.use('/line', lineWebhook);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Handle Uncaught Errors
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Rejection:', err);
});
