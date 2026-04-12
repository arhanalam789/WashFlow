/**
 * Validation Middleware
 *
 * This middleware handles request validation using Joi schema validation.
 */

const Joi = require('joi');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Validate request body against schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
};

/**
 * Validate request query against schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Validate request params against schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.params = value;
    next();
  };
};

// Validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'staff', 'admin').required(),
    name: Joi.string().min(2).max(100).required(),
    studentId: Joi.string().when('role', {
      is: 'student',
      then: Joi.optional()
    }),
    roomNumber: Joi.string().when('role', {
      is: 'student',
      then: Joi.optional()
    }),
    employeeId: Joi.string().when('role', {
      is: 'staff',
      then: Joi.optional()
    }),
    adminId: Joi.string().when('role', {
      is: 'admin',
      then: Joi.optional()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  // Laundry schemas
  createLaundry: Joi.object({
    studentId: Joi.string().hex().length(24).required(),
    declaredItems: Joi.number().integer().min(1).required()
  }),

  collectLaundry: Joi.object({
    receivedItems: Joi.number().integer().min(0).optional(),
    notes: Joi.string().max(500).optional()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'collected', 'washing', 'ready', 'delivered').required()
  }),

  // User schemas
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'staff', 'admin').required(),
    name: Joi.string().min(2).max(100).required(),
    studentId: Joi.string().when('role', {
      is: 'student',
      then: Joi.optional()
    }),
    roomNumber: Joi.string().when('role', {
      is: 'student',
      then: Joi.optional()
    }),
    employeeId: Joi.string().when('role', {
      is: 'staff',
      then: Joi.optional()
    }),
    adminId: Joi.string().when('role', {
      is: 'admin',
      then: Joi.optional()
    })
  }),

  assignBagNumber: Joi.object({
    bagNumber: Joi.string().required()
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    roomNumber: Joi.string().optional()
  }).min(1),

  // Common schemas
  idParam: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional()
  })
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  schemas
};
