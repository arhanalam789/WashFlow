/**
 * User Repository - Single Responsibility Principle (SRP)
 *
 * This class demonstrates the Single Responsibility Principle from SOLID.
 * SRP states that a class should have only one reason to change.
 *
 * SOLID Principle: Single Responsibility Principle (SRP)
 * - Single responsibility: Only handles user data access
 * - One reason to change: Only changes if user data structure changes
 * - Separation of concerns: Data access logic separated from business logic
 */

const BaseRepository = require('./base.repository');
const UserModel = require('../models/user-class.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(new UserModel());
  }

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<Document>} Created user
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Document|null>} Found user or null
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Document|null>} Found user or null
   */
  async findByEmail(email) {
    return await this.model.findByEmail(email);
  }

  /**
   * Find one user by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<Document|null>} Found user or null
   */
  async findOne(conditions) {
    return await this.model.findOne(conditions);
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async findByRole(role, options = {}) {
    return await this.model.findByRole(role, options);
  }

  /**
   * Find all users by conditions
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async findMany(conditions, options) {
    return await this.model.findMany(conditions, options);
  }

  /**
   * Update user by ID
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Document|null>} Updated user or null
   */
  async updateById(id, updates) {
    return await this.model.updateById(id, updates);
  }

  /**
   * Delete user by ID (soft delete - deactivate)
   * @param {string} id - User ID
   * @returns {Promise<Document|null>} Deactivated user or null
   */
  async deleteById(id) {
    return await this.model.deactivate(id);
  }

  /**
   * Count users by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<number>} Count of users
   */
  async count(conditions) {
    return await this.model.count(conditions);
  }

  /**
   * Check if user exists
   * @param {Object} conditions - Search conditions
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(conditions) {
    return await this.model.exists(conditions);
  }

  /**
   * Find student by student ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Document|null>} Found student or null
   */
  async findStudentById(studentId) {
    return await this.model.findByStudentId(studentId);
  }

  /**
   * Find student by bag number
   * @param {string} bagNumber - Bag number
   * @returns {Promise<Document|null>} Found student or null
   */
  async findStudentByBagNumber(bagNumber) {
    return await this.model.findByBagNumber(bagNumber);
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async emailExists(email) {
    return await this.model.emailExists(email);
  }

  /**
   * Check if student ID exists
   * @param {string} studentId - Student ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async studentIdExists(studentId) {
    return await this.model.studentIdExists(studentId);
  }

  /**
   * Check if bag number exists
   * @param {string} bagNumber - Bag number to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async bagNumberExists(bagNumber) {
    return await this.model.bagNumberExists(bagNumber);
  }

  /**
   * Get all active users
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of active users
   */
  async getAllActive(options = {}) {
    return await this.model.getAllActive(options);
  }
}

module.exports = UserRepository;
