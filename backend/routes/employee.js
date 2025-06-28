import express from "express";
import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmployeePassword
} from "../controllers/employeeController.js";
import authMiddleware, { verifySuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllEmployees);
router.post("/", authMiddleware, createEmployee);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);
router.put("/:id/password", authMiddleware, verifySuperAdmin, updateEmployeePassword);

export default router;
