import express from "express";
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService 
} from "../controllers/servicesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllServices);
router.post("/", authMiddleware, createService);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

export default router;
