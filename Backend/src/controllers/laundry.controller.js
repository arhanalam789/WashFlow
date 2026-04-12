/**
 * Laundry Controller
 *
 * Handles laundry-related HTTP requests.
 * Demonstrates separation of concerns by delegating business logic to service layer.
 */

const LaundryService = require('../services/laundry.service');
const { HTTP_STATUS } = require('../config/constants');

class LaundryController {
  constructor() {
    this.laundryService = new LaundryService();
  }

  /**
   * Create new laundry request (Student only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createRequest(req, res) {
    try {
      const laundryData = {
        ...req.body,
        studentId: req.user.id
      };

      const result = await this.laundryService.createRequest(laundryData);

      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get student's laundry requests (Student only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMyRequests(req, res) {
    try {
      const result = await this.laundryService.getStudentRequests(req.user.id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all pending requests (Staff only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPendingRequests(req, res) {
    try {
      const result = await this.laundryService.getPendingRequests();

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Mark laundry as collected (Staff only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markAsCollected(req, res) {
    try {
      const { id } = req.params;

      const result = await this.laundryService.markAsCollected(id, req.user.id);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Verify laundry items (Staff only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyItems(req, res) {
    try {
      const { id } = req.params;
      const { receivedItems, notes } = req.body;

      const result = await this.laundryService.verifyItems(
        id,
        receivedItems,
        req.user.id,
        notes
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update laundry status (Student/Staff)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.laundryService.updateStatus(
        id,
        status,
        req.user.id
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get laundry by status (Staff/Admin)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getByStatus(req, res) {
    try {
      const { status } = req.params;

      const result = await this.laundryService.getByStatus(status);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get requests with discrepancy (Staff/Admin)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWithDiscrepancy(req, res) {
    try {
      const result = await this.laundryService.getWithDiscrepancy();

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get laundry by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const laundry = await this.laundryService.repository.findById(id);

      if (!laundry) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Laundry request not found'
        });
      }

      // Check if user has access to this laundry
      if (req.user.role === 'student' && laundry.studentId.toString() !== req.user.id) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have access to this laundry request'
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: laundry
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get laundry statistics (Staff/Admin)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStatistics(req, res) {
    try {
      const result = await this.laundryService.getStatistics();

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all laundry requests (Admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllRequests(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const conditions = {};
      if (status) {
        conditions.status = status;
      }

      const requests = await this.laundryService.repository.findMany(conditions, {
        sort: { createdAt: -1 },
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit)
      });

      const total = await this.laundryService.repository.count(conditions);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          requests,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new LaundryController();
