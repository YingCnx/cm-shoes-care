import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
  updateAppointmentQueueId,
  getAppointmentsForQueue
} from "../controllers/appointmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAppointments);
router.get("/forqueue", authMiddleware, getAppointmentsForQueue);
router.post("/create", authMiddleware, createAppointment);
router.put("/:id/status", authMiddleware, updateAppointmentStatus);
router.put("/:id", authMiddleware, updateAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);
router.put("/:id/queue-id", authMiddleware, updateAppointmentQueueId);


export default router;
