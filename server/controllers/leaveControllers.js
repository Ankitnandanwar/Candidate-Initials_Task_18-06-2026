// controllers/leaveController.js
const { Leave, Employee } = require('../models/index');

// @desc    Apply for a leave request
// @route   POST /api/leaves/apply
// @access  Private (Employee Self-Service)
exports.applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const leaveRequest = await Leave.create({
      employeeId: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged-in employee's leave requests
// @route   GET /api/leaves/my-requests
// @access  Private (Employee Self-Service)
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { employeeId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all leave requests across the company
// @route   GET /api/leaves/all
// @access  Private (Admin Only)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Approve or Reject employee leave request
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin Only)
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body; // Expects 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value provided.' });
  }

  try {
    const leave = await Leave.findByPk(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave application record not found.' });
    }

    leave.status = status;
    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request has been successfully ${status}.`,
      data: leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};