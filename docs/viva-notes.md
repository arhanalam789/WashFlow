# WashFlow Viva Notes

## Problem And Flow

WashFlow coordinates laundry requests between customers, admins, and washing center managers. The main demo flow is: customer creates a request, admin assigns it to a washing center, manager moves it through processing, manager raises a concern if needed, and customer confirms the concern.

## Architecture

The backend follows a layered architecture:

```text
Route -> Controller -> Service -> Repository -> MongoDB
```

- Routes map URLs and middleware.
- Controllers translate HTTP requests into service calls.
- Services hold business rules such as role filtering, assignment, status transitions, and concern validation.
- Repositories isolate Mongoose queries.
- Models define MongoDB document structure.

## SOLID Mapping

- Single Responsibility: routes, controllers, services, repositories, and models each have one main job.
- Open/Closed: notification creation is extended through `NotificationFactory` methods instead of duplicating message logic in controllers.
- Liskov Substitution: services use repository interfaces, so compatible repository implementations can replace current Mongoose repositories.
- Interface Segregation: each domain has its own repository interface instead of one giant data access interface.
- Dependency Inversion: `Backend/src/container/index.ts` wires concrete dependencies while services depend on abstractions.

## Design Patterns

- Repository Pattern: `Backend/src/repositories/*.ts`.
- Factory Pattern: `Backend/src/factories/notification.factory.ts`.
- Dependency Injection / Composition Root: `Backend/src/container/index.ts`.
- Observer Pattern: demonstrated in root `src/domain/LaundryRequest.ts`, `src/interfaces/RequestObserver.ts`, and `src/services/NotificationService.ts` for OOP/class-diagram requirements.

For detailed proof with meaning, file mapping, and viva answers, see `docs/patterns-and-principles-proof.md`.

## Diagram Mapping

- Use case diagram maps to Express routes under `Backend/src/routes`.
- ER diagram maps to Mongoose models under `Backend/src/models`.
- Class diagram maps mainly to root `src/` domain classes.
- Sequence diagram maps to the live workflow across controllers, services, repositories, and notifications.

## Database Explanation

The real database is MongoDB. The ER diagram and `db/schema.sql` use relational-style terminology so the project can explain entities and relationships in a standard system design format. In code, those relationships are implemented with MongoDB `ObjectId` references.

## Known Limitations And Future Scope

- No payment or delivery partner integration is included.
- Notifications are stored in the database but not pushed in real time.
- Manager-center ownership is supported, but a production system would need admin screens to assign managers to centers after signup.
- More API integration tests can be added with an in-memory MongoDB setup.
