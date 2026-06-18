// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance, getAllAttendance } = require('../controllers/attendanceControllers');
const { protect, authorize } = require('../middleware/auth');

router.post('/check-in', protect, checkIn);
router.put('/check-out', protect, checkOut);
router.get('/my-logs', protect, getMyAttendance); // Employee viewing self data [cite: 44]
router.get('/all', protect, authorize('admin'), getAllAttendance); // HR viewing all data [cite: 36]

module.exports = router;