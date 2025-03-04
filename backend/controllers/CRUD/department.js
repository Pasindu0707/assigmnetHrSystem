import Department from "../../models/Department.js";
import Employee from "../../models/Employee.js";

// Create a new department
export const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = new Department({ name, description });
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit department details
export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!department) {
            return res.status(404).json({ error: "Department not found" });
        }

        res.json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a department
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ error: "Department not found" });
        }

        // Check if employees are assigned to this department
        const employees = await Employee.find({ department: department._id });
        if (employees.length > 0) {
            return res.status(400).json({ error: "Cannot delete department with assigned employees" });
        }

        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: "Department removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all departments
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign an employee to a department
export const assignEmployeeToDepartment = async (req, res) => {
    try {
        const { employeeId, departmentId } = req.body;

        const department = await Department.findById(departmentId);
        const employee = await Employee.findById(employeeId);

        if (!department || !employee) {
            return res.status(404).json({ error: "Department or Employee not found" });
        }

        employee.department = departmentId;
        await employee.save();

        res.json({ message: "Employee assigned to department successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
