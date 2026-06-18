// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerEmployee, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public route for login
router.post('/login', login);

// Admin-only route to register new employees/users
router.post('/register', protect, authorize('admin'), registerEmployee);

// Self-service profile routing for logged-in users
router.get('/me', protect, getMe);

module.exports = router;