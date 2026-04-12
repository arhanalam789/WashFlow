/**
 * Main Server File
 *
 * Entry point for the WashFlow backend application.
 * Configures Express server, middleware, and routes.
 */

require('express-async-errors'); // Handle async errors automatically
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configurations
const database = require('./src/config/database.config');
const { errorHandler, notFoundHandler } = require('./src/middlewares/error.middleware');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const laundryRoutes = require('./src/routes/laundry.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Initialize Express app
const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WashFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to WashFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      laundry: '/api/laundry',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/washflow';
    await database.connect(mongoUri);

    const listenWithFallback = (port, attempt = 0) => {
      const maxAttempts = 20; // 5000..5020

      const server = app.listen(port, () => {
        console.log('=================================');
        console.log('WashFlow Backend Server');
        console.log('=================================');
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Server running on port: ${port}`);
        console.log(`API Base URL: http://localhost:${port}`);
        console.log('=================================');
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE' && attempt < maxAttempts) {
          const nextPort = port + 1;
          console.warn(`Port ${port} in use, trying ${nextPort}...`);
          server.close(() => listenWithFallback(nextPort, attempt + 1));
          return;
        }

        console.error('Failed to start server:', err);
        process.exit(1);
      });
    };

    // Start listening (with automatic port fallback for local dev)
    listenWithFallback(DEFAULT_PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.error('Shutting down server...');
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
