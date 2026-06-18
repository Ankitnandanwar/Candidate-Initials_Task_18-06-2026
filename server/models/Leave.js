const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  leaveType: {
    type: DataTypes.ENUM('sick', 'casual', 'earned', 'maternity/paternity'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

module.exports = Leave;