// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { clerkMiddleware } = require('@clerk/express');
const connectToMongoDB = require('./config/connect');
const expenseRoutes = require('./routes/expenseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Allow localhost on any port (Development)
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }

    // Allow the specific frontend URL (Production)
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments (optional, handy for testing)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk Middleware - Must be before routes
app.use(clerkMiddleware());

// Connect to MongoDB
connectToMongoDB()
  .then((conn) => {
    console.log('✅ Connected to MongoDB');
    console.log('📦 Active Database:', conn.connection.name);
  })
  .catch((err) => {
    console.error('❌ Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/user', userRoutes);        // User & profile routes
app.use('/api/expenses', expenseRoutes); // Expense routes (protected)
app.use('/api/analytics', analyticsRoutes);            // Analytics & utility routes

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    clerkEnabled: !!process.env.CLERK_SECRET_KEY
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  console.log(`🔐 Clerk Authentication: ${process.env.CLERK_SECRET_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;