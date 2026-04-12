/**
 * Application Constants
 * Centralized configuration for all constant values used across the application
 */

// User Roles
const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin'
};

// Laundry Status Constants
const LAUNDRY_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  WASHING: 'washing',
  READY: 'ready',
  DELIVERED: 'delivered'
};

// Status Flow - Valid transitions
const STATUS_TRANSITIONS = {
  [LAUNDRY_STATUS.PENDING]: [LAUNDRY_STATUS.COLLECTED],
  [LAUNDRY_STATUS.COLLECTED]: [LAUNDRY_STATUS.WASHING],
  [LAUNDRY_STATUS.WASHING]: [LAUNDRY_STATUS.READY],
  [LAUNDRY_STATUS.READY]: [LAUNDRY_STATUS.DELIVERED],
  [LAUNDRY_STATUS.DELIVERED]: []
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  LAUNDRY_NOT_FOUND: 'Laundry request not found',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  DISCREPANCY_DETECTED: 'Discrepancy detected between declared and received items',
  BAG_ALREADY_ASSIGNED: 'Bag number already assigned to another student',
  INVALID_ROLE: 'Invalid user role'
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LAUNDRY_SUBMITTED: 'Laundry request submitted successfully',
  LAUNDRY_COLLECTED: 'Laundry collected successfully',
  LAUNDRY_VERIFIED: 'Laundry verified successfully',
  STATUS_UPDATED: 'Status updated successfully',
  BAG_ASSIGNED: 'Bag number assigned successfully',
  USER_CREATED: 'User created successfully'
};

module.exports = {
  USER_ROLES,
  LAUNDRY_STATUS,
  STATUS_TRANSITIONS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
