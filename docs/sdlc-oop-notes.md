# SDLC And OOP Notes

## SDLC Mapping

### 1. Requirement Analysis

- Customer can register or log in.
- Customer can create a laundry request and specify pickup details.
- Customer can track request status and view notifications.
- Washing center manager can view incoming requests, verify clothes count, and mark requests completed.
- Admin or service operator can assign requests and send notifications.
- Concern tickets are raised when there is a mismatch or service issue.

### 2. System Design

- Domain entities are defined from the sketches.
- Relationships and cardinalities are captured in the ER diagram.
- Actor interactions are captured in the use case diagram.
- Shared behavior is centralized in an abstract base entity.

### 3. Implementation Planning

- TypeScript domain skeleton added under `src/`.
- SQL schema added under `db/`.
- Diagrams maintained under `diagrams/` for traceability.

### 4. Testing Planning

- Entity methods can be unit tested independently.
- Observer interactions can be tested through status changes on `LaundryRequest`.
- Schema constraints can be validated with integration tests later.

## OOP Mapping

### Abstraction

- `Auditable` captures shared timestamp behavior.
- `RequestObserver` captures subscriber behavior for request updates.

### Encapsulation

- `LaundryRequest` controls assignment and status transitions.
- `Notification` controls read state through `markAsRead`.
- `ConcernTicket` controls issue resolution data.

### Inheritance

- `Entity` provides `id`, `createdAt`, `updatedAt`, and `touch`.
- `User`, `WashingCenter`, `LaundryRequest`, `ConcernTicket`, and `Notification` inherit from `Entity`.

### Polymorphism

- Any future class implementing `RequestObserver` can react to request events without changing the `LaundryRequest` class.
