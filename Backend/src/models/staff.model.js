/**
 * Staff Model - Inheritance (OOP Concept)
 *
 * This class demonstrates Inheritance from UserModel.
 * StaffModel inherits all methods from UserModel and adds
 * staff-specific functionality.
 *
 * OOP Concept: Inheritance
 * - Extends: UserModel
 * - Inherits: All UserModel methods
 * - Extends: Staff-specific methods
 * - 'Is-a' relationship: StaffModel IS-A UserModel
 */

const UserModel = require('./user-class.model');
const { USER_ROLES } = require('../config/constants');

class StaffModel extends UserModel {
  constructor() {
    super();
    this._modelName = 'Staff';
  }

  /**
   * Find staff by employee ID
   * @param {string} employeeId - Employee ID
   * @returns {Promise<Document|null>} Found staff or null
   */
  async findByEmployeeId(employeeId) {
    try {
      return await this._schema.findOne({
        employeeId,
        role: USER_ROLES.STAFF,
        isActive: true
      });
    } catch (error) {
      throw new Error(`Error finding staff by employee ID: ${error.message}`);
    }
  }

  /**
   * Get all staff members
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of staff members
   */
  async getAllStaff(options = {}) {
    try {
      return await this.findMany(
        { role: USER_ROLES.STAFF, isActive: true },
        options
      );
    } catch (error) {
      throw new Error(`Error getting all staff: ${error.message}`);
    }
  }

  /**
   * Create new staff member
   * @param {Object} data - Staff data
   * @returns {Promise<Document>} Created staff
   */
  async createStaff(data) {
    try {
      const staffData = {
        ...data,
        role: USER_ROLES.STAFF
      };
      return await this.create(staffData);
    } catch (error) {
      throw new Error(`Error creating staff: ${error.message}`);
    }
  }

  /**
   * Check if employee ID exists
   * @param {string} employeeId - Employee ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async employeeIdExists(employeeId) {
    try {
      const count = await this._schema.countDocuments({
        employeeId,
        role: USER_ROLES.STAFF,
        isActive: true
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking employee ID: ${error.message}`);
    }
  }
}

module.exports = StaffModel;
