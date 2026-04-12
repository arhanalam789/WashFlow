/**
 * Laundry Repository - Single Responsibility Principle (SRP)
 *
 * This class demonstrates the Single Responsibility Principle from SOLID.
 * SRP states that a class should have only one reason to change.
 *
 * SOLID Principle: Single Responsibility Principle (SRP)
 * - Single responsibility: Only handles laundry request data access
 * - One reason to change: Only changes if laundry data structure changes
 * - Separation of concerns: Data access logic separated from business logic
 */

const BaseRepository = require('./base.repository');
const LaundryModel = require('../models/laundry-class.model');

class LaundryRepository extends BaseRepository {
  constructor() {
    super(new LaundryModel());
  }

  /**
   * Create a new laundry request
   * @param {Object} data - Laundry request data
   * @returns {Promise<Document>} Created laundry request
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Find laundry by ID
   * @param {string} id - Laundry ID
   * @returns {Promise<Document|null>} Found laundry or null
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Find laundry by request ID
   * @param {string} requestId - Request ID
   * @returns {Promise<Document|null>} Found laundry or null
   */
  async findByRequestId(requestId) {
    return await this.model.findByRequestId(requestId);
  }

  /**
   * Find laundry by student ID
   * @param {string} studentId - Student ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests
   */
  async findByStudentId(studentId, options = {}) {
    return await this.model.findByStudentId(studentId, options);
  }

  /**
   * Find laundry by status
   * @param {string} status - Laundry status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests
   */
  async findByStatus(status, options = {}) {
    return await this.model.findByStatus(status, options);
  }

  /**
   * Find one laundry by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<Document|null>} Found laundry or null
   */
  async findOne(conditions) {
    return await this.model.findOne(conditions);
  }

  /**
   * Find all laundry by conditions
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests
   */
  async findMany(conditions, options) {
    return await this.model.findMany(conditions, options);
  }

  /**
   * Update laundry by ID
   * @param {string} id - Laundry ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Document|null>} Updated laundry or null
   */
  async updateById(id, updates) {
    return await this.model.updateById(id, updates);
  }

  /**
   * Delete laundry by ID
   * @param {string} id - Laundry ID
   * @returns {Promise<Document|null>} Deleted laundry or null
   */
  async deleteById(id) {
    return await this.model.deleteById(id);
  }

  /**
   * Count laundry by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<number>} Count of laundry requests
   */
  async count(conditions) {
    return await this.model.count(conditions);
  }

  /**
   * Check if laundry exists
   * @param {Object} conditions - Search conditions
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(conditions) {
    return await this.model.exists(conditions);
  }

  /**
   * Find pending laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of pending laundry requests
   */
  async findPending(options = {}) {
    return await this.model.findPending(options);
  }

  /**
   * Find collected laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of collected laundry requests
   */
  async findCollected(options = {}) {
    return await this.model.findCollected(options);
  }

  /**
   * Find laundry in process (washing)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests being washed
   */
  async findWashing(options = {}) {
    return await this.model.findWashing(options);
  }

  /**
   * Find ready laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of ready laundry requests
   */
  async findReady(options = {}) {
    return await this.model.findReady(options);
  }

  /**
   * Find laundry with discrepancy
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry with discrepancy
   */
  async findWithDiscrepancy(options = {}) {
    return await this.model.findWithDiscrepancy(options);
  }

  /**
   * Get count by status
   * @param {string} status - Laundry status
   * @returns {Promise<number>} Count of laundry requests
   */
  async getCountByStatus(status) {
    return await this.model.getCountByStatus(status);
  }

  /**
   * Get all counts by status
   * @returns {Promise<Object>} Counts by status
   */
  async getAllStatusCounts() {
    return await this.model.getAllStatusCounts();
  }

  /**
   * Check if request ID exists
   * @param {string} requestId - Request ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async requestIdExists(requestId) {
    return await this.model.requestIdExists(requestId);
  }

  /**
   * Get laundry with discrepancy count
   * @returns {Promise<number>} Count of laundry with discrepancy
   */
  async getDiscrepancyCount() {
    return await this.model.getDiscrepancyCount();
  }

  /**
   * Generate unique request ID
   * @param {number} sequenceNumber - Sequence number
   * @returns {string} Request ID
   */
  generateRequestId(sequenceNumber) {
    return this.model.generateRequestId(sequenceNumber);
  }
}

module.exports = LaundryRepository;
