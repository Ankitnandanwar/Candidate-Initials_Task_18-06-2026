// server/directSeed.js
const { Employee } = require('./models/index');
const { connectDB } = require('./config/db');

const startSeeding = async () => {
  // Initialize DB Connection
  await connectDB();

  try {
    // 1. Wipe previous manual test attempts to clear up duplicate primary key constraints
    await Employee.destroy({ where: {} });
    console.log('🧹 Cleaned old broken workbench test profiles.');

    // 2. Create the Admin account using your Sequelize model directly
    // This forces your hooks inside models/Employee.js to hash the passwords flawlessly
    await Employee.create({
      id: 1,
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@company.com',
      password: 'adminPassword123', // Your plain text password
      role: 'admin',
      status: 'active'
    });
    console.log('✔ Admin account seeded perfectly into MySQL.');

    // 3. Create the Employee account
    await Employee.create({
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'employee@company.com',
      password: 'employeePassword123', // Your plain text password
      role: 'employee',
      status: 'active'
    });
    console.log('✔ Employee account seeded perfectly into MySQL.');

  } catch (err) {
    console.error('❌ Seeding execution stalled:', err.message);
  } finally {
    process.exit();
  }
};

startSeeding();