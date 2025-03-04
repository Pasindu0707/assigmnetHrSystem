import express from "express";
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployees,
    searchEmployees,
    getActivityLogs
} from "../controllers/CRUD/employeeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create an employee with profile picture upload
router.post("/", upload.single("profilePicture"), createEmployee);

// Edit an employee
router.put("/:id", updateEmployee);

// Delete an employee
router.delete("/:id", deleteEmployee);

// Get all employees
router.get("/", getEmployees);

// Search employees by name, department, or job title
router.get("/search", searchEmployees);

// Get activity logs
router.get("/logs", getActivityLogs);

export default router;
