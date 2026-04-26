# WashFlow Patterns And Principles Proof

This document explains the design patterns, SOLID principles, and OOP concepts used in WashFlow. Use this for viva answers when the examiner asks, "Where have you used this in your project?"

## Quick Architecture Reminder

WashFlow backend follows this layered flow:

```text
Route -> Controller -> Service -> Repository -> Mongoose Model -> MongoDB
```

Example for laundry requests:

```text
Backend/src/routes/requests.ts
-> Backend/src/controllers/laundry-request.controller.ts
-> Backend/src/services/laundry-request.service.ts
-> Backend/src/repositories/laundry-request.repository.ts
-> Backend/src/models/laundry-request.model.ts
```

This layered structure is the base proof for separation of concerns and Single Responsibility Principle.

## Design Patterns Used

### 1. Repository Pattern

Meaning:

Repository Pattern separates database access from business logic. Instead of services directly writing Mongoose queries, services call repository methods like `findById`, `create`, `save`, or `listByRole`.

Where used:

- `Backend/src/repositories/user.repository.ts`
- `Backend/src/repositories/laundry-request.repository.ts`
- `Backend/src/repositories/concern-ticket.repository.ts`
- `Backend/src/repositories/notification.repository.ts`
- `Backend/src/repositories/washing-center.repository.ts`
- Repository interfaces in `Backend/src/repositories/interfaces/`

Proof in project:

- `LaundryRequestService` does not directly call `LaundryRequest.find()` or `LaundryRequest.create()`.
- It calls `this.laundryRequestRepository.create(...)`, `findById(...)`, `save(...)`, and `listByRole(...)`.
- Actual Mongoose queries are inside `LaundryRequestRepository`.

Viva answer:

> We used Repository Pattern to isolate MongoDB/Mongoose queries from business logic. For example, LaundryRequestService handles request lifecycle rules, while LaundryRequestRepository handles database operations.

Benefit:

- Easier to test services.
- Easier to replace MongoDB implementation later.
- Business rules stay clean and readable.

### 2. Factory Pattern

Meaning:

Factory Pattern centralizes object creation. Instead of creating notification payloads manually in many services/controllers, a factory creates them in one place.

Where used:

- `Backend/src/factories/notification.factory.ts`

Proof in project:

- `NotificationFactory` has methods like:
  - `createRequestCreated(...)`
  - `createRequestAssigned(...)`
  - `createStatusUpdated(...)`
  - `createConcernRaised()`
  - `createConcernConfirmed()`
- `NotificationService` uses this factory before saving notifications.

Example flow:

```text
LaundryRequestService updates request status
-> NotificationService.createStatusUpdated(...)
-> NotificationFactory.createStatusUpdated(...)
-> NotificationRepository.create(...)
```

Viva answer:

> We used Factory Pattern for notification creation. NotificationFactory creates standardized notification types and messages, so notification logic is not duplicated across controllers or services.

Benefit:

- Consistent messages.
- Less duplicate code.
- Easier to add a new notification type.

### 3. Dependency Injection And Composition Root

Meaning:

Dependency Injection means classes receive their dependencies from outside instead of creating them internally. A composition root is the central place where all objects are created and connected.

Where used:

- `Backend/src/container/index.ts`

Proof in project:

`container/index.ts` creates repositories first:

```text
UserRepository
LaundryRequestRepository
NotificationRepository
ConcernTicketRepository
WashingCenterRepository
```

Then it injects them into services:

```text
AuthService(userRepository, washingCenterService)
LaundryRequestService(laundryRequestRepository, washingCenterService, notificationService)
ConcernService(concernTicketRepository, laundryRequestRepository, notificationService)
```

Then it injects services into controllers:

```text
AuthController(authService)
LaundryRequestController(laundryRequestService)
ConcernController(concernService)
```

Viva answer:

> We used Dependency Injection in the container file. Repositories are injected into services, and services are injected into controllers. This reduces coupling and supports Dependency Inversion Principle.

Benefit:

- Dependencies are visible in one place.
- Easier to test services with fake repositories.
- Controllers do not create service objects manually.

### 4. Observer Pattern

Meaning:

Observer Pattern allows one object to notify multiple interested objects when something changes.

Where used:

- `src/domain/LaundryRequest.ts`
- `src/interfaces/RequestObserver.ts`
- `src/services/NotificationService.ts`

Proof in project:

- `LaundryRequest` has an `observers` set.
- `attachObserver(observer)` registers an observer.
- When request status changes, `notifyObservers(...)` is called.
- Any class implementing `RequestObserver` can react to the change.
- `NotificationService` implements `RequestObserver`.

Important note:

The root `src/` folder is the OOP/class-diagram demonstration layer. The running backend creates notifications through service methods, not through this observer code.

Viva answer:

> Observer Pattern is demonstrated in the root domain model. LaundryRequest can notify registered observers when assignment, status update, or concern events happen. NotificationService is one observer implementation.

Benefit:

- LaundryRequest does not need to know the exact notification implementation.
- New observers can be added without changing LaundryRequest.

## SOLID Principles Used

### 1. Single Responsibility Principle

Meaning:

Each class or file should have one main reason to change.

Where used:

- Routes: `Backend/src/routes/*`
- Controllers: `Backend/src/controllers/*`
- Services: `Backend/src/services/*`
- Repositories: `Backend/src/repositories/*`
- Models: `Backend/src/models/*`

Proof in project:

- `requests.ts` only maps request routes.
- `laundry-request.controller.ts` only handles HTTP input/output.
- `laundry-request.service.ts` contains business rules like status transition and manager ownership.
- `laundry-request.repository.ts` contains database queries.
- `laundry-request.model.ts` defines the database schema.

Viva answer:

> We follow Single Responsibility Principle through layered architecture. Routes map URLs, controllers handle HTTP, services handle business rules, repositories handle database operations, and models define schema.

### 2. Open/Closed Principle

Meaning:

Code should be open for extension but closed for unnecessary modification.

Where used:

- `Backend/src/factories/notification.factory.ts`
- `Backend/src/services/notification.service.ts`

Proof in project:

If we need a new notification type, we can add a new factory method like `createPickupDelayed()` and then call it from `NotificationService`. We do not need to rewrite route/controller logic.

Viva answer:

> NotificationFactory supports Open/Closed Principle because new notification types can be added by extending the factory instead of rewriting existing controller logic.

### 3. Liskov Substitution Principle

Meaning:

If code depends on an interface, any correct implementation of that interface should be replaceable without breaking the service.

Where used:

- `Backend/src/repositories/interfaces/*.ts`
- Services that depend on those interfaces.

Proof in project:

`LaundryRequestService` depends on `ILaundryRequestRepository`, not directly on the concrete repository class. A fake repository can be used in tests as long as it provides the same methods.

Test proof:

- `Backend/test/services/laundry-request.service.test.ts`
- `Backend/test/services/concern.service.test.ts`

These tests use fake repositories instead of real MongoDB repositories.

Viva answer:

> Services depend on repository contracts. In tests, we substitute real repositories with fake repositories, proving that services can work with any implementation that follows the interface.

### 4. Interface Segregation Principle

Meaning:

Do not force a class to depend on a large interface with methods it does not need. Prefer smaller, focused interfaces.

Where used:

- `IUserRepository`
- `ILaundryRequestRepository`
- `IConcernTicketRepository`
- `INotificationRepository`
- `IWashingCenterRepository`

Proof in project:

There is no single giant `IDatabaseRepository`. Each domain has its own interface. For example, `NotificationService` needs notification methods only, so it uses `INotificationRepository`, not user/request methods.

Viva answer:

> We follow Interface Segregation by creating separate repository interfaces for each domain entity instead of one large database interface.

### 5. Dependency Inversion Principle

Meaning:

High-level business logic should not depend directly on low-level database details. Both should depend on abstractions.

Where used:

- `Backend/src/services/*.ts`
- `Backend/src/repositories/interfaces/*.ts`
- `Backend/src/container/index.ts`

Proof in project:

- Services depend on repository interfaces.
- Repositories depend on Mongoose models.
- `container/index.ts` connects concrete repositories to services.

Viva answer:

> Business services depend on repository interfaces, not direct Mongoose models. Concrete repositories are injected through the container. This is Dependency Inversion Principle.

## OOP Concepts Used

### 1. Encapsulation

Meaning:

Encapsulation means keeping data and related behavior together, and protecting business rules inside proper classes.

Where used:

- `Backend/src/services/auth.service.ts`
- `Backend/src/services/laundry-request.service.ts`
- `Backend/src/services/concern.service.ts`
- `src/domain/LaundryRequest.ts`
- `src/domain/Notification.ts`

Proof in project:

- Password hashing is inside `AuthService`.
- Request status transition rules are inside `LaundryRequestService`.
- Concern validation is inside `ConcernService`.
- `LaundryRequest` domain class controls assignment/status behavior through methods.

Viva answer:

> We use encapsulation by keeping business rules inside service/domain classes instead of spreading them across controllers or frontend code.

### 2. Abstraction

Meaning:

Abstraction hides implementation details and exposes only what is needed.

Where used:

- Repository interfaces in `Backend/src/repositories/interfaces/`
- `src/core/Auditable.ts`
- `src/interfaces/RequestObserver.ts`

Proof in project:

`ILaundryRequestRepository` tells the service what operations are available, but hides how MongoDB queries are written.

Viva answer:

> Repository interfaces abstract database operations. Services know what operation to call, but not how MongoDB performs it.

### 3. Inheritance

Meaning:

Inheritance allows classes to reuse common properties or behavior from a parent class.

Where used:

- `src/core/Entity.ts`
- Domain classes under `src/domain/`

Proof in project:

`Entity` contains common fields:

```text
id
createdAt
updatedAt
touch()
```

Domain classes like `User`, `LaundryRequest`, `Notification`, `ConcernTicket`, and `WashingCenter` extend `Entity`.

Viva answer:

> Inheritance is shown in the root domain model. Common entity fields are placed in the base Entity class and reused by domain classes.

### 4. Polymorphism

Meaning:

Polymorphism means different classes can be used through the same interface.

Where used:

- Repository interfaces.
- `RequestObserver` interface.

Proof in project:

- Services can work with real repositories or fake repositories in tests.
- Any future observer implementing `RequestObserver` can be attached to `LaundryRequest`.

Viva answer:

> Polymorphism is shown through repository interfaces and the RequestObserver interface. The service can use any repository implementation that follows the same contract.

## Other System Design Concepts

### Layered Architecture

Meaning:

The system is divided into layers with separate responsibilities.

Where used:

```text
Routes -> Controllers -> Services -> Repositories -> Models
```

Proof:

Each backend folder represents one layer, and each request flows through these layers.

### Role-Based Access Control

Meaning:

Different users have different permissions.

Where used:

- `Backend/src/middleware/auth.ts`
- `Backend/src/routes/requests.ts`
- `Backend/src/routes/concerns.ts`
- `Backend/src/routes/notifications.ts`

Proof:

- Only customers can create requests.
- Only admins can assign requests.
- Managers/admins can update request status.
- Managers can process only their assigned washing center's requests.

### Status Transition Validation

Meaning:

The request lifecycle must follow valid states.

Where used:

- `Backend/src/services/laundry-request.service.ts`

Proof:

Allowed flow:

```text
pending -> assigned -> in_progress -> completed
```

Concern flow:

```text
in_progress -> concern_raised -> in_progress/completed
```

Invalid example:

```text
pending -> completed
```

This is rejected by the backend.

## Short Viva Answer

If asked, "Which patterns and principles did you use?", answer:

> We used layered architecture with routes, controllers, services, repositories, and models. Repository Pattern is used in the repository layer to separate database queries from business logic. Factory Pattern is used in NotificationFactory to create notification payloads. Dependency Injection is used in the container file to inject repositories into services and services into controllers. Observer Pattern is demonstrated in the root domain model through LaundryRequest and RequestObserver. For SOLID, SRP is shown by the layered structure, OCP by extending notification factory methods, LSP and DIP by repository interfaces, and ISP by having separate interfaces for each repository.
