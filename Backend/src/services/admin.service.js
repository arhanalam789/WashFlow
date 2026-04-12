/**
 * Admin Service - Single Responsibility Principle (SRP)
 *
 * This class demonstrates the Single Responsibility Principle from SOLID.
 * SRP states that a class should have only one reason to change.
 *
 * SOLID Principle: Single Responsibility Principle (SRP)
 * - Single responsibility: Only handles admin operations
 * - One reason to change: Only changes if admin operations change
 * - Separation of concerns: Admin logic separated from other services
 */

const BaseService = require('./base.service');
const UserRepository = require('../repositories/user.repository');
const LaundryRepository = require('../repositories/laundry.repository');
const { USER_ROLES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

class AdminService extends BaseService {
  constructor() {
    super(new UserRepository());
    this.laundryRepository = new LaundryRepository();
  }

  /**
   * Get all users with optional filtering
   * @param {Object} filters - Filter options
   * @param {string} [filters.role] - Filter by role
   * @param {boolean} [filters.isActive] - Filter by active status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers(filters = {}, options = {}) {
    try {
      const conditions = {};

      if (filters.role) {
        conditions.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        conditions.isActive = filters.isActive;
      }

      const users = await this.repository.findMany(conditions, options);

      // Remove passwords from response
      const sanitizedUsers = users.map(user => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
      });

      return {
        success: true,
        data: sanitizedUsers
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role
   * @param {string} userData.name - User name
   * @param {string} [userData.studentId] - Student ID (for students)
   * @param {string} [userData.roomNumber] - Room number (for students)
   * @param {string} [userData.employeeId] - Employee ID (for staff)
   * @param {string} [userData.adminId] - Admin ID (for admins)
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      const { email, password, role, name } = userData;

      // Check if user already exists
      const existingUser = await this.repository.emailExists(email);
      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
      }

      // Validate role
      if (!Object.values(USER_ROLES).includes(role)) {
        throw new Error(ERROR_MESSAGES.INVALID_ROLE);
      }

      // Hash password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare user data based on role
      const userPayload = {
        email,
        password: hashedPassword,
        role,
        name
      };

      // Add role-specific fields
      if (role === USER_ROLES.STUDENT) {
        if (userData.studentId) {
          const studentExists = await this.repository.studentIdExists(userData.studentId);
          if (studentExists) {
            throw new Error('Student ID already exists');
          }
          userPayload.studentId = userData.studentId;
        }
        if (userData.roomNumber) {
          userPayload.roomNumber = userData.roomNumber;
        }
      } else if (role === USER_ROLES.STAFF) {
        if (userData.employeeId) {
          userPayload.employeeId = userData.employeeId;
        }
      } else if (role === USER_ROLES.ADMIN) {
        if (userData.adminId) {
          userPayload.adminId = userData.adminId;
        }
      }

      // Create user
      const user = await this.repository.create(userPayload);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_CREATED,
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Assign bag number to student
   * @param {string} studentId - Student ID
   * @param {string} bagNumber - Bag number to assign
   * @returns {Promise<Object>} Updated student
   */
  async assignBagNumber(studentId, bagNumber) {
    try {
      // Find student
      const student = await this.repository.findById(studentId);
      if (!student) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      if (student.role !== USER_ROLES.STUDENT) {
        throw new Error('Can only assign bag numbers to students');
      }

      // Check if bag number is already assigned
      const bagAssigned = await this.repository.bagNumberExists(bagNumber);
      if (bagAssigned) {
        throw new Error(ERROR_MESSAGES.BAG_ALREADY_ASSIGNED);
      }

      // Assign bag number
      const updated = await this.repository.updateById(studentId, { bagNumber });

      // Remove password from response
      const userResponse = updated.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: SUCCESS_MESSAGES.BAG_ASSIGNED,
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to assign bag number: ${error.message}`);
    }
  }

  /**
   * Get system analytics
   * @returns {Promise<Object>} System analytics data
   */
  async getAnalytics() {
    try {
      // Get user statistics
      const totalStudents = await this.repository.count({ role: USER_ROLES.STUDENT, isActive: true });
      const totalStaff = await this.repository.count({ role: USER_ROLES.STAFF, isActive: true });
      const totalAdmins = await this.repository.count({ role: USER_ROLES.ADMIN, isActive: true });

      // Get laundry statistics
      const laundryStats = await this.laundryRepository.getAllStatusCounts();
      const discrepancyCount = await this.laundryRepository.getDiscrepancyCount();

      return {
        success: true,
        data: {
          users: {
            students: totalStudents,
            staff: totalStaff,
            admins: totalAdmins,
            total: totalStudents + totalStaff + totalAdmins
          },
          laundry: {
            ...laundryStats,
            discrepancyCount
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Deactivate user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deactivated user
   */
  async deactivateUser(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const deactivated = await this.repository.updateById(userId, { isActive: false });

      // Remove password from response
      const userResponse = deactivated.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: 'User deactivated successfully',
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  /**
   * Activate user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Activated user
   */
  async activateUser(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const activated = await this.repository.updateById(userId, { isActive: true });

      // Remove password from response
      const userResponse = activated.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: 'User activated successfully',
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      await this.repository.deleteById(userId);

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updates) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Don't allow password update through this method
      delete updates.password;

      const updated = await this.repository.updateById(userId, updates);

      // Remove password from response
      const userResponse = updated.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: 'User updated successfully',
        data: userResponse
      };
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}

module.exports = AdminService;
