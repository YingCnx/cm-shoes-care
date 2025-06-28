import express from "express";
import {
  getBranches,
  getAllBranchesPublic,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
   
} from "../controllers/branchController.js";
import authMiddleware, { verifySuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBranches);
router.get("/public", getAllBranchesPublic);
router.get("/:id", authMiddleware, getBranchById);
router.post("/", authMiddleware,verifySuperAdmin, createBranch);
router.put("/:id", authMiddleware,verifySuperAdmin, updateBranch);
router.delete("/:id", authMiddleware,verifySuperAdmin, deleteBranch);

export default router;
