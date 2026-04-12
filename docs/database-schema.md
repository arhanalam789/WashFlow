# WashFlow - Database Schema Documentation

## Overview

WashFlow uses MongoDB with a simple two-collection schema. The database is designed to be efficient while maintaining all required data for laundry management.

## Collections

### 1. Users Collection

Stores all user accounts (students, staff, admins) with role-specific fields.

```javascript
{
  _id: ObjectId,              // Auto-generated primary key
  email: String,              // Unique, required
  password: String,           // Hashed with bcrypt (10 rounds)
  role: String,               // Enum: "student" | "staff" | "admin"
  name: String,               // User's full name (required)

  // Student-specific fields
  studentId: String,          // Unique student ID (nullable)
  roomNumber: String,         // Hostel room number (nullable)
  bagNumber: String,          // Assigned laundry bag number (nullable, unique)

  // Staff-specific fields
  employeeId: String,         // Employee ID (nullable, unique)

  // Admin-specific fields
  adminId: String,            // Admin ID (nullable, unique)

  isActive: Boolean,          // Account status (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

#### Indexes

- `email` (unique)
- `role`
- `studentId` (unique, sparse)
- `bagNumber` (unique, sparse)
- `employeeId` (unique, sparse)
- `adminId` (unique, sparse)

#### Validation Rules

- `email`: Must be valid email format, unique across all users
- `password`: Minimum 6 characters
- `role`: Must be one of: student, staff, admin
- `bagNumber`: Must be unique if assigned

### 2. LaundryRequests Collection

Stores all laundry requests with status tracking and discrepancy detection.

```javascript
{
  _id: ObjectId,              // Auto-generated primary key
  requestId: String,          // Unique request ID (e.g., "LR-2024-0001")
  studentId: ObjectId,        // Reference to User (required)
  studentName: String,        // Denormalized for performance
  studentEmail: String,       // Denormalized for performance
  bagNumber: String,          // Student's bag number
  roomNumber: String,         // Student's room number (denormalized)

  // Item count tracking
  declaredItems: Number,      // Items declared by student (required, min: 1)
  receivedItems: Number,      // Items counted by staff (nullable)

  // Discrepancy tracking
  hasDiscrepancy: Boolean,    // true if declared ≠ received (default: false)
  discrepancyNotes: String,   // Notes about discrepancy (nullable)

  // Status workflow
  status: String,             // Enum: "pending" | "collected" | "washing" | "ready" | "delivered"

  // Audit trail
  collectedBy: ObjectId,      // Reference to User (staff) who collected
  collectedAt: Date,          // When clothes were collected
  verifiedBy: ObjectId,       // Reference to User (staff) who verified
  verifiedAt: Date,           // When verification was done
  deliveredAt: Date,          // When pickup was confirmed

  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

#### Indexes

- `requestId` (unique)
- `studentId`
- `status`
- `bagNumber`
- `createdAt` (descending, for sorting)

#### Validation Rules

- `declaredItems`: Must be at least 1
- `receivedItems`: Cannot be negative
- `status`: Must follow valid transitions

### Status Workflow

```
pending → collected → washing → ready → delivered
```

#### Valid Transitions

| Current Status | Next Status | Who Can Change | Action Required |
|----------------|-------------|----------------|-----------------|
| pending | collected | Staff | Click "Collect" |
| collected | washing | Staff | After verification |
| washing | ready | Staff | Click "Mark Ready" |
| ready | delivered | Student | Click "Confirm Pickup" |

## Discrepancy Detection

A discrepancy is automatically flagged when:

```javascript
hasDiscrepancy = (declaredItems !== receivedItems)
```

Example:
- Student declares: 10 items
- Staff receives: 8 items
- Result: `hasDiscrepancy = true`, `difference = 2`

## Relationships

```
User (student) ||--o{ LaundryRequest : submits
User (staff)   }o--|| LaundryRequest : collects
User (staff)   }o--|| LaundryRequest : verifies
```

## Query Patterns

### Common Queries

1. **Get student's laundry requests**
   ```javascript
   db.laundry_requests.find({ studentId: ObjectId("...") })
     .sort({ createdAt: -1 })
   ```

2. **Get pending requests for staff**
   ```javascript
   db.laundry_requests.find({ status: "pending" })
     .sort({ createdAt: 1 })
   ```

3. **Get requests with discrepancy**
   ```javascript
   db.laundry_requests.find({ hasDiscrepancy: true })
     .sort({ createdAt: -1 })
   ```

4. **Get user by email**
   ```javascript
   db.users.findOne({ email: "student@test.com", isActive: true })
   ```

5. **Get student by bag number**
   ```javascript
   db.users.findOne({ bagNumber: "BAG1001", role: "student", isActive: true })
   ```

## Performance Considerations

### Denormalization

Student information (name, email, roomNumber) is denormalized in LaundryRequest for:
- Faster queries (no population needed)
- Better performance on list views
- Reduced database joins

### Indexes

Critical indexes for performance:
- `requestId` (unique) - Fast lookups by request ID
- `studentId` - Fast student queries
- `status` - Filtered views by status
- `createdAt` - Time-based sorting

## Data Integrity

### Constraints

1. **Email uniqueness**: No two users can have the same email
2. **Bag number uniqueness**: Only one student per bag number
3. **Role validation**: Only valid roles allowed
4. **Status transitions**: Enforced at application level

### Cascade Behavior

- User deletion: Related laundry requests remain (historical data)
- Bag reassignment: Old laundry keeps original bag number

## Scaling Considerations

### Current Schema Supports

- Up to 10,000+ users
- Up to 100,000+ laundry requests
- Efficient queries with proper indexes

### Future Improvements

For larger scale (>1M requests):
1. Add sharding key based on createdAt
2. Archive old requests (delivered > 1 year)
3. Add caching layer (Redis)
4. Consider read replicas

## Security Notes

1. **Passwords**: Never stored in plain text, always hashed
2. **PII**: Email and student IDs are sensitive
3. **Audit trail**: All status changes tracked with user and timestamp
4. **Soft delete**: Users deactivated, not deleted (preserves data)

## Migration Notes

### Schema Version: 1.0

This is the initial schema. Future versions may include:
- Activity logging collection
- Notification preferences
- Bag assignment history
- Laundry categories (separate items vs. grouped)
