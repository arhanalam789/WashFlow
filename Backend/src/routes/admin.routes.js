/**
 * Admin Routes
 *
 * Defines all admin-related API endpoints.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const { validateBody, validateParams } = require('../middlewares/validation.middleware');
const { schemas } = require('../middlewares/validation.middleware');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get(
  '/users',
  authenticate,
  isAdmin,
  adminController.getAllUsers
);

/**
 * @route   GET /api/admin/users/students
 * @desc    Get all students
 * @access  Private (Admin only)
 */
router.get(
  '/users/students',
  authenticate,
  isAdmin,
  adminController.getStudents
);

/**
 * @route   GET /api/admin/users/staff
 * @desc    Get all staff
 * @access  Private (Admin only)
 */
router.get(
  '/users/staff',
  authenticate,
  isAdmin,
  adminController.getStaff
);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get(
  '/users/:id',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  adminController.getUserById
);

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post(
  '/users',
  authenticate,
  isAdmin,
  validateBody(schemas.createUser),
  adminController.createUser
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put(
  '/users/:id',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  validateBody(schemas.updateUser),
  adminController.updateUser
);

/**
 * @route   PUT /api/admin/users/:id/assign-bag
 * @desc    Assign bag number to student
 * @access  Private (Admin only)
 */
router.put(
  '/users/:id/assign-bag',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  validateBody(schemas.assignBagNumber),
  adminController.assignBagNumber
);

/**
 * @route   PUT /api/admin/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private (Admin only)
 */
router.put(
  '/users/:id/deactivate',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  adminController.deactivateUser
);

/**
 * @route   PUT /api/admin/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin only)
 */
router.put(
  '/users/:id/activate',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  adminController.activateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete(
  '/users/:id',
  authenticate,
  isAdmin,
  validateParams(schemas.idParam),
  adminController.deleteUser
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get system analytics
 * @access  Private (Admin only)
 */
router.get(
  '/analytics',
  authenticate,
  isAdmin,
  adminController.getAnalytics
);

module.exports = router;
