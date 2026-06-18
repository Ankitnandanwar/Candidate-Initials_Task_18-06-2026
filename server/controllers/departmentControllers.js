// controllers/departmentController.js
const { Department, Employee } = require('../models/index');

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private (Admin Only)
exports.createDepartment = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required.' });
  }

  try {
    const departmentExists = await Department.findOne({ where: { name } });
    if (departmentExists) {
      return res.status(400).json({ message: 'Department name already exists.' });
    }

    const department = await Department.create({ name, description });
    res.status(201).json({ success: true, message: 'Department created successfully.', data: department });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all departments with employee counts
// @route   GET /api/departments
// @access  Private (Admin/Employee)
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [{
        model: Employee,
        attributes: ['id'] // Only pull IDs to count or view allocation
      }]
    });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private (Admin Only)
exports.updateDepartment = async (req, res) => {
  const { name, description } = req.body;

  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    department.name = name || department.name;
    department.description = description || department.description;
    await department.save();

    res.status(200).json({ success: true, message: 'Department updated successfully.', data: department });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin Only)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await department.destroy();
    res.status(200).json({ success: true, message: 'Department deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};