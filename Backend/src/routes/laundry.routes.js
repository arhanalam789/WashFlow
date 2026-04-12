/**
 * Laundry Routes
 *
 * Defines all laundry-related API endpoints.
 */

const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundry.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isStudent, isStaff, isAdmin, isStaffOrAdmin, isStudentOrStaff } = require('../middlewares/role.middleware');
const { validateBody, validateParams } = require('../middlewares/validation.middleware');
const { schemas } = require('../middlewares/validation.middleware');

// Student routes
/**
 * @route   POST /api/laundry/submit
 * @desc    Submit new laundry request
 * @access  Private (Student only)
 */
router.post(
  '/submit',
  authenticate,
  isStudent,
  validateBody(schemas.createLaundry),
  laundryController.createRequest
);

/**
 * @route   GET /api/laundry/my
 * @desc    Get my laundry requests
 * @access  Private (Student only)
 */
router.get(
  '/my',
  authenticate,
  isStudent,
  laundryController.getMyRequests
);

// Staff routes
/**
 * @route   GET /api/laundry/pending
 * @desc    Get all pending laundry requests
 * @access  Private (Staff only)
 */
router.get(
  '/pending',
  authenticate,
  isStaff,
  laundryController.getPendingRequests
);

/**
 * @route   PUT /api/laundry/:id/collect
 * @desc    Mark laundry as collected
 * @access  Private (Staff only)
 */
router.put(
  '/:id/collect',
  authenticate,
  isStaff,
  validateParams(schemas.idParam),
  laundryController.markAsCollected
);

/**
 * @route   PUT /api/laundry/:id/verify
 * @desc    Verify laundry items count
 * @access  Private (Staff only)
 */
router.put(
  '/:id/verify',
  authenticate,
  isStaff,
  validateParams(schemas.idParam),
  validateBody(schemas.collectLaundry),
  laundryController.verifyItems
);

// Common routes (Student & Staff)
/**
 * @route   PUT /api/laundry/:id/status
 * @desc    Update laundry status
 * @access  Private (Student/Staff)
 */
router.put(
  '/:id/status',
  authenticate,
  isStudentOrStaff,
  validateParams(schemas.idParam),
  validateBody(schemas.updateStatus),
  laundryController.updateStatus
);

// Staff & Admin routes
/**
 * @route   GET /api/laundry/status/:status
 * @desc    Get laundry by status
 * @access  Private (Staff/Admin)
 */
router.get(
  '/status/:status',
  authenticate,
  isStaffOrAdmin,
  laundryController.getByStatus
);

/**
 * @route   GET /api/laundry/discrepancy
 * @desc    Get all laundry with discrepancy
 * @access  Private (Staff/Admin)
 */
router.get(
  '/discrepancy',
  authenticate,
  isStaffOrAdmin,
  laundryController.getWithDiscrepancy
);

/**
 * @route   GET /api/laundry/statistics
 * @desc    Get laundry statistics
 * @access  Private (Staff/Admin)
 */
router.get(
  '/statistics',
  authenticate,
  isStaffOrAdmin,
  laundryController.getStatistics
);

// Admin routes
/**
 * @route   GET /api/laundry/all
 * @desc    Get all laundry requests
 * @access  Private (Admin only)
 */
router.get(
  '/all',
  authenticate,
  isAdmin,
  laundryController.getAllRequests
);

/**
 * @route   GET /api/laundry/:id
 * @desc    Get laundry by ID
 * @access  Private (All users with access control)
 */
router.get(
  '/:id',
  authenticate,
  validateParams(schemas.idParam),
  laundryController.getById
);

module.exports = router;
