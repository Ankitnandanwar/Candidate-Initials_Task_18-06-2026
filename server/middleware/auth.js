// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Employee } = require('../models/index');

// Protect routes - Verify JWT Token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer string
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get employee profile from the token payload (excluding password)
      req.user = await Employee.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Grant access to specific roles (Role-Based Access Control)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ 
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };