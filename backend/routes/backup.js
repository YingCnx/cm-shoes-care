import express from "express"
import { handleDatabaseBackup } from "../controllers/backupController.js"

const router = express.Router()

router.get("/backup", handleDatabaseBackup)

export default router
