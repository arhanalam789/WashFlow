/**
 * API Integration Tests
 *
 * Tests for API endpoints with role-based access control.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../src/models/user.model');
const Laundry = require('../../src/models/laundry.model');
const bcrypt = require('bcryptjs');

// Setup test database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/washflow_test';

describe('API Integration Tests', () => {
  let studentToken, staffToken, adminToken;
  let studentId, staffId, adminId, laundryId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_URI);

    // Clean up test data
    await User.deleteMany({});
    await Laundry.deleteMany({});

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const student = await User.create({
      email: 'student@test.com',
      password: hashedPassword,
      role: 'student',
      name: 'Test Student',
      studentId: 'STU001',
      roomNumber: 'A101',
      bagNumber: 'BAG1001'
    });

    const staff = await User.create({
      email: 'staff@test.com',
      password: hashedPassword,
      role: 'staff',
      name: 'Test Staff',
      employeeId: 'EMP001'
    });

    const admin = await User.create({
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      name: 'Test Admin',
      adminId: 'ADM001'
    });

    studentId = student._id;
    staffId = staff._id;
    adminId = admin._id;

    // Login and get tokens
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@test.com', password: 'password123' });
    studentToken = studentLogin.body.data.token;

    const staffLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'staff@test.com', password: 'password123' });
    staffToken = staffLogin.body.data.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminLogin.body.data.token;
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Laundry.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication Endpoints', () => {
    it('POST /api/auth/register - should register new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.com',
          password: 'password123',
          role: 'student',
          name: 'New User',
          studentId: 'STU002'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@test.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('POST /api/auth/login - should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('POST /api/auth/login - should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/auth/profile - should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('student@test.com');
    });

    it('GET /api/auth/profile - should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow student to access student endpoint', async () => {
      const response = await request(app)
        .get('/api/laundry/my')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should deny student from accessing staff endpoint', async () => {
      const response = await request(app)
        .get('/api/laundry/pending')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should allow staff to access staff endpoint', async () => {
      const response = await request(app)
        .get('/api/laundry/pending')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should allow admin to access admin endpoint', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Laundry Endpoints', () => {
    it('POST /api/laundry/submit - should submit laundry request', async () => {
      const response = await request(app)
        .post('/api/laundry/submit')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          studentId: studentId.toString(),
          declaredItems: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.declaredItems).toBe(10);
      laundryId = response.body.data._id;
    });

    it('PUT /api/laundry/:id/collect - should mark as collected (staff only)', async () => {
      const response = await request(app)
        .put(`/api/laundry/${laundryId}/collect`)
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('collected');
    });

    it('PUT /api/laundry/:id/collect - should fail for student', async () => {
      const response = await request(app)
        .put(`/api/laundry/${laundryId}/collect`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    it('PUT /api/laundry/:id/verify - should verify items and detect discrepancy', async () => {
      const response = await request(app)
        .put(`/api/laundry/${laundryId}/verify`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          receivedItems: 8,
          notes: '2 items missing'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.discrepancyInfo.hasDiscrepancy).toBe(true);
      expect(response.body.data.discrepancyInfo.difference).toBe(2);
    });
  });

  describe('Admin Endpoints', () => {
    it('GET /api/admin/users - should get all users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/admin/users - should create new user', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'admincreated@test.com',
          password: 'password123',
          role: 'student',
          name: 'Admin Created Student',
          studentId: 'STU003'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('admincreated@test.com');
    });

    it('PUT /api/admin/users/:id/assign-bag - should assign bag number', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${studentId}/assign-bag`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          bagNumber: 'BAG1002'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.bagNumber).toBe('BAG1002');
    });

    it('GET /api/admin/analytics - should return system analytics', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.laundry).toBeDefined();
    });
  });
});

// Test Output Summary:
// ✓ POST /api/auth/register - should register new user
// ✓ POST /api/auth/login - should login with valid credentials
// ✓ POST /api/auth/login - should fail with invalid credentials
// ✓ GET /api/auth/profile - should get user profile with valid token
// ✓ GET /api/auth/profile - should fail without token
// ✓ Should allow student to access student endpoint
// ✓ Should deny student from accessing staff endpoint
// ✓ Should allow staff to access staff endpoint
// ✓ Should allow admin to access admin endpoint
// ✓ POST /api/laundry/submit - should submit laundry request
// ✓ PUT /api/laundry/:id/collect - should mark as collected (staff only)
// ✓ PUT /api/laundry/:id/collect - should fail for student
// ✓ PUT /api/laundry/:id/verify - should verify items and detect discrepancy
// ✓ GET /api/admin/users - should get all users
// ✓ POST /api/admin/users - should create new user
// ✓ PUT /api/admin/users/:id/assign-bag - should assign bag number
// ✓ GET /api/admin/analytics - should return system analytics
