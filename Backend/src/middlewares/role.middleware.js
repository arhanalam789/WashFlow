/**
 * Role Middleware - Open/Closed Principle (OCP)
 *
 * This middleware demonstrates the Open/Closed Principle from SOLID.
 * OCP states that software entities should be open for extension
 * but closed for modification.
 *
 * SOLID Principle: Open/Closed Principle (OCP)
 * - Open for extension: Can add new roles without modifying existing code
 * - Closed for modification: Existing role checks don't need to change
 * - Using role-based factory pattern for extensibility
 */

const { USER_ROLES, ERROR_MESSAGES, HTTP_STATUS } = require('../config/constants');

/**
 * Check if user has required role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN
        });
      }

      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

/**
 * Check if user is student
 * @returns {Function} Middleware function
 */
const isStudent = authorize(USER_ROLES.STUDENT);

/**
 * Check if user is staff
 * @returns {Function} Middleware function
 */
const isStaff = authorize(USER_ROLES.STAFF);

/**
 * Check if user is admin
 * @returns {Function} Middleware function
 */
const isAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Check if user is staff or admin
 * @returns {Function} Middleware function
 */
const isStaffOrAdmin = authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN);

/**
 * Check if user is student or staff
 * @returns {Function} Middleware function
 */
const isStudentOrStaff = authorize(USER_ROLES.STUDENT, USER_ROLES.STAFF);

/**
 * Custom role checker - allows dynamic role checking
 * Demonstrates OCP: Open for extension without modification
 * @param {...string} roles - Roles to allow
 * @returns {Function} Middleware function
 */
const hasRole = (...roles) => {
  return authorize(...roles);
};

/**
 * Role-based access factory
 * Creates authorization middleware for specific roles
 * This demonstrates OCP by allowing new role combinations without modifying existing code
 */
class RoleAuthorizationFactory {
  /**
   * Create authorization middleware for single role
   * @param {string} role - Role name
   * @returns {Function} Middleware function
   */
  static createForRole(role) {
    return authorize(role);
  }

  /**
   * Create authorization middleware for multiple roles
   * @param {Array<string>} roles - Array of roles
   * @returns {Function} Middleware function
   */
  static createForRoles(roles) {
    return authorize(...roles);
  }

  /**
   * Create authorization middleware excluding specific roles
   * @param {Array<string>} excludedRoles - Roles to exclude
   * @returns {Function} Middleware function
   */
  static createExcluding(excludedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED
        });
      }

      if (excludedRoles.includes(req.user.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN
        });
      }

      next();
    };
  }
}

module.exports = {
  authorize,
  isStudent,
  isStaff,
  isAdmin,
  isStaffOrAdmin,
  isStudentOrStaff,
  hasRole,
  RoleAuthorizationFactory
};
