/**
 * Laundry Schema
 * Mongoose schema for Laundry Request documents
 */

const mongoose = require('mongoose');
const { LAUNDRY_STATUS } = require('../config/constants');

const laundrySchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  bagNumber: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String
  },
  declaredItems: {
    type: Number,
    required: true,
    min: 1
  },
  receivedItems: {
    type: Number,
    default: null
  },
  hasDiscrepancy: {
    type: Boolean,
    default: false
  },
  discrepancyNotes: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(LAUNDRY_STATUS),
    default: LAUNDRY_STATUS.PENDING
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  collectedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
laundrySchema.index({ requestId: 1 });
laundrySchema.index({ studentId: 1 });
laundrySchema.index({ status: 1 });
laundrySchema.index({ bagNumber: 1 });
laundrySchema.index({ createdAt: -1 });

const Laundry = mongoose.model('Laundry', laundrySchema);

module.exports = Laundry;
