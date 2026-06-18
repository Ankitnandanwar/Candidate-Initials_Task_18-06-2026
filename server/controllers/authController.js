// controllers/authController.js
const jwt = require('jsonwebtoken');
const { Employee } = require('../models/index');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};


exports.registerEmployee = async (req, res) => {
  const { firstName, lastName, email, password, role, departmentId, phone, emergencyContact } = req.body;

  try {
    const employeeExists = await Employee.findOne({ where: { email } });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password,
      role,
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

  // Form Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and password' });
  }

  try {
    // Find employee by email
    const employee = await Employee.findOne({ where: { email } });

    // Verify user and match hashed password
    if (employee && (await employee.matchPassword(password))) {
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
    // req.user is populated by the 'protect' middleware
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};