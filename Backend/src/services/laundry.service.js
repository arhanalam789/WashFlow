/**
 * Laundry Service - Polymorphism & Dependency Inversion Principle (DIP)
 *
 * This class demonstrates:
 * 1. Polymorphism: Same method behaves differently based on user role
 * 2. Dependency Inversion Principle: Depends on abstractions (repositories) not concretions
 *
 * OOP Concept: Polymorphism
 * - Same method name, different behavior based on context
 * - Role-based behavior in updateStatus method
 * - Dynamic behavior at runtime
 *
 * SOLID Principle: Dependency Inversion Principle (DIP)
 * - High-level module depends on abstractions (BaseService)
 * - Not dependent on concrete implementations
 * - Dependencies injected through constructor
 */

const BaseService = require('./base.service');
const LaundryRepository = require('../repositories/laundry.repository');
const UserRepository = require('../repositories/user.repository');
const {
  LAUNDRY_STATUS,
  STATUS_TRANSITIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} = require('../config/constants');

class LaundryService extends BaseService {
  constructor() {
    super(new LaundryRepository());
    this.userRepository = new UserRepository();
  }

  /**
   * Create new laundry request
   * @param {Object} laundryData - Laundry request data
   * @param {string} laundryData.studentId - Student ID
   * @param {number} laundryData.declaredItems - Number of items declared
   * @returns {Promise<Object>} Created laundry request
   */
  async createRequest(laundryData) {
    try {
      const { studentId, declaredItems } = laundryData;

      // Validate declared items
      if (!declaredItems || declaredItems < 1) {
        throw new Error('Declared items must be at least 1');
      }

      // Find student
      const student = await this.userRepository.findById(studentId);
      if (!student || student.role !== 'student') {
        throw new Error('Student not found');
      }

      if (!student.bagNumber) {
        throw new Error('Student must be assigned a bag number before submitting laundry');
      }

      // Get sequence number (for now, use timestamp + random)
      const sequenceNumber = Date.now() % 10000;
      const requestId = this.repository.generateRequestId(sequenceNumber);

      // Create laundry request
      const laundryPayload = {
        requestId,
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        bagNumber: student.bagNumber,
        roomNumber: student.roomNumber,
        declaredItems,
        status: LAUNDRY_STATUS.PENDING
      };

      const laundry = await this.repository.create(laundryPayload);

      return {
        success: true,
        message: SUCCESS_MESSAGES.LAUNDRY_SUBMITTED,
        data: laundry
      };
    } catch (error) {
      throw new Error(`Failed to create laundry request: ${error.message}`);
    }
  }

  /**
   * Get student's laundry requests
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} Array of laundry requests
   */
  async getStudentRequests(studentId) {
    try {
      const requests = await this.repository.findByStudentId(studentId, {
        sort: { createdAt: -1 }
      });

      return {
        success: true,
        data: requests
      };
    } catch (error) {
      throw new Error(`Failed to get student requests: ${error.message}`);
    }
  }

  /**
   * Get all pending requests (for staff)
   * @returns {Promise<Array>} Array of pending requests
   */
  async getPendingRequests() {
    try {
      const requests = await this.repository.findPending({
        sort: { createdAt: 1 }
      });

      return {
        success: true,
        data: requests
      };
    } catch (error) {
      throw new Error(`Failed to get pending requests: ${error.message}`);
    }
  }

