import Employee from "../../models/Employee.js";
import Department from "../../models/Department.js";
import ActivityLog from "../../models/ActivityLog.js";

// Create a new employee
export const createEmployee = async (req, res) => {
    try {
        const { name, job_title, department, status } = req.body;

        // Validate department
        const departmentExists = await Department.findById(department);
        if (!departmentExists) {
            return res.status(404).json({ error: "Department not found" });
        }

        // Create employee (without profile picture)
        const employee = new Employee({ name, job_title, department, status });
        await employee.save();

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit employee details
export const updateEmployee = async (req, res) => {
    try {
        const oldEmployee = await Employee.findById(req.params.id);
        if (!oldEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Log changes in the activity log
        const logEntry = new ActivityLog({
            employee: oldEmployee._id,
            action: "Updated",
            changes: {
                before: oldEmployee,
                after: updatedEmployee
            }
        });
        await logEntry.save();

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an employee & log deletion
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        await Employee.findByIdAndDelete(req.params.id);

        // Log deletion
        const logEntry = new ActivityLog({
            employee: employee._id,
            action: "Deleted",
            changes: { before: employee }
        });
        await logEntry.save();

        res.json({ message: "Employee removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate("department");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search for employees by name, department, or job title
export const searchEmployees = async (req, res) => {
    try {
        const { query } = req.query;
        const employees = await Employee.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { job_title: { $regex: query, $options: "i" } },
            ]
        }).populate("department");

        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all activity logs
export const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().populate("employee", "name job_title");
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
