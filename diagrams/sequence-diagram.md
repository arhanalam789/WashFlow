# Sequence Diagram

This sequence diagram captures the major WashFlow workflow from customer request creation through admin assignment, manager processing, concern raising, and customer confirmation.

```mermaid
sequenceDiagram
    actor Customer
    actor Admin
    actor Manager
    participant Frontend
    participant AuthController
    participant RequestController
    participant ConcernController
    participant RequestService
    participant ConcernService
    participant NotificationService
    participant Repository
    participant MongoDB

    Customer->>Frontend: Sign up / Login
    Frontend->>AuthController: POST /api/auth/signup or /login
    AuthController->>Repository: create/find user
    Repository->>MongoDB: save/read user
    MongoDB-->>Repository: user result
    Repository-->>AuthController: user
    AuthController-->>Frontend: token + user

    Customer->>Frontend: Create laundry request
    Frontend->>RequestController: POST /api/requests
    RequestController->>RequestService: createRequest()
    RequestService->>Repository: create request
    Repository->>MongoDB: insert request
    MongoDB-->>Repository: request
    RequestService->>NotificationService: createRequestCreated()
    NotificationService->>Repository: create notification
    Repository->>MongoDB: insert notification
    RequestService-->>RequestController: request result
    RequestController-->>Frontend: created request

    Admin->>Frontend: Assign washing center
    Frontend->>RequestController: PATCH /api/requests/:id/assign
    RequestController->>RequestService: assignRequest()
    RequestService->>Repository: update request center/status
    Repository->>MongoDB: update request
    RequestService->>NotificationService: createRequestAssigned()
    NotificationService->>Repository: create notification
    Repository->>MongoDB: insert notification
    RequestController-->>Frontend: assigned request

    Manager->>Frontend: Mark in progress / completed
    Frontend->>RequestController: PATCH /api/requests/:id/status
    RequestController->>RequestService: updateStatus()
    RequestService->>Repository: update status
    Repository->>MongoDB: update request
    RequestService->>NotificationService: createStatusUpdated()
    NotificationService->>Repository: create notification
    Repository->>MongoDB: insert notification

    Manager->>Frontend: Raise concern ticket
    Frontend->>ConcernController: POST /api/concerns
    ConcernController->>ConcernService: createConcern()
    ConcernService->>Repository: insert concern + update request
    Repository->>MongoDB: save concern and request
    ConcernService->>NotificationService: createConcernRaised()
    NotificationService->>Repository: create notification
    Repository->>MongoDB: insert notification

    Customer->>Frontend: Confirm concern ticket
    Frontend->>ConcernController: PATCH /api/concerns/:id/confirm
    ConcernController->>ConcernService: confirmConcern()
    ConcernService->>Repository: update concern confirmation
    Repository->>MongoDB: update concern
    ConcernService->>NotificationService: createConcernConfirmed()
    NotificationService->>Repository: create notification
    Repository->>MongoDB: insert notification
    ConcernController-->>Frontend: confirmed concern
```
