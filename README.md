# WashFlow - Smart Laundry Management System

A simplified Laundry Management System for college hostels with complete OOP implementation, Design Patterns, and SOLID principles.

## 🎯 Academic Project Requirements Met

### ✅ All 4 OOP Concepts Demonstrated

| Concept | Location | Description |
|---------|----------|-------------|
| **Encapsulation** | `backend/src/models/base.model.js` | Data and methods bundled in BaseModel class |
| **Abstraction** | `backend/src/repositories/base.repository.js` | Abstract base classes define contracts |
| **Inheritance** | `backend/src/models/student.model.js` | StudentModel extends UserModel |
| **Polymorphism** | `backend/src/services/laundry.service.js` | `updateStatus()` behaves differently based on user role |

### ✅ 2 Design Patterns Implemented

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Singleton** | `backend/src/config/database.config.js` | Single database connection instance |
| **Factory** | `backend/src/factories/user.factory.js` | Create user models based on role |

### ✅ All 5 SOLID Principles

| Principle | Implementation |
|-----------|----------------|
| **SRP** | Each class has single responsibility (e.g., UserRepository only handles data access) |
| **OCP** | UserFactory allows adding roles without modifying existing code |
| **LSP** | StudentModel can substitute UserModel without breaking functionality |
| **ISP** | BaseService has focused, minimal interface |
| **DIP** | Controllers depend on Service abstractions, not concretions |

### ✅ All 4 UML Diagrams

- **Use Case Diagram** - `docs/uml-diagrams/use-case.puml`
- **Class Diagram** - `docs/uml-diagrams/class-diagram.puml`
- **Sequence Diagram** - `docs/uml-diagrams/sequence-diagram.puml`
- **ER Diagram** - `docs/uml-diagrams/er-diagram.puml`

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation

**Frontend:**
- React 18
- React Router
- Axios
- Vite

### Project Structure

```
WashFlow/
├── backend/
│   ├── src/
│   │   ├── config/           # Database config (Singleton)
│   │   ├── models/           # OOP: Inheritance, Encapsulation
│   │   ├── repositories/     # Data access layer
│   │   ├── services/         # Business logic (SOLID)
│   │   ├── factories/        # Factory Pattern
│   │   ├── controllers/      # HTTP handlers
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   └── routes/           # API endpoints
│   ├── tests/                # Unit & integration tests
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/            # React pages
│       ├── services/         # API wrapper
│       └── App.jsx
├── docs/
│   ├── uml-diagrams/         # All 4 UML diagrams
│   └── database-schema.md    # Database documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WashFlow
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Environment Variables**

   Backend (create `backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/washflow
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend** (from backend directory)
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

3. **Start Frontend** (from frontend directory)
   ```bash
   npm run dev
   ```
   App runs on http://localhost:3000

### Demo Credentials

After first login, register your own users or use:
- Student: student@test.com / password123
- Staff: staff@test.com / password123
- Admin: admin@test.com / password123

## 📱 Features

### For Students
- ✅ Submit laundry requests with item count
- ✅ Track laundry status in real-time
- ✅ View request history
- ✅ Confirm pickup when ready

### For Laundry Staff
- ✅ View all pending requests
- ✅ Mark clothes as collected
- ✅ Verify item counts
- ✅ Flag discrepancies automatically
- ✅ Update status through workflow

### For Administrators
- ✅ Create and manage users
- ✅ Assign bag numbers to students
- ✅ View system analytics
- ✅ Manage user accounts

## 🔄 Workflow

```
Student → Submit → Pending
              ↓
Staff → Collect → Collected
              ↓
Staff → Verify → Washing (if count matches)
              ↓
Staff → Mark Ready → Ready
              ↓
Student → Confirm Pickup → Delivered
```

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

- **Unit Tests**: Services (Auth, Laundry)
- **Integration Tests**: API endpoints with RBAC
- **Test Cases**: Expected/Actual outputs documented

## 📊 Database Schema

Two main collections:

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: "student" | "staff" | "admin",
  name: String,
  studentId: String (optional),
  bagNumber: String (optional, unique),
  employeeId: String (optional),
  isActive: Boolean
}
```

### LaundryRequests Collection
```javascript
{
  requestId: String (unique),
  studentId: ObjectId (ref: User),
  declaredItems: Number,
  receivedItems: Number,
  hasDiscrepancy: Boolean,
  status: "pending" | "collected" | "washing" | "ready" | "delivered",
  collectedBy: ObjectId (ref: User),
  verifiedBy: ObjectId (ref: User)
}
```

See `docs/database-schema.md` for complete schema documentation.

## 🔐 Authentication & Authorization

### JWT-Based Authentication

- Token-based authentication
- Role-based access control (RBAC)
- Protected routes for each role
- Token expiration: 7 days (configurable)

### Access Control

| Endpoint | Student | Staff | Admin |
|----------|---------|-------|-------|
| /api/laundry/submit | ✅ | ❌ | ❌ |
| /api/laundry/pending | ❌ | ✅ | ✅ |
| /api/admin/users | ❌ | ❌ | ✅ |

## 🎨 OOP & Design Patterns Documentation

### Encapsulation Example

```javascript
// backend/src/models/base.model.js
class BaseModel {
  constructor(schema) {
    this._schema = schema;  // Encapsulated schema
  }

  async create(data) {
    const document = new this._schema(data);
    return await document.save();
  }
}
```

### Inheritance Example

```javascript
// backend/src/models/student.model.js
class StudentModel extends UserModel {
  async findByStudentId(studentId) {
    // Student-specific implementation
  }
}
```

### Polymorphism Example

```javascript
// backend/src/services/laundry.service.js
async updateStatus(laundryId, newStatus, userId) {
  const user = await this.getUserById(userId);

  // Polymorphic behavior based on role
  if (user.role === 'student') {
    return await this.markAsPickedUp(laundryId);
  } else if (user.role === 'staff') {
    return await this.staffUpdate(laundryId, newStatus);
  }
}
```

### Factory Pattern Example

```javascript
// backend/src/factories/user.factory.js
class UserFactory {
  static createUser(role) {
    switch(role) {
      case 'student': return new StudentModel();
      case 'staff': return new StaffModel();
      case 'admin': return new AdminModel();
    }
  }
}
```

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Laundry (Student)
- `POST /api/laundry/submit` - Submit laundry request
- `GET /api/laundry/my` - Get my requests

### Laundry (Staff)
- `GET /api/laundry/pending` - Get pending requests
- `PUT /api/laundry/:id/collect` - Mark as collected
- `PUT /api/laundry/:id/verify` - Verify items
- `PUT /api/laundry/:id/status` - Update status

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id/assign-bag` - Assign bag number
- `GET /api/admin/analytics` - Get system analytics

## 🐛 Error Handling

Centralized error handling middleware:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 📝 License

This project is created for academic purposes.

## 👥 Contributors

- Project: WashFlow
- Year: 2024
- Purpose: Academic project demonstrating OOP, Design Patterns, and SOLID principles

## 📚 Documentation

- [Database Schema](docs/database-schema.md)
- [UML Diagrams](docs/uml-diagrams/)
- [API Documentation](#api-endpoints)
- [OOP & Patterns](#oop--design-patterns-documentation)
