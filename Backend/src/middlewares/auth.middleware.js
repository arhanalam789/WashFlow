/**
 * Authentication Middleware
 *
 * This middleware handles JWT token verification and user authentication.
 * It validates the token and attaches the user object to the request.
 *
 * Middleware pattern: Functions that have access to req, res, and next
 */

const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../config/constants');
const UserRepository = require('../repositories/user.repository');

/**
 * Authenticate user using JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret);

    // Get user from database
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token has expired'
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret);

    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (user && user.isActive) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
