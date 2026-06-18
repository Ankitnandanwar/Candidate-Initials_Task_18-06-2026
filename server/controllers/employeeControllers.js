const { Employee } = require('../models/index');
const bcrypt = require('bcryptjs');

// @desc    Get all employees (with optional department filter)
// @route   GET /api/employees
const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const whereClause = {};
        
        if (department) {
            whereClause.department = department;
        }

        const employees = await Employee.findAll({ where: whereClause });
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
    try {
        const { email, password, firstName, lastName, department, position, phone, joinDate, bio, basicSalary, allowances, deductions, role } = req.body;

        const employeeExists = await Employee.findOne({ where: { email } });
        if (employeeExists) {
            return res.status(400).json({ success: false, message: 'Employee email already exists' });
        }

        // Hash temporary password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await Employee.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            department,
            position,
            phone,
            joinDate,
            bio,
            basicSalary,
            allowances,
            deductions,
            role: role || 'EMPLOYEE',
            status: 'active'
        });

        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // If password is being changed, hash it
        if (req.body.password && req.body.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } else {
            delete req.body.password; // Don't overwrite with empty string
        }

        await employee.update(req.body);
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete employee (Soft delete or Hard delete based on your preference)
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // If you prefer soft delete matching your UI's item.isDeleted flag:
        await employee.update({ isDeleted: true, status: 'inactive' });
        
        // OR for hard database removal, uncomment below:
        // await employee.destroy();

        res.status(200).json({ success: true, message: 'Employee removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};