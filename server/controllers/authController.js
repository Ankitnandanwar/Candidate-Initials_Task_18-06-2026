// controllers/authController.js
const jwt = require('jsonwebtoken');
// Require directly from the index map file to use associations
const { Employee } = require('../models/index');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

exports.registerEmployee = async (req, res) => {
  const { firstName, lastName, email, password, role, departmentId, phone, emergencyContact } = req.body;

  try {
    // Standardize email checks to lowercase
    const employeeExists = await Employee.findOne({ where: { email: email.toLowerCase() } });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || 'employee',
      departmentId,
      phone,
      emergencyContact
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and password' });
  }

  try {
    const employee = await Employee.findOne({ where: { email: email.toLowerCase() } });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // FIX: Check bcrypt first. If it fails, fallback to a direct text check for manual Workbench seeds
    const isBcryptMatch = await employee.matchPassword(password);
    const isDirectMatch = (password === employee.password);

    if (isBcryptMatch || isDirectMatch) {
      res.status(200).json({
        success: true,
        token: generateToken(employee.id),
        user: {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};