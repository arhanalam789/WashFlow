/**
 * Auth Service Unit Tests
 *
 * Tests for authentication service functionality.
 */

const AuthService = require('../../src/services/auth.service');
const UserRepository = require('../../src/repositories/user.repository');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../../src/repositories/user.repository');
jest.mock('bcryptjs');

describe('AuthService - Unit Tests', () => {
  let authService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set environment variables
    process.env.JWT_SECRET = 'test_secret_key';
    process.env.JWT_EXPIRE = '7d';

    authService = new AuthService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should register a new student successfully', async () => {
      const userData = {
        email: 'test@student.com',
        password: 'password123',
        role: 'student',
        name: 'Test Student',
        studentId: 'STU001',
        roomNumber: 'A101'
      };

      // Mock repository methods
      UserRepository.prototype.emailExists = jest.fn().mockResolvedValue(false);
      UserRepository.prototype.studentIdExists = jest.fn().mockResolvedValue(false);
      UserRepository.prototype.create = jest.fn().mockResolvedValue({
        _id: '123',
        ...userData,
        password: 'hashed_password'
      });

      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration successful');
      expect(result.data.user.email).toBe(userData.email);
      expect(result.data.token).toBeDefined();
    });

    it('should fail if email already exists', async () => {
      const userData = {
        email: 'existing@test.com',
        password: 'password123',
        role: 'student',
        name: 'Test Student'
      };

      UserRepository.prototype.emailExists = jest.fn().mockResolvedValue(true);

      await expect(authService.register(userData)).rejects.toThrow('User with this email already exists');
    });

    it('should fail if student ID already exists', async () => {
      const userData = {
        email: 'test@student.com',
        password: 'password123',
        role: 'student',
        name: 'Test Student',
        studentId: 'STU001'
      };

      UserRepository.prototype.emailExists = jest.fn().mockResolvedValue(false);
      UserRepository.prototype.studentIdExists = jest.fn().mockResolvedValue(true);

      await expect(authService.register(userData)).rejects.toThrow('Student ID already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      const mockUser = {
        _id: '123',
        email: credentials.email,
        password: 'hashed_password',
        role: 'student',
        name: 'Test User'
      };

      UserRepository.prototype.findByEmail = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.data.user.email).toBe(credentials.email);
      expect(result.data.token).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const credentials = {
        email: 'wrong@test.com',
        password: 'password123'
      };

      UserRepository.prototype.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
    });

    it('should fail with invalid password', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: '123',
        email: credentials.email,
        password: 'hashed_password',
        role: 'student',
        name: 'Test User'
      };

      UserRepository.prototype.findByEmail = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const jwt = require('jsonwebtoken');
      const mockToken = jwt.sign(
        { id: '123', email: 'test@test.com', role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const result = await authService.verifyToken(mockToken);

      expect(result.id).toBe('123');
      expect(result.email).toBe('test@test.com');
      expect(result.role).toBe('student');
    });

    it('should fail with invalid token', async () => {
      await expect(authService.verifyToken('invalid_token')).rejects.toThrow('Unauthorized access');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: 'old_hashed_password',
        role: 'student'
      };

      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockUser);
      UserRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockUser,
        password: 'new_hashed_password'
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest.fn().mockResolvedValue('new_hashed_password');

      const result = await authService.changePassword('123', 'oldpassword', 'newpassword');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password changed successfully');
    });

    it('should fail with wrong current password', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'student'
      };

      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(
        authService.changePassword('123', 'wrongpassword', 'newpassword')
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});

// Test Output Summary:
// ✓ Should register a new student successfully
// ✓ Should fail if email already exists
// ✓ Should fail if student ID already exists
// ✓ Should login user with valid credentials
// ✓ Should fail with invalid email
// ✓ Should fail with invalid password
// ✓ Should verify valid token
// ✓ Should fail with invalid token
// ✓ Should change password successfully
// ✓ Should fail with wrong current password
