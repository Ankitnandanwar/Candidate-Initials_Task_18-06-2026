const { Employee } = require('../models/index');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/profile
const getProfile = async (req, res) => {
    try {
        // req.user.id comes from your protect middleware
        const employee = await Employee.findByPk(req.user.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile bio
// @route   PUT /api/profile
const updateProfile = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.user.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        if (employee.isDeleted) {
            return res.status(400).json({ success: false, message: 'Account is deactivated' });
        }

        // Only allow updating the bio field from this public form
        await employee.update({ bio: req.body.bio });
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change account password
// @route   PUT /api/profile/change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const employee = await Employee.findByPk(req.user.id);

        if (!employee) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Use your instance method to check password validity
        const isMatch = await employee.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await employee.update({ password: hashedPassword });
        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};