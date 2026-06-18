// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentControllers');
const { protect, authorize } = require('../middleware/auth');

// Separation of concerns using RBAC
router.route('/')
  .post(protect, authorize('admin'), createDepartment)
  .get(protect, getAllDepartments); // Both Admins and Employees can view departments

router.route('/:id')
  .put(protect, authorize('admin'), updateDepartment)
  .delete(protect, authorize('admin'), deleteDepartment);

module.exports = router;