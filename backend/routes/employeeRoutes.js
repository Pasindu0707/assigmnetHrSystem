import express from "express";
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployees,
    searchEmployees,
    getActivityLogs
} from "../controllers/CRUD/employeeController.js";

const router = express.Router();
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.get("/", getEmployees);
router.get("/search", searchEmployees);
router.get("/logs", getActivityLogs);

export default router;
