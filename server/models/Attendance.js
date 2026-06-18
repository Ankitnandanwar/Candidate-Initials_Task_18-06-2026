const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  checkIn: {
    type: DataTypes.TIME,
    allowNull: true
  },
  checkOut: {
    type: DataTypes.TIME,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'half-day'),
    defaultValue: 'present'
  }
}, {
  timestamps: true
});

module.exports = Attendance;