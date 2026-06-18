// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models/index');

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const departmentRoutes = require('./routes/departmentRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

const employeeRoutes = require('./routes/employeeRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Global Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing with your React client
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/profile', profileRoutes);

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the HR & Employee Management System API' });
});

// Define Port
const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Models, then Start Server
const startServer = async () => {
  // 1. Authenticate DB connection
  await connectDB();

  // 2. Sync Database Models (alter: true updates tables safely during development)
  try {
    await sequelize.sync({ force: true });
    console.log('✔ Database models synchronized.');
    
    // 3. Start Listening for Requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running in development mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error syncing database models:', error);
  }
};

const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);
startServer();