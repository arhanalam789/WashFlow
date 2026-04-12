/**
 * Error Handler Middleware
 *
 * Global error handling middleware for the application.
 */

const { HTTP_STATUS } = require('../config/constants');

/**
 * Global error handler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal server error',
    status: err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.message = 'Validation failed';
    error.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.status = HTTP_STATUS.CONFLICT;
    error.message = 'Duplicate field value entered';
    const field = Object.keys(err.keyPattern)[0];
    error.errors = [{
      field,
      message: `${field} already exists`
    }];
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.status = HTTP_STATUS.UNAUTHORIZED;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.status = HTTP_STATUS.UNAUTHORIZED;
    error.message = 'Token expired';
  }

  res.status(error.status).json(error);
};

/**
 * Not found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
