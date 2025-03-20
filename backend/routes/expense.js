import express from "express";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  getTotalExpensesByQueue,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:queue_id", authMiddleware, getExpenses);
router.post("/", authMiddleware, createExpense);
router.delete("/:queue_id/id/:id", authMiddleware, deleteExpense);
router.get("/total/:queue_id", authMiddleware, getTotalExpensesByQueue);

export default router;
