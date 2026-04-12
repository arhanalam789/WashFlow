/**
 * User Schema
 * Mongoose schema for User documents
 */

const mongoose = require('mongoose');
const { USER_ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Student-specific fields
  studentId: {
    type: String,
    sparse: true,
    unique: true
  },
  roomNumber: {
    type: String
  },
  bagNumber: {
    type: String,
    sparse: true,
    unique: true
  },

  // Staff-specific fields
  employeeId: {
    type: String,
    sparse: true,
    unique: true
  },

  // Admin-specific fields
  adminId: {
    type: String,
    sparse: true,
    unique: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ studentId: 1 });
userSchema.index({ bagNumber: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
