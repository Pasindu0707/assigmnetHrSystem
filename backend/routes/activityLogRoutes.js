import express from "express";
import { getActivityLogs } from "../controllers/CRUD/employeeController.js";

const router = express.Router();

router.get("/", getActivityLogs);

export default router;