  /**
   * Mark laundry as collected by staff
   * @param {string} laundryId - Laundry ID
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} Updated laundry request
   */
  async markAsCollected(laundryId, staffId) {
    try {
      const laundry = await this.repository.findById(laundryId);
      if (!laundry) {
        throw new Error(ERROR_MESSAGES.LAUNDRY_NOT_FOUND);
      }

      if (laundry.status !== LAUNDRY_STATUS.PENDING) {
        throw new Error('Can only collect pending laundry');
      }

      // Verify staff member
      const staff = await this.userRepository.findById(staffId);
      if (!staff || staff.role !== 'staff') {
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      }

      // Update status
      const updated = await this.repository.updateById(laundryId, {
        status: LAUNDRY_STATUS.COLLECTED,
        collectedBy: staffId,
        collectedAt: new Date()
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.LAUNDRY_COLLECTED,
        data: updated
      };
    } catch (error) {
      throw new Error(`Failed to mark as collected: ${error.message}`);
    }
  }

  /**
   * Verify laundry items and check for discrepancy
   * @param {string} laundryId - Laundry ID
   * @param {number} receivedItems - Number of items received
   * @param {string} staffId - Staff ID
   * @param {string} [notes] - Additional notes
   * @returns {Promise<Object>} Updated laundry request with discrepancy info
   */
  async verifyItems(laundryId, receivedItems, staffId, notes) {
    try {
      const laundry = await this.repository.findById(laundryId);
      if (!laundry) {
        throw new Error(ERROR_MESSAGES.LAUNDRY_NOT_FOUND);
      }

      if (laundry.status !== LAUNDRY_STATUS.COLLECTED) {
        throw new Error('Can only verify collected laundry');
      }

      // Verify staff member
      const staff = await this.userRepository.findById(staffId);
      if (!staff || staff.role !== 'staff') {
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      }

      // Check for discrepancy
      const hasDiscrepancy = laundry.declaredItems !== receivedItems;
      const difference = Math.abs(laundry.declaredItems - receivedItems);

      // Update laundry
      const updated = await this.repository.updateById(laundryId, {
        receivedItems,
        hasDiscrepancy,
        discrepancyNotes: hasDiscrepancy
          ? `Discrepancy: ${difference} items ${notes ? '- ' + notes : ''}`
          : null,
        verifiedBy: staffId,
        verifiedAt: new Date()
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.LAUNDRY_VERIFIED,
        data: {
          ...updated.toObject(),
          discrepancyInfo: hasDiscrepancy ? {
            hasDiscrepancy: true,
            declared: laundry.declaredItems,
            received: receivedItems,
            difference
          } : null
        }
      };
    } catch (error) {
      throw new Error(`Failed to verify items: ${error.message}`);
    }
  }

  /**
   * Update laundry status - POLYMORPHISM based on user role
   * @param {string} laundryId - Laundry ID
   * @param {string} newStatus - New status
   * @param {string} userId - User ID (student or staff)
   * @returns {Promise<Object>} Updated laundry request
   */
  async updateStatus(laundryId, newStatus, userId) {
    try {
      const laundry = await this.repository.findById(laundryId);
      if (!laundry) {
        throw new Error(ERROR_MESSAGES.LAUNDRY_NOT_FOUND);
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // POLYMORPHISM: Behavior changes based on user role
      if (user.role === 'student') {
        return await this._handleStudentStatusUpdate(laundry, newStatus, userId);
      } else if (user.role === 'staff') {
        return await this._handleStaffStatusUpdate(laundry, newStatus, userId);
      } else {
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      }
    } catch (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  /**
   * Handle student status update (Polymorphic behavior)
   * @private
   * @param {Object} laundry - Laundry object
   * @param {string} newStatus - New status
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Updated laundry request
   */
  async _handleStudentStatusUpdate(laundry, newStatus, studentId) {
    // Students can only confirm pickup when ready
    if (newStatus !== LAUNDRY_STATUS.DELIVERED) {
      throw new Error('Students can only confirm pickup');
    }

    if (laundry.status !== LAUNDRY_STATUS.READY) {
      throw new Error('Laundry must be ready before pickup');
    }

    if (laundry.studentId.toString() !== studentId) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN);
    }

    const updated = await this.repository.updateById(laundry._id, {
      status: LAUNDRY_STATUS.DELIVERED,
      deliveredAt: new Date()
    });

    return {
      success: true,
      message: 'Pickup confirmed successfully',
      data: updated
    };
  }

  /**
   * Handle staff status update (Polymorphic behavior)
   * @private
   * @param {Object} laundry - Laundry object
   * @param {string} newStatus - New status
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} Updated laundry request
   */
  async _handleStaffStatusUpdate(laundry, newStatus, staffId) {
    // Validate status transition
    const validTransitions = STATUS_TRANSITIONS[laundry.status];
    if (!validTransitions || !validTransitions.includes(newStatus)) {
      throw new Error(ERROR_MESSAGES.INVALID_STATUS_TRANSITION);
    }

    // Staff can update from collected → washing → ready
    if (laundry.status === LAUNDRY_STATUS.COLLECTED && newStatus === LAUNDRY_STATUS.WASHING) {
      const updated = await this.repository.updateById(laundry._id, {
        status: LAUNDRY_STATUS.WASHING
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.STATUS_UPDATED,
        data: updated
      };
    }

    if (laundry.status === LAUNDRY_STATUS.WASHING && newStatus === LAUNDRY_STATUS.READY) {
      const updated = await this.repository.updateById(laundry._id, {
        status: LAUNDRY_STATUS.READY
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.STATUS_UPDATED,
        data: updated
      };
    }

    throw new Error(ERROR_MESSAGES.INVALID_STATUS_TRANSITION);
  }

  /**
   * Get all laundry by status
   * @param {string} status - Laundry status
   * @returns {Promise<Array>} Array of laundry requests
   */
  async getByStatus(status) {
    try {
      const requests = await this.repository.findByStatus(status, {
        sort: { createdAt: -1 }
      });

      return {
        success: true,
        data: requests
      };
    } catch (error) {
      throw new Error(`Failed to get laundry by status: ${error.message}`);
    }
  }

  /**
   * Get all requests with discrepancy
   * @returns {Promise<Array>} Array of laundry requests with discrepancy
   */
  async getWithDiscrepancy() {
    try {
      const requests = await this.repository.findWithDiscrepancy({
        sort: { createdAt: -1 }
      });

      return {
        success: true,
        data: requests
      };
    } catch (error) {
      throw new Error(`Failed to get laundry with discrepancy: ${error.message}`);
    }
  }

  /**
   * Get laundry statistics
   * @returns {Promise<Object>} Laundry statistics
   */
  async getStatistics() {
    try {
      const stats = await this.repository.getAllStatusCounts();
      const discrepancyCount = await this.repository.getDiscrepancyCount();

      return {
        success: true,
        data: {
          ...stats,
          discrepancyCount
        }
      };
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Get laundry by request ID
   * @param {string} requestId - Request ID
   * @returns {Promise<Object>} Laundry request
   */
  async getByRequestId(requestId) {
    try {
      const laundry = await this.repository.findByRequestId(requestId);
      if (!laundry) {
        throw new Error(ERROR_MESSAGES.LAUNDRY_NOT_FOUND);
      }

      return {
        success: true,
        data: laundry
      };
    } catch (error) {
      throw new Error(`Failed to get laundry: ${error.message}`);
    }
  }
}

module.exports = LaundryService;
