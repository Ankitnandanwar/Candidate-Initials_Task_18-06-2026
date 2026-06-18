const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileControllers');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getProfile)
    .put(updateProfile);

router.route('/change-password')
    .put(changePassword);

module.exports = router;