/**
 * Laundry Service Unit Tests
 *
 * Tests for laundry service functionality including polymorphism.
 */

const LaundryService = require('../../src/services/laundry.service');
const LaundryRepository = require('../../src/repositories/laundry.repository');
const UserRepository = require('../../src/repositories/user.repository');

// Mock dependencies
jest.mock('../../src/repositories/laundry.repository');
jest.mock('../../src/repositories/user.repository');

describe('LaundryService - Unit Tests', () => {
  let laundryService;

  beforeEach(() => {
    jest.clearAllMocks();
    laundryService = new LaundryService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createRequest', () => {
    it('should create laundry request successfully', async () => {
      const laundryData = {
        studentId: '123',
        declaredItems: 10
      };

      const mockStudent = {
        _id: '123',
        name: 'Test Student',
        email: 'student@test.com',
        role: 'student',
        bagNumber: 'BAG1001',
        roomNumber: 'A101'
      };

      const mockLaundry = {
        _id: 'LR001',
        requestId: 'LR-2024-0001',
        studentId: '123',
        studentName: 'Test Student',
        declaredItems: 10,
        status: 'pending'
      };

      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStudent);
      LaundryRepository.prototype.create = jest.fn().mockResolvedValue(mockLaundry);

      const result = await laundryService.createRequest(laundryData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Laundry request submitted successfully');
      expect(result.data.declaredItems).toBe(10);
    });

    it('should fail if declared items is less than 1', async () => {
      const laundryData = {
        studentId: '123',
        declaredItems: 0
      };

      await expect(laundryService.createRequest(laundryData)).rejects.toThrow('Declared items must be at least 1');
    });

    it('should fail if student not found', async () => {
      const laundryData = {
        studentId: '123',
        declaredItems: 10
      };

      UserRepository.prototype.findById = jest.fn().mockResolvedValue(null);

      await expect(laundryService.createRequest(laundryData)).rejects.toThrow('Student not found');
    });

    it('should fail if student has no bag number', async () => {
      const laundryData = {
        studentId: '123',
        declaredItems: 10
      };

      const mockStudent = {
        _id: '123',
        name: 'Test Student',
        email: 'student@test.com',
        role: 'student',
        bagNumber: null
      };

      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStudent);

      await expect(laundryService.createRequest(laundryData)).rejects.toThrow('Student must be assigned a bag number');
    });
  });

  describe('markAsCollected', () => {
    it('should mark laundry as collected by staff', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'pending',
        studentId: '123'
      };

      const mockStaff = {
        _id: 'S001',
        role: 'staff',
        name: 'Test Staff'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStaff);
      LaundryRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockLaundry,
        status: 'collected',
        collectedBy: 'S001'
      });

      const result = await laundryService.markAsCollected('LR001', 'S001');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Laundry collected successfully');
    });

    it('should fail if laundry not found', async () => {
      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(null);

      await expect(laundryService.markAsCollected('LR001', 'S001')).rejects.toThrow('Laundry request not found');
    });

    it('should fail if status is not pending', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'collected',
        studentId: '123'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);

      await expect(laundryService.markAsCollected('LR001', 'S001')).rejects.toThrow('Can only collect pending laundry');
    });
  });

  describe('verifyItems - Discrepancy Detection', () => {
    it('should verify items without discrepancy', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'collected',
        declaredItems: 10,
        receivedItems: null,
        hasDiscrepancy: false
      };

      const mockStaff = {
        _id: 'S001',
        role: 'staff'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStaff);
      LaundryRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockLaundry,
        receivedItems: 10,
        hasDiscrepancy: false
      });

      const result = await laundryService.verifyItems('LR001', 10, 'S001', null);

      expect(result.success).toBe(true);
      expect(result.data.hasDiscrepancy).toBe(false);
      expect(result.data.discrepancyInfo).toBeNull();
    });

    it('should detect discrepancy when counts differ', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'collected',
        declaredItems: 10,
        receivedItems: null,
        hasDiscrepancy: false
      };

      const mockStaff = {
        _id: 'S001',
        role: 'staff'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStaff);
      LaundryRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockLaundry,
        receivedItems: 8,
        hasDiscrepancy: true
      });

      const result = await laundryService.verifyItems('LR001', 8, 'S001', 'Missing items');

      expect(result.success).toBe(true);
      expect(result.data.discrepancyInfo.hasDiscrepancy).toBe(true);
      expect(result.data.discrepancyInfo.declared).toBe(10);
      expect(result.data.discrepancyInfo.received).toBe(8);
      expect(result.data.discrepancyInfo.difference).toBe(2);
    });
  });

  describe('updateStatus - POLYMORPHISM Tests', () => {
    it('should handle student status update (confirm pickup)', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'ready',
        studentId: 'STU001'
      };

      const mockStudent = {
        _id: 'STU001',
        role: 'student'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStudent);
      LaundryRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockLaundry,
        status: 'delivered'
      });

      const result = await laundryService.updateStatus('LR001', 'delivered', 'STU001');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Pickup confirmed successfully');
    });

    it('should handle staff status update (washing to ready)', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'washing',
        studentId: 'STU001'
      };

      const mockStaff = {
        _id: 'S001',
        role: 'staff'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStaff);
      LaundryRepository.prototype.updateById = jest.fn().mockResolvedValue({
        ...mockLaundry,
        status: 'ready'
      });

      const result = await laundryService.updateStatus('LR001', 'ready', 'S001');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Status updated successfully');
    });

    it('should fail when student tries to update to non-delivered status', async () => {
      const mockLaundry = {
        _id: 'LR001',
        status: 'ready',
        studentId: 'STU001'
      };

      const mockStudent = {
        _id: 'STU001',
        role: 'student'
      };

      LaundryRepository.prototype.findById = jest.fn().mockResolvedValue(mockLaundry);
      UserRepository.prototype.findById = jest.fn().mockResolvedValue(mockStudent);

      await expect(
        laundryService.updateStatus('LR001', 'washing', 'STU001')
      ).rejects.toThrow('Students can only confirm pickup');
    });
  });

  describe('getStatistics', () => {
    it('should return laundry statistics', async () => {
      const mockStats = {
        pending: 5,
        collected: 3,
        washing: 2,
        ready: 4,
        delivered: 10,
        total: 24
      };

      LaundryRepository.prototype.getAllStatusCounts = jest.fn().mockResolvedValue(mockStats);
      LaundryRepository.prototype.getDiscrepancyCount = jest.fn().mockResolvedValue(2);

      const result = await laundryService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data.total).toBe(24);
      expect(result.data.discrepancyCount).toBe(2);
    });
  });
});

// Test Output Summary:
// ✓ Should create laundry request successfully
// ✓ Should fail if declared items is less than 1
// ✓ Should fail if student not found
// ✓ Should fail if student has no bag number
// ✓ Should mark laundry as collected by staff
// ✓ Should fail if laundry not found
// ✓ Should fail if status is not pending
// ✓ Should verify items without discrepancy
// ✓ Should detect discrepancy when counts differ
// ✓ Should handle student status update (confirm pickup)
// ✓ Should handle staff status update (washing to ready)
// ✓ Should fail when student tries to update to non-delivered status
// ✓ Should return laundry statistics
