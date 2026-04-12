/**
 * User Factory - Factory Design Pattern & Open/Closed Principle (OCP)
 *
 * This class demonstrates:
 * 1. Factory Design Pattern: Creates objects without specifying exact classes
 * 2. Open/Closed Principle: Open for extension, closed for modification
 *
 * Design Pattern: Factory Pattern
 * - Encapsulates object creation
 * - Hides instantiation logic
 * - Provides common interface for object creation
 *
 * SOLID Principle: Open/Closed Principle (OCP)
 * - Open for extension: Can add new roles without modifying existing code
 * - Closed for modification: Existing code doesn't need to change
 */

const { USER_ROLES } = require('../config/constants');
const StudentModel = require('../models/student.model');
const StaffModel = require('../models/staff.model');
const AdminModel = require('../models/admin.model');

class UserFactory {
  constructor() {
    // Registry for role-model mapping (allows extension without modification)
    this._roleRegistry = {
      [USER_ROLES.STUDENT]: StudentModel,
      [USER_ROLES.STAFF]: StaffModel,
      [USER_ROLES.ADMIN]: AdminModel
    };
  }

  /**
   * Create user model based on role
   * @param {string} role - User role
   * @returns {StudentModel|StaffModel|AdminModel} User model instance
   * @throws {Error} If role is invalid
   */
  createUser(role) {
    const ModelClass = this._roleRegistry[role];

    if (!ModelClass) {
      throw new Error(`Invalid role: ${role}. Must be one of: ${Object.values(USER_ROLES).join(', ')}`);
    }

    return new ModelClass();
  }

  /**
   * Create user by role name (alternative method)
   * @param {string} role - User role
   * @returns {StudentModel|StaffModel|AdminModel} User model instance
   */
  create(role) {
    return this.createUser(role);
  }

  /**
   * Register a new role-model mapping (Open/Closed Principle)
   * This allows adding new roles without modifying the factory code
   * @param {string} role - Role name
   * @param {Class} ModelClass - Model class
   */
  registerRole(role, ModelClass) {
    if (typeof role !== 'string' || !role) {
      throw new Error('Role must be a non-empty string');
    }

    if (typeof ModelClass !== 'function') {
      throw new Error('ModelClass must be a constructor function');
    }

    this._roleRegistry[role] = ModelClass;
  }

  /**
   * Check if role is registered
   * @param {string} role - Role to check
   * @returns {boolean} True if registered, false otherwise
   */
  isRoleRegistered(role) {
    return role in this._roleRegistry;
  }

  /**
   * Get all registered roles
   * @returns {Array<string>} Array of registered roles
   */
  getRegisteredRoles() {
    return Object.keys(this._roleRegistry);
  }

  /**
   * Get student model
   * @returns {StudentModel} Student model instance
   */
  getStudentModel() {
    return new StudentModel();
  }

  /**
   * Get staff model
   * @returns {StaffModel} Staff model instance
   */
  getStaffModel() {
    return new StaffModel();
  }

  /**
   * Get admin model
   * @returns {AdminModel} Admin model instance
   */
  getAdminModel() {
    return new AdminModel();
  }
}

// Export singleton instance
module.exports = new UserFactory();
