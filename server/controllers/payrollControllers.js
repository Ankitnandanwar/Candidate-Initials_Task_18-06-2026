// controllers/payrollController.js
const { Payroll, Employee } = require('../models/index');

// @desc    Generate/Create payroll slip for an employee
// @route   POST /api/payroll
// @access  Private (Admin Only)
exports.createPayroll = async (req, res) => {
  const { employeeId, month, baseSalary, allowances, deductions, paymentStatus } = req.body;

  if (!employeeId || !month || !baseSalary) {
    return res.status(400).json({ message: 'Please provide employeeId, month, and baseSalary.' });
  }

  try {
    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // Business Logic Calculation: netSalary = base + allowances - deductions
    const base = parseFloat(baseSalary);
    const allow = parseFloat(allowances || 0);
    const deduct = parseFloat(deductions || 0);
    const netSalary = base + allow - deduct;

    const payroll = await Payroll.create({
      employeeId,
      month,
      baseSalary: base,
      allowances: allow,
      deductions: deduct,
      netSalary,
      paymentStatus: paymentStatus || 'pending',
      paymentDate: paymentStatus === 'paid' ? new Date() : null
    });

    res.status(201).json({ success: true, message: 'Payroll slip generated successfully.', data: payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get personal salary slips
// @route   GET /api/payroll/my-slips
// @access  Private (Employee Self-Service)
exports.getMyPayroll = async (req, res) => {
  try {
    const slips = await Payroll.findAll({
      where: { employeeId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all payroll history records
// @route   GET /api/payroll/all
// @access  Private (Admin Only)
exports.getAllPayroll = async (req, res) => {
  try {
    const history = await Payroll.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};