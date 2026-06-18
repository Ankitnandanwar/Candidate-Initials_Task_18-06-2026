const sequelize = require('../config/db').sequelize;
const Employee = require('./Employee');
const Department = require('./Department');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');

// 1. Department ➔ Employee Relationship
Department.hasMany(Employee, { foreignKey: 'departmentId', onDelete: 'SET NULL' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

// 2. Employee ➔ Attendance Relationship
Employee.hasMany(Attendance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

// 3. Employee ➔ Leave Relationship
Employee.hasMany(Leave, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Leave.belongsTo(Employee, { foreignKey: 'employeeId' });

// 4. Employee ➔ Payroll Relationship
Employee.hasMany(Payroll, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = {
  sequelize,
  Employee,
  Department,
  Attendance,
  Leave,
  Payroll
};