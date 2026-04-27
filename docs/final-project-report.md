# WashFlow: Laundry Management System

## Project Report

**Project Name:** WashFlow  
**Project Type:** Full-Stack Laundry Management Website  
**Course Area:** System Design, OOP, SOLID Principles, Design Patterns, UML, and Web Application Development  

**Team Members:**

- Kartik Madaan
- Arhan Alam

**Technology Stack:**

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- Documentation: UML diagrams, ER diagrams, test cases, viva notes, and project report

---

## 1. Abstract

WashFlow is a role-based laundry management system designed to simplify the process of creating, assigning, processing, tracking, and resolving laundry service requests. The system allows customers to create laundry requests, admins to assign requests to washing centers, managers to process assigned requests, and customers to track notifications and confirm concern tickets.

The project was built as a full-stack web application using React for the frontend and Node.js, Express, TypeScript, MongoDB, and Mongoose for the backend. It follows a layered backend architecture and demonstrates important system design concepts such as SOLID principles, Repository Pattern, Factory Pattern, Dependency Injection, role-based access control, and UML/ER modeling.

---

## 2. Problem Statement

Laundry service coordination can become difficult when customers, washing center staff, and admins communicate through disconnected channels. Without a central system, it becomes hard to track request status, assign work, notify customers, verify clothes count, and handle service issues.

WashFlow solves this problem by providing one centralized platform where:

- Customers can create and track laundry requests.
- Admins can assign requests to washing centers.
- Managers can process requests assigned to their washing center.
- Customers can receive notifications and confirm concern tickets.

---

## 3. Project Objectives

The main objectives of WashFlow are:

- Build a working role-based laundry management application.
- Demonstrate system design through layered architecture.
- Apply SOLID principles in backend design.
- Use design patterns in real project files.
- Maintain UML, ER, and sequence diagrams.
- Provide a demo-ready full-stack workflow.
- Add tests to prove important business rules.
- Prepare documentation for viva and project submission.

---

## 4. System Users And Roles

### Customer

The customer is the user who creates laundry requests.

Customer responsibilities:

- Register and log in.
- Create laundry request.
- Specify clothes count and pickup date.
- Track request status.
- View notifications.
- Confirm concern tickets.

### Admin

The admin controls request assignment and customer communication.

Admin responsibilities:

- View all laundry requests.
- Assign requests to washing centers.
- Send general notifications to customers.

### Washing Center Manager

The manager processes requests assigned to their washing center.

Manager responsibilities:

- View incoming requests for their assigned washing center.
- Verify clothes count.
- Move request status to in progress.
- Mark request as completed.
- Raise concern tickets for count mismatch, missing items, delivery issues, or general issues.

---

## 5. System Workflow

The main WashFlow workflow is:

1. Customer signs up or logs in.
2. Customer creates a laundry request with clothes count and pickup date.
3. Admin assigns the request to a washing center.
4. Manager of that washing center views the request.
5. Manager verifies clothes count and moves the request to `in_progress`.
6. Manager marks the request as `completed`, or raises a concern if there is an issue.
7. Customer receives notifications during the process.
8. Customer confirms concern ticket if one was raised.

The request lifecycle follows controlled status transitions:

```text
pending -> assigned -> in_progress -> completed
```

Concern flow:

```text
in_progress -> concern_raised -> in_progress/completed
```

Invalid transitions such as `pending -> completed` are rejected by the backend.

---

## 6. Technology Stack

### Frontend

The frontend is built with:

- React
- Vite
- JavaScript / JSX
- CSS

The frontend provides different dashboards for customers, managers, and admins.

### Backend

The backend is built with:

- Node.js
- Express.js
- TypeScript
- JWT authentication
- bcryptjs password hashing

The backend exposes REST APIs for authentication, laundry requests, washing centers, notifications, and concern tickets.

### Database

The runtime database is MongoDB, accessed through Mongoose models. The project also includes a conceptual SQL schema to explain ER relationships in a relational format.

Important note:

```text
MongoDB/Mongoose = actual implementation
db/schema.sql = conceptual relational schema for documentation
```

---

## 7. Architecture

WashFlow backend follows a layered architecture:

