/**
 * Laundry Model Class - Encapsulation (OOP Concept)
 *
 * This class demonstrates Encapsulation by bundling laundry-related
 * data and methods within a single class.
 *
 * OOP Concept: Encapsulation
 * - Data hiding: Internal operations are private
 * - Method bundling: All laundry operations in one place
 * - Access control: Public methods with controlled access
 */

const BaseModel = require('./base.model');
const Laundry = require('./laundry.model');
const { LAUNDRY_STATUS } = require('../config/constants');

class LaundryModel extends BaseModel {
  constructor() {
    super(Laundry);
    this._modelName = 'Laundry';
  }

  /**
   * Find laundry by request ID
   * @param {string} requestId - Request ID
   * @returns {Promise<Document|null>} Found laundry or null
   */
  async findByRequestId(requestId) {
    try {
      return await this._schema.findOne({ requestId }).populate('studentId', 'name email studentId bagNumber roomNumber');
    } catch (error) {
      throw new Error(`Error finding laundry by request ID: ${error.message}`);
    }
  }

  /**
   * Find laundry requests by student ID
   * @param {string} studentId - Student ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests
   */
  async findByStudentId(studentId, options = {}) {
    try {
      const defaultOptions = { sort: { createdAt: -1 }, ...options };
      return await this.findMany({ studentId }, defaultOptions);
    } catch (error) {
      throw new Error(`Error finding laundry by student ID: ${error.message}`);
    }
  }

  /**
   * Find laundry requests by status
   * @param {string} status - Laundry status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests
   */
  async findByStatus(status, options = {}) {
    try {
      const defaultOptions = { sort: { createdAt: 1 }, ...options };
      return await this.findMany({ status }, defaultOptions);
    } catch (error) {
      throw new Error(`Error finding laundry by status: ${error.message}`);
    }
  }

  /**
   * Find pending laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of pending laundry requests
   */
  async findPending(options = {}) {
    try {
      return await this.findByStatus(LAUNDRY_STATUS.PENDING, options);
    } catch (error) {
      throw new Error(`Error finding pending laundry: ${error.message}`);
    }
  }

  /**
   * Find collected laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of collected laundry requests
   */
  async findCollected(options = {}) {
    try {
      return await this.findByStatus(LAUNDRY_STATUS.COLLECTED, options);
    } catch (error) {
      throw new Error(`Error finding collected laundry: ${error.message}`);
    }
  }

  /**
   * Find laundry in process (washing)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry requests being washed
   */
  async findWashing(options = {}) {
    try {
      return await this.findByStatus(LAUNDRY_STATUS.WASHING, options);
    } catch (error) {
      throw new Error(`Error finding washing laundry: ${error.message}`);
    }
  }

  /**
   * Find ready laundry requests
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of ready laundry requests
   */
  async findReady(options = {}) {
    try {
      return await this.findByStatus(LAUNDRY_STATUS.READY, options);
    } catch (error) {
      throw new Error(`Error finding ready laundry: ${error.message}`);
    }
  }

  /**
   * Find laundry with discrepancy
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of laundry with discrepancy
   */
  async findWithDiscrepancy(options = {}) {
    try {
      const defaultOptions = { sort: { createdAt: -1 }, ...options };
      return await this.findMany({ hasDiscrepancy: true }, defaultOptions);
    } catch (error) {
      throw new Error(`Error finding laundry with discrepancy: ${error.message}`);
    }
  }

  /**
   * Generate unique request ID
   * @param {number} sequenceNumber - Sequence number
   * @returns {string} Request ID
   */
  generateRequestId(sequenceNumber) {
    const year = new Date().getFullYear();
    const paddedNumber = String(sequenceNumber).padStart(4, '0');
    return `LR-${year}-${paddedNumber}`;
  }

  /**
   * Get count by status
   * @param {string} status - Laundry status
   * @returns {Promise<number>} Count of laundry requests
   */
  async getCountByStatus(status) {
    try {
      return await this.count({ status });
    } catch (error) {
      throw new Error(`Error getting count by status: ${error.message}`);
    }
  }

  /**
   * Get all counts by status
   * @returns {Promise<Object>} Counts by status
   */
  async getAllStatusCounts() {
    try {
      const pending = await this.getCountByStatus(LAUNDRY_STATUS.PENDING);
      const collected = await this.getCountByStatus(LAUNDRY_STATUS.COLLECTED);
      const washing = await this.getCountByStatus(LAUNDRY_STATUS.WASHING);
      const ready = await this.getCountByStatus(LAUNDRY_STATUS.READY);
      const delivered = await this.getCountByStatus(LAUNDRY_STATUS.DELIVERED);

      return {
        pending,
        collected,
        washing,
        ready,
        delivered,
        total: pending + collected + washing + ready + delivered
      };
    } catch (error) {
      throw new Error(`Error getting all status counts: ${error.message}`);
    }
  }

  /**
   * Check if request ID exists
   * @param {string} requestId - Request ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async requestIdExists(requestId) {
    try {
      return await this.exists({ requestId });
    } catch (error) {
      throw new Error(`Error checking request ID: ${error.message}`);
    }
  }

  /**
   * Get laundry with discrepancy count
   * @returns {Promise<number>} Count of laundry with discrepancy
   */
  async getDiscrepancyCount() {
    try {
      return await this.count({ hasDiscrepancy: true });
    } catch (error) {
      throw new Error(`Error getting discrepancy count: ${error.message}`);
    }
  }
}

module.exports = LaundryModel;
