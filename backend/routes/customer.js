import express from "express";
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer,checkDuplicatePhone  } from "../controllers/customerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCustomer);
router.get("/", authMiddleware, getCustomers);
router.get('/check-duplicate',authMiddleware, checkDuplicatePhone);
router.get("/:id(\\d+)", authMiddleware, getCustomerById);
router.put("/:id", authMiddleware, updateCustomer);
router.delete("/:id", authMiddleware, deleteCustomer);



export default router;
