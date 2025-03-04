import express from "express";
import {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartments,
    assignEmployeeToDepartment
} from "../controllers/CRUD/department.js";

const router = express.Router();

// Create a new department
router.post("/", createDepartment);

// Edit a department
router.put("/:id", updateDepartment);

// Delete a department (Only if no employees are assigned)
router.delete("/:id", deleteDepartment);

// Get all departments
router.get("/", getDepartments);

// Assign an employee to a department
router.post("/assign", assignEmployeeToDepartment);

export default router;
