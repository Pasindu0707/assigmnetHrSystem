import express from "express";
import { getActivityLogs } from "../controllers/CRUD/employeeController.js";

const router = express.Router();

// Get all activity logs
router.get("/", getActivityLogs);

export default router;
