const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define('Payroll', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  month: {
    type: DataTypes.STRING, // e.g., "October 2026"
    allowNull: false
  },
  baseSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  allowances: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  deductions: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  netSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('paid', 'pending', 'processed'),
    defaultValue: 'pending'
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Payroll;