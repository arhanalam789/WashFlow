/**
 * User Model Class - Inheritance (OOP Concept)
 *
 * This class demonstrates Inheritance, one of the four core OOP concepts.
 * Inheritance allows a class to acquire properties and methods from another class.
 *
 * OOP Concept: Inheritance
 * - Base class: UserModel extends BaseModel
 * - Property inheritance: Gets all BaseModel methods
 * - Method overriding: Can override base methods
 * - 'Is-a' relationship: UserModel IS-A BaseModel
 */

const BaseModel = require('./base.model');
const User = require('./user.model');

class UserModel extends BaseModel {
  constructor() {
    super(User);
    this._modelName = 'User';
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Document|null>} Found user or null
   */
  async findByEmail(email) {
    try {
      return await this._schema.findOne({ email, isActive: true });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async findByRole(role, options = {}) {
    try {
      return await this.findMany({ role, isActive: true }, options);
    } catch (error) {
      throw new Error(`Error finding users by role: ${error.message}`);
    }
  }

  /**
   * Find user by student ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Document|null>} Found user or null
   */
  async findByStudentId(studentId) {
    try {
      return await this._schema.findOne({ studentId, isActive: true });
    } catch (error) {
      throw new Error(`Error finding user by student ID: ${error.message}`);
    }
  }

  /**
   * Find user by bag number
   * @param {string} bagNumber - Bag number
   * @returns {Promise<Document|null>} Found user or null
   */
  async findByBagNumber(bagNumber) {
    try {
      return await this._schema.findOne({ bagNumber, isActive: true });
    } catch (error) {
      throw new Error(`Error finding user by bag number: ${error.message}`);
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async emailExists(email) {
    try {
      return await this.exists({ email });
    } catch (error) {
      throw new Error(`Error checking email existence: ${error.message}`);
    }
  }

  /**
   * Check if student ID exists
   * @param {string} studentId - Student ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async studentIdExists(studentId) {
    try {
      return await this.exists({ studentId });
    } catch (error) {
      throw new Error(`Error checking student ID existence: ${error.message}`);
    }
  }

  /**
   * Check if bag number exists
   * @param {string} bagNumber - Bag number to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async bagNumberExists(bagNumber) {
    try {
      return await this.exists({ bagNumber });
    } catch (error) {
      throw new Error(`Error checking bag number existence: ${error.message}`);
    }
  }

  /**
   * Get all active users
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of active users
   */
  async getAllActive(options = {}) {
    try {
      return await this.findMany({ isActive: true }, options);
    } catch (error) {
      throw new Error(`Error getting active users: ${error.message}`);
    }
  }

  /**
   * Deactivate user by ID (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<Document|null>} Updated user or null
   */
  async deactivate(id) {
    try {
      return await this.updateById(id, { isActive: false });
    } catch (error) {
      throw new Error(`Error deactivating user: ${error.message}`);
    }
  }

  /**
   * Activate user by ID
   * @param {string} id - User ID
   * @returns {Promise<Document|null>} Updated user or null
   */
  async activate(id) {
    try {
      return await this.updateById(id, { isActive: true });
    } catch (error) {
      throw new Error(`Error activating user: ${error.message}`);
    }
  }
}

module.exports = UserModel;