```text
Route -> Controller -> Service -> Repository -> Mongoose Model -> MongoDB
```

### Route Layer

Routes define API endpoints and apply authentication middleware.

Examples:

- `Backend/src/routes/auth.ts`
- `Backend/src/routes/requests.ts`
- `Backend/src/routes/concerns.ts`
- `Backend/src/routes/notifications.ts`
- `Backend/src/routes/washing-centers.ts`

### Controller Layer

Controllers receive HTTP requests and send HTTP responses. They do not contain core business logic.

Examples:

- `Backend/src/controllers/auth.controller.ts`
- `Backend/src/controllers/laundry-request.controller.ts`
- `Backend/src/controllers/concern.controller.ts`
- `Backend/src/controllers/notification.controller.ts`

### Service Layer

Services contain business rules.

Examples:

- `Backend/src/services/auth.service.ts`
- `Backend/src/services/laundry-request.service.ts`
- `Backend/src/services/concern.service.ts`
- `Backend/src/services/notification.service.ts`

### Repository Layer

Repositories isolate database operations from business logic.

Examples:

- `Backend/src/repositories/user.repository.ts`
- `Backend/src/repositories/laundry-request.repository.ts`
- `Backend/src/repositories/concern-ticket.repository.ts`
- `Backend/src/repositories/notification.repository.ts`
- `Backend/src/repositories/washing-center.repository.ts`

### Model Layer

Mongoose models define MongoDB document structure.

Examples:

- `Backend/src/models/user.model.ts`
- `Backend/src/models/laundry-request.model.ts`
- `Backend/src/models/washing-center.model.ts`
- `Backend/src/models/concern-ticket.model.ts`
- `Backend/src/models/notification.model.ts`

---

## 8. Main Modules

### Authentication Module

Files:

- `Backend/src/routes/auth.ts`
- `Backend/src/controllers/auth.controller.ts`
- `Backend/src/services/auth.service.ts`
- `Backend/src/models/user.model.ts`

Purpose:

- Register users.
- Log in users.
- Hash passwords.
- Generate JWT tokens.
- Store user roles.
- Assign managers to washing centers.

### Laundry Request Module

Files:

- `Backend/src/routes/requests.ts`
- `Backend/src/controllers/laundry-request.controller.ts`
- `Backend/src/services/laundry-request.service.ts`
- `Backend/src/repositories/laundry-request.repository.ts`
- `Backend/src/models/laundry-request.model.ts`

Purpose:

- Create laundry requests.
- Assign requests to washing centers.
- Track request status.
- Validate status transitions.
- Restrict manager access to assigned center.

### Concern Ticket Module

Files:

- `Backend/src/routes/concerns.ts`
- `Backend/src/controllers/concern.controller.ts`
- `Backend/src/services/concern.service.ts`
- `Backend/src/models/concern-ticket.model.ts`

Purpose:

- Raise concern tickets.
- Store expected and received clothes count.
- Mark request as `concern_raised`.
- Allow customer to confirm concern tickets.

### Notification Module

Files:

- `Backend/src/routes/notifications.ts`
- `Backend/src/controllers/notification.controller.ts`
- `Backend/src/services/notification.service.ts`
- `Backend/src/factories/notification.factory.ts`
- `Backend/src/models/notification.model.ts`

Purpose:

- Create request-related notifications.
- Create concern-related notifications.
- Send general admin updates.
- Mark notifications as read.

### Washing Center Module

Files:

- `Backend/src/routes/washing-centers.ts`
- `Backend/src/controllers/washing-center.controller.ts`
- `Backend/src/services/washing-center.service.ts`
- `Backend/src/models/washing-center.model.ts`

Purpose:

- Store washing center details.
- List washing centers.
- Seed default centers if none exist.

---

## 9. Database Entities

### User

Represents customers, managers, and admins.

Important fields:

- `name`
- `email`
- `passwordHash`
- `role`
- `assignedCenterId`

### WashingCenter

Represents a washing center.

Important fields:

- `centerName`
- `location`
- `contactPhone`
- `operationStatus`

### LaundryRequest

Represents a customer laundry request.

Important fields:

- `userId`
- `washingCenterId`
- `clothesCount`
- `preferredPickupDate`
- `status`

### ConcernTicket

Represents an issue raised by a manager.

Important fields:

- `requestId`
- `raisedByManagerId`
- `type`
- `expectedCount`
- `receivedCount`
- `customerConfirmed`

### Notification

Represents a message sent to a user.

Important fields:

- `userId`
- `requestId`
- `type`
- `message`
- `isRead`
- `sentAt`

---

## 10. Diagrams And Their Connection To Code

### Use Case Diagram

The use case diagram shows what each actor can do.

Connection to project:

- Customer actions map to auth, requests, notifications, and concerns routes.
- Admin actions map to request assignment and notification routes.
- Manager actions map to request status update and concern routes.

Main file:

- `diagrams/use-case-diagram.md`

### ER Diagram

The ER diagram shows the entities and relationships.

Connection to project:

- `USER` maps to `Backend/src/models/user.model.ts`.
- `LAUNDRY_REQUEST` maps to `Backend/src/models/laundry-request.model.ts`.
- `WASHING_CENTER` maps to `Backend/src/models/washing-center.model.ts`.
- `CONCERN_TICKET` maps to `Backend/src/models/concern-ticket.model.ts`.
- `NOTIFICATION` maps to `Backend/src/models/notification.model.ts`.

Main file:

- `diagrams/er-diagram.md`

### Class Diagram

The class diagram mainly maps to the conceptual OOP model under root `src/`.

Connection to project:

- `Entity` base class shows inheritance.
- `LaundryRequest` domain class shows behavior.
- `RequestObserver` and `NotificationService` show Observer Pattern.

Main file:

- `diagrams/class-diagram.md`

### Sequence Diagram

The sequence diagram shows runtime flow.

Connection to project:

```text
Frontend -> Controller -> Service -> Repository -> MongoDB
```

Main file:

- `diagrams/sequence-diagram.md`

---

## 11. Design Patterns Used

### Repository Pattern

Meaning:

Repository Pattern separates database access from business logic.

Where used:

- `Backend/src/repositories/*.ts`
- `Backend/src/repositories/interfaces/*.ts`

How used:

Services call repository methods instead of directly writing Mongoose queries.

Example:

`LaundryRequestService` calls `laundryRequestRepository.create(...)`, while `LaundryRequestRepository` performs the actual Mongoose operation.

Benefit:

- Services remain focused on business rules.
- Database logic is isolated.
- Testing becomes easier using fake repositories.

### Factory Pattern

Meaning:

Factory Pattern centralizes object creation.

Where used:

- `Backend/src/factories/notification.factory.ts`

How used:

`NotificationFactory` creates standard notification payloads for request creation, assignment, status updates, concern raised, and concern confirmation.

Benefit:

- Notification messages remain consistent.
- Less duplicate message creation logic.
- Easier to add new notification types.

### Dependency Injection

Meaning:

Dependency Injection means objects receive dependencies from outside instead of creating them internally.

Where used:

- `Backend/src/container/index.ts`

How used:

Repositories are created first, then injected into services, and services are injected into controllers.

Benefit:

- Low coupling.
- Easier testing.
- Clear dependency structure.

### Observer Pattern

Meaning:

Observer Pattern allows one object to notify other objects when its state changes.

Where used:

- `src/domain/LaundryRequest.ts`
- `src/interfaces/RequestObserver.ts`
- `src/services/NotificationService.ts`

How used:

The conceptual `LaundryRequest` class can attach observers and notify them when request assignment, status update, or concern events happen.

Important note:

The Observer Pattern is demonstrated in the root OOP domain model. The running backend uses service-triggered notifications.

---

## 12. SOLID Principles Used

### Single Responsibility Principle

Each file/layer has one main responsibility.

Proof:

- Routes map URLs.
- Controllers handle HTTP.
- Services handle business rules.
- Repositories handle database operations.
- Models define schemas.

### Open/Closed Principle

The notification system can be extended without rewriting controller logic.

Proof:

- New notification types can be added in `NotificationFactory`.
- Controllers do not need duplicated notification message logic.

### Liskov Substitution Principle

Services depend on repository interfaces, so real repositories can be replaced by fake repositories in tests.

Proof:

- Service tests use fake repositories.
- Services still work as long as the fake object follows the expected interface.

### Interface Segregation Principle

The project uses separate repository interfaces.

Proof:

- `IUserRepository`
- `ILaundryRequestRepository`
- `IConcernTicketRepository`
- `INotificationRepository`
- `IWashingCenterRepository`

There is no single large database interface.

### Dependency Inversion Principle

High-level services depend on abstractions instead of directly depending on database models.

Proof:

- Services depend on repository interfaces.
- Concrete repositories are wired in `Backend/src/container/index.ts`.

---

## 13. OOP Concepts Used

### Encapsulation

Business logic is kept inside service/domain classes.

Examples:

- Password hashing in `AuthService`.
- Status transition rules in `LaundryRequestService`.
- Concern validation in `ConcernService`.

### Abstraction

Repository interfaces hide database details from services.

Examples:

- `ILaundryRequestRepository`
- `IUserRepository`
- `RequestObserver`

### Inheritance

The root domain model uses a base `Entity` class.

Examples:

- `src/core/Entity.ts`
- `src/domain/User.ts`
- `src/domain/LaundryRequest.ts`
- `src/domain/Notification.ts`

### Polymorphism

Different implementations can be used through the same interface.

Examples:

- Real repositories and fake test repositories can both be used by services.
- Any class implementing `RequestObserver` can observe request events.

---

## 14. Security And Access Control

WashFlow uses JWT-based authentication.

Security features:

- Passwords are hashed using bcryptjs.
- JWT token stores user identity and role.
- Protected routes require authentication.
- Role-based access restricts actions.
- Managers can only process requests for their assigned washing center.

Examples:

- Customers can create requests.
- Admins can assign requests.
- Managers can update status only for their center's requests.

---

## 15. Testing

Backend service tests were added to verify important rules.

Test command:

```bash
cd Backend
npm test
```

Covered tests:

- Manager request listing passes assigned center ownership.
- Manager cannot update another center's request.
- Invalid request status transitions are rejected.
- Valid status updates create notifications.
- Manager cannot raise concerns for another center.
- Valid concern creation updates request status and creates a notification.

Build and verification commands:

```bash
cd Backend
npm test
npm run build

cd ../Frontend
npm run build
npm run lint
```

---

## 16. Limitations

Current limitations:

- Notifications are stored in the database but not pushed in real time.
- No payment integration is included.
- No delivery partner module is included.
- Manager assignment is supported in backend, but a full admin UI for changing manager-center assignment can be added later.
- Tests currently focus on service-level business rules; more integration tests can be added.

---

## 17. Future Goals

Future improvements can include:

- Real-time notifications using WebSocket or Socket.IO.
- Payment gateway integration.
- Delivery tracking and delivery staff module.
- Admin interface for managing users and manager-center assignments.
- Email/SMS notifications.
- Rating and feedback system for completed laundry requests.
- More detailed analytics dashboard for admins.
- In-memory MongoDB integration tests.
- Deployment to cloud platforms.
- Audit logs for request status changes.

---

## 18. Conclusion

WashFlow is a full-stack laundry management system built to demonstrate practical system design concepts. The project includes a working frontend, a layered backend, MongoDB persistence, authentication, role-based workflows, request lifecycle management, notifications, concern ticket handling, diagrams, documentation, and automated tests.

The project demonstrates SOLID principles through separation of responsibilities, repository interfaces, and dependency injection. It uses Repository Pattern, Factory Pattern, Dependency Injection, and Observer Pattern. The diagrams are connected to the actual implementation, making the project suitable for viva explanation and system design evaluation.

---

## 19. References To Project Documents

- `README.md`
- `docs/viva-notes.md`
- `docs/patterns-and-principles-proof.md`
- `docs/test-cases.md`
- `docs/sdlc-oop-notes.md`
- `diagrams/use-case-diagram.md`
- `diagrams/er-diagram.md`
- `diagrams/class-diagram.md`
- `diagrams/sequence-diagram.md`
- `db/schema.sql`
