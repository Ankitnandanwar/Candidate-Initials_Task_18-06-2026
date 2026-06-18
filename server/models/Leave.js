const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Employee = require('./Employee');

const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees', // Matches the physical SQL table name for Employees
      key: 'id'
    }
  },
  leaveType: {
    type: DataTypes.ENUM('sick', 'casual', 'annual', 'earned', 'maternity/paternity'),
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
  timestamps: true,
  tableName: 'Leaves' // Ensures seamless lowercase/uppercase table mapping in MySQL
});

// --- RELATIONSHIPS ---
// 1. Tells Leave that it belongs to an Employee
Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// 2. Dynamically attaches the inverse relationship to Employee without circular imports
Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });

module.exports = Leave;