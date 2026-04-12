/**
 * Student Model - Inheritance (OOP Concept)
 *
 * This class demonstrates Inheritance from UserModel.
 * StudentModel inherits all methods from UserModel and adds
 * student-specific functionality.
 *
 * OOP Concept: Inheritance
 * - Extends: UserModel
 * - Inherits: All UserModel methods
 * - Extends: Student-specific methods
 * - 'Is-a' relationship: StudentModel IS-A UserModel
 */

const UserModel = require('./user-class.model');
const { USER_ROLES } = require('../config/constants');

class StudentModel extends UserModel {
  constructor() {
    super();
    this._modelName = 'Student';
  }

  /**
   * Find student by student ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Document|null>} Found student or null
   */
  async findByStudentId(studentId) {
    try {
      return await this._schema.findOne({
        studentId,
        role: USER_ROLES.STUDENT,
        isActive: true
      });
    } catch (error) {
      throw new Error(`Error finding student by ID: ${error.message}`);
    }
  }

  /**
   * Find student by bag number
   * @param {string} bagNumber - Bag number
   * @returns {Promise<Document|null>} Found student or null
   */
  async findByBagNumber(bagNumber) {
    try {
      return await this._schema.findOne({
        bagNumber,
        role: USER_ROLES.STUDENT,
        isActive: true
      });
    } catch (error) {
      throw new Error(`Error finding student by bag number: ${error.message}`);
    }
  }

  /**
   * Get all students
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of students
   */
  async getAllStudents(options = {}) {
    try {
      return await this.findMany(
        { role: USER_ROLES.STUDENT, isActive: true },
        options
      );
    } catch (error) {
      throw new Error(`Error getting all students: ${error.message}`);
    }
  }

  /**
   * Get students by room number
   * @param {string} roomNumber - Room number
   * @returns {Promise<Array>} Array of students in the room
   */
  async getByRoomNumber(roomNumber) {
    try {
      return await this.findMany({
        roomNumber,
        role: USER_ROLES.STUDENT,
        isActive: true
      });
    } catch (error) {
      throw new Error(`Error getting students by room: ${error.message}`);
    }
  }

  /**
   * Assign bag number to student
   * @param {string} studentId - Student ID
   * @param {string} bagNumber - Bag number to assign
   * @returns {Promise<Document|null>} Updated student or null
   */
  async assignBagNumber(studentId, bagNumber) {
    try {
      return await this._schema.findOneAndUpdate(
        { studentId, role: USER_ROLES.STUDENT },
        { bagNumber },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error assigning bag number: ${error.message}`);
    }
  }

  /**
   * Check if bag number is assigned to any student
   * @param {string} bagNumber - Bag number to check
   * @returns {Promise<boolean>} True if assigned, false otherwise
   */
  async isBagNumberAssigned(bagNumber) {
    try {
      const count = await this._schema.countDocuments({
        bagNumber,
        role: USER_ROLES.STUDENT,
        isActive: true
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking bag number assignment: ${error.message}`);
    }
  }

  /**
   * Create new student
   * @param {Object} data - Student data
   * @returns {Promise<Document>} Created student
   */
  async createStudent(data) {
    try {
      const studentData = {
        ...data,
        role: USER_ROLES.STUDENT
      };
      return await this.create(studentData);
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }
}

module.exports = StudentModel;
