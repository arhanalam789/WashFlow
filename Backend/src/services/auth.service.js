/**
 * Authentication Service - Single Responsibility Principle (SRP)
 *
 * This class demonstrates the Single Responsibility Principle from SOLID.
 * SRP states that a class should have only one reason to change.
 *
 * SOLID Principle: Single Responsibility Principle (SRP)
 * - Single responsibility: Only handles authentication operations
 * - One reason to change: Only changes if authentication logic changes
 * - Separation of concerns: Auth logic separated from other business logic
 *
 * Responsibilities:
 * - User registration
 * - User login
 * - Token generation
 * - Password hashing
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseService = require('./base.service');
const UserRepository = require('../repositories/user.repository');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } = require('../config/constants');

class AuthService extends BaseService {
  constructor() {
    super(new UserRepository());
    this._jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    this._jwtExpiresIn = process.env.JWT_EXPIRE || '7d';
    this._saltRounds = 10;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role (student, staff, admin)
   * @param {string} userData.name - User name
   * @param {string} [userData.studentId] - Student ID (for students)
   * @param {string} [userData.roomNumber] - Room number (for students)
   * @param {string} [userData.employeeId] - Employee ID (for staff)
   * @param {string} [userData.adminId] - Admin ID (for admins)
   * @returns {Promise<Object>} Created user with token
   */
  async register(userData) {
    try {
      const { email, password, role, name } = userData;

      // Check if user already exists
      const existingUser = await this.repository.emailExists(email);
      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
      }

      // Hash password
      const hashedPassword = await this._hashPassword(password);

      // Prepare user data based on role
      const userPayload = {
        email,
        password: hashedPassword,
        role,
        name
      };

      // Add role-specific fields
      if (role === 'student') {
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
      } else if (role === 'staff') {
        if (userData.employeeId) {
          // Check if employee ID exists (would need to add this check to repository)
          userPayload.employeeId = userData.employeeId;
        }
      } else if (role === 'admin') {
        if (userData.adminId) {
          userPayload.adminId = userData.adminId;
        }
      }

      // Create user
      const user = await this.repository.create(userPayload);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      // Generate token
      const token = this._generateToken(user);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        data: {
          user: userResponse,
          token
        }
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Logged in user with token
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await this.repository.findByEmail(email);
      if (!user) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Verify password
      const isPasswordValid = await this._comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      // Generate token
      const token = this._generateToken(user);

      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: {
          user: userResponse,
          token
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token data
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this._jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
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

      return userResponse;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Verify current password
      const isPasswordValid = await this._comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await this._hashPassword(newPassword);

      // Update password
      await this.repository.updateById(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  /**
   * Hash password
   * @private
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async _hashPassword(password) {
    return await bcrypt.hash(password, this._saltRounds);
  }

  /**
   * Compare password with hash
   * @private
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  async _comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   * @private
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  _generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this._jwtSecret, {
      expiresIn: this._jwtExpiresIn
    });
  }
}

module.exports = AuthService;
