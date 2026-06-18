const { Leave, Employee } = require('../models/index');

// Helper to normalize model string status values to match frontend components expect layout
const formatLeaveResponse = (leave) => {
    const data = leave.toJSON ? leave.toJSON() : leave;
    return {
        ...data,
        type: (data.leaveType || '').toUpperCase(),
        status: (data.status || '').toUpperCase()
    };
};

// @desc    Apply for a leave request
// @route   POST /api/leaves/apply
exports.applyLeave = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const leaveRequest = await Leave.create({
      employeeId: req.user.id,
      leaveType: type.toLowerCase(), // mapping "SICK" -> "sick"
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: formatLeaveResponse(leaveRequest)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged-in employee's leave requests
// @route   GET /api/leaves/my-requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { employeeId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    const formatted = leaves.map(formatLeaveResponse);
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all leave requests across the company (Admin)
// @route   GET /api/leaves/all
// @desc    Get all leave requests across the company
// @route   GET /api/leaves/all
// @access  Private (Admin Only)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{
        model: Employee,
        // Make sure this matches the alias string ("as") used in your model association definitions
        as: 'employee', 
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // FIX: Map over items to normalize structural keys for UI reading loops
    const formattedLeaves = leaves.map(leave => {
      const data = leave.toJSON ? leave.toJSON() : leave;
      
      // Convert database enums to uppercase to match frontend layout checks ("PENDING", "APPROVED")
      const mappedLeave = {
        ...data,
        type: (data.leaveType || '').toUpperCase(),
        status: (data.status || '').toUpperCase(),
        // Assigning data.Employee to lowercase data.employee explicitly handles cases where alias fails
        employee: data.employee || data.Employee || null 
      };

      return mappedLeave;
    });

    res.status(200).json({ 
      success: true, 
      data: formattedLeaves 
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Approve or Reject employee leave request
// @route   PUT /api/leaves/:id/status
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body; // Expects 'APPROVED' or 'REJECTED'

  if (!status || !['APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
    return res.status(400).json({ message: 'Invalid status value provided.' });
  }

  try {
    const leave = await Leave.findByPk(req.params.id, {
        include: [{
            model: Employee,
            as: 'employee',
            attributes: ['id', 'firstName', 'lastName', 'email']
        }]
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave application record not found.' });
    }

    leave.status = status.toLowerCase(); // Map back to lower case enum variants
    await leave.save();

    const formatted = formatLeaveResponse(leave);
    if (formatted.Employee) formatted.employee = formatted.Employee;

    res.status(200).json({
      success: true,
      message: `Leave request has been successfully updated.`,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};