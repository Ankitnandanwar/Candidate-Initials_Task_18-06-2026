// controllers/attendanceController.js
const { Attendance, Employee } = require('../models/index');
const { Op } = require('sequelize');

// @desc    Clock-in for the day
// @route   POST /api/attendance/check-in
// @access  Private (Employee/Admin)
exports.checkIn = async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

  try {
    // Check if user already clocked in today
    const alreadyCheckedIn = await Attendance.findOne({
      where: { employeeId, date: today }
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: 'You have already checked in for today.' });
    }

    // Determine status (e.g., Late if check-in is after 09:15:00)
    let status = 'present';
    if (currentTime > '09:15:00') {
      status = 'late';
    }

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkIn: currentTime,
      status
    });

    res.status(201).json({ success: true, message: 'Clocked in successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Clock-out for the day
// @route   PUT /api/attendance/check-out
// @access  Private (Employee/Admin)
exports.checkOut = async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0];

  try {
    const attendance = await Attendance.findOne({
      where: { employeeId, date: today }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'You must check-in first before checking out.' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'You have already checked out for today.' });
    }

    attendance.checkOut = currentTime;
    await attendance.save();

    res.status(200).json({ success: true, message: 'Clocked out successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get personal attendance records
// @route   GET /api/attendance/my-logs
// @access  Private (Employee Self-Service)
exports.getMyAttendance = async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      where: { employeeId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all attendance records (Dashboard Analytics)
// @route   GET /api/attendance/all
// @access  Private (Admin Only)
exports.getAllAttendance = async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};