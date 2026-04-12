/**
 * Authentication Controller
 *
 * Handles authentication-related HTTP requests.
 * Demonstrates separation of concerns by delegating business logic to service layer.
 */

const AuthService = require('../services/auth.service');
const { HTTP_STATUS } = require('../config/constants');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  /**
   * Register new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const result = await this.authService.register(req.body);

      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Login user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const result = await this.authService.login(req.body);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      const user = await this.authService.getUserById(req.user.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Change password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const result = await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
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
   * Refresh token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async refreshToken(req, res) {
    try {
      // For simplicity, we'll generate a new token based on current user
      const user = await this.authService.getUserById(req.user.id);

      // Generate new token
      const jwt = require('jsonwebtoken');
      const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
      const jwtExpiresIn = process.env.JWT_EXPIRE || '7d';

      const token = jwt.sign(
        {
          id: user._id || user.id,
          email: user.email,
          role: user.role
        },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          user,
          token
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

module.exports = new AuthController();
