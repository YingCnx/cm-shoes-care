import express from "express";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBranches);
router.get("/:id", authMiddleware, getBranchById);
router.post("/", authMiddleware, createBranch);
router.put("/:id", authMiddleware, updateBranch);
router.delete("/:id", authMiddleware, deleteBranch);

export default router;
