/**
 * Admin Controller
 *
 * Handles admin-related HTTP requests.
 * Demonstrates separation of concerns by delegating business logic to service layer.
 */

const AdminService = require('../services/admin.service');
const { HTTP_STATUS } = require('../config/constants');

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllUsers(req, res) {
    try {
      const { role, isActive, page = 1, limit = 10 } = req.query;

      const result = await this.adminService.getAllUsers(
        { role, isActive },
        {
          sort: { createdAt: -1 },
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        }
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminService.getUserById(id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Create new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const result = await this.adminService.createUser(req.body);

      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminService.updateUser(id, req.body);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Assign bag number to student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async assignBagNumber(req, res) {
    try {
      const { id } = req.params;
      const { bagNumber } = req.body;

      const result = await this.adminService.assignBagNumber(id, bagNumber);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Deactivate user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deactivateUser(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminService.deactivateUser(id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Activate user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async activateUser(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminService.activateUser(id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminService.deleteUser(id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get system analytics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAnalytics(req, res) {
    try {
      const result = await this.adminService.getAnalytics();

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get students only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStudents(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.adminService.getAllUsers(
        { role: 'student' },
        {
          sort: { createdAt: -1 },
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        }
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get staff only
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStaff(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.adminService.getAllUsers(
        { role: 'staff' },
        {
          sort: { createdAt: -1 },
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        }
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AdminController();
