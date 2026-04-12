/**
 * Admin Model - Inheritance (OOP Concept)
 *
 * This class demonstrates Inheritance from UserModel.
 * AdminModel inherits all methods from UserModel and adds
 * admin-specific functionality.
 *
 * OOP Concept: Inheritance
 * - Extends: UserModel
 * - Inherits: All UserModel methods
 * - Extends: Admin-specific methods
 * - 'Is-a' relationship: AdminModel IS-A UserModel
 */

const UserModel = require('./user-class.model');
const { USER_ROLES } = require('../config/constants');

class AdminModel extends UserModel {
  constructor() {
    super();
    this._modelName = 'Admin';
  }

  /**
   * Find admin by admin ID
   * @param {string} adminId - Admin ID
   * @returns {Promise<Document|null>} Found admin or null
   */
  async findByAdminId(adminId) {
    try {
      return await this._schema.findOne({
        adminId,
        role: USER_ROLES.ADMIN,
        isActive: true
      });
    } catch (error) {
      throw new Error(`Error finding admin by ID: ${error.message}`);
    }
  }

  /**
   * Get all admins
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of admins
   */
  async getAllAdmins(options = {}) {
    try {
      return await this.findMany(
        { role: USER_ROLES.ADMIN, isActive: true },
        options
      );
    } catch (error) {
      throw new Error(`Error getting all admins: ${error.message}`);
    }
  }

  /**
   * Create new admin
   * @param {Object} data - Admin data
   * @returns {Promise<Document>} Created admin
   */
  async createAdmin(data) {
    try {
      const adminData = {
        ...data,
        role: USER_ROLES.ADMIN
      };
      return await this.create(adminData);
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  /**
   * Get system statistics
   * @returns {Promise<Object>} System statistics
   */
  async getSystemStats() {
    try {
      const totalStudents = await this._schema.countDocuments({
        role: USER_ROLES.STUDENT,
        isActive: true
      });

      const totalStaff = await this._schema.countDocuments({
        role: USER_ROLES.STAFF,
        isActive: true
      });

      const totalAdmins = await this._schema.countDocuments({
        role: USER_ROLES.ADMIN,
        isActive: true
      });

      return {
        totalStudents,
        totalStaff,
        totalAdmins,
        totalUsers: totalStudents + totalStaff + totalAdmins
      };
    } catch (error) {
      throw new Error(`Error getting system stats: ${error.message}`);
    }
  }

  /**
   * Check if admin ID exists
   * @param {string} adminId - Admin ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async adminIdExists(adminId) {
    try {
      const count = await this._schema.countDocuments({
        adminId,
        role: USER_ROLES.ADMIN,
        isActive: true
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking admin ID: ${error.message}`);
    }
  }
}

module.exports = AdminModel;
