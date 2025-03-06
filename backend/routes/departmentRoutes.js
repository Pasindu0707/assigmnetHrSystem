import express from "express";
import {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartments,
    assignEmployeeToDepartment
} from "../controllers/CRUD/department.js";

const router = express.Router();
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);
router.get("/", getDepartments);
router.post("/assign", assignEmployeeToDepartment);

export default router;
