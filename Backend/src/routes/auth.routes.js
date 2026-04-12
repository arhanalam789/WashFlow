/**
 * Authentication Routes
 *
 * Defines all authentication-related API endpoints.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validation.middleware');
const { schemas } = require('../middlewares/validation.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validateBody(schemas.register),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validateBody(schemas.login),
  authController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (All authenticated users)
 */
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private (All authenticated users)
 */
router.put(
  '/change-password',
  authenticate,
  validateBody(schemas.changePassword),
  authController.changePassword
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private (All authenticated users)
 */
router.post(
  '/refresh',
  authenticate,
  authController.refreshToken
);

module.exports = router;
