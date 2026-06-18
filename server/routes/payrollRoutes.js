// routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const { createPayroll, getMyPayroll, getAllPayroll } = require('../controllers/payrollControllers');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createPayroll);
router.get('/my-slips', protect, getMyPayroll); // Self-service route
router.get('/all', protect, authorize('admin'), getAllPayroll); // Master management list

module.exports = router;