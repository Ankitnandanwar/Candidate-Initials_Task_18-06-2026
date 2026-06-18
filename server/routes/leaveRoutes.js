// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveControllers');
const { protect, authorize } = require('../middleware/auth');

// Employee operations
router.post('/apply', protect, applyLeave);
router.get('/my-requests', protect, getMyLeaves);

// Admin / HR operations
router.get('/all', protect, authorize('admin'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

module.exports = router;