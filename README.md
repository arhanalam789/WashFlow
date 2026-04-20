# WashFlow

WashFlow is a laundry service management system design focused on user requests, washing center assignment, concern handling, and notifications. The project structure and diagrams in this repository follow the reference sketches for the current design phase.

## Project Structure

- `src/` - base classes, interfaces, enums, and domain relationships
- `docs/` - SDLC notes, OOP mapping, and progress checklist
- `diagrams/` - ER, conceptual, use case, and class diagrams
- `db/` - relational schema draft for the current design
- `frontend/` - existing frontend work
- `backend/` - existing backend work

## Core Domain

The current model is based on these five entities:

- `User`
- `WashingCenter`
- `LaundryRequest`
- `ConcernTicket`
- `Notification`

Main relationships reflected from the sketches:

- A `User` places many `LaundryRequest` records.
- A `WashingCenter` is assigned many `LaundryRequest` records.
- A `LaundryRequest` can generate many `ConcernTicket` records.
- A `User` receives many `Notification` records.
- A `LaundryRequest` triggers many `Notification` records.

## OOP Concepts Used

- `Abstraction`: interfaces such as `Auditable` and `RequestObserver` describe behavior without exposing implementation details.
- `Encapsulation`: domain classes manage their own state changes through methods like `assignCenter`, `updateStatus`, and `markAsRead`.
- `Inheritance`: all main domain entities extend the shared `Entity` base class.
- `Polymorphism`: `RequestObserver` allows different notification handlers to react to request updates using the same contract.

## SDLC Progress

- `Requirements`: core actors, actions, and entities captured from the design sketches.
- `Design`: ER diagram, conceptual model, use case diagram, and class diagram prepared.
- `Implementation planning`: source skeleton and database schema drafted.
- `Testing preparation`: class boundaries and relationships are defined for later unit and integration tests.

## Design Pattern

### Observer Pattern

The notification flow uses the `Observer` pattern. A `LaundryRequest` acts as the subject and informs attached `RequestObserver` implementations whenever the request is assigned, updated, or completed. This matches the diagram where request activity leads to notifications being sent to users or managers.

Relevant files:

- [src/domain/LaundryRequest.ts](/Users/arhanalam/Desktop/WashFlow/src/domain/LaundryRequest.ts)
- [src/interfaces/RequestObserver.ts](/Users/arhanalam/Desktop/WashFlow/src/interfaces/RequestObserver.ts)
- [src/services/NotificationService.ts](/Users/arhanalam/Desktop/WashFlow/src/services/NotificationService.ts)

## Diagram Index

- [ER Diagram](/Users/arhanalam/Desktop/WashFlow/diagrams/er-diagram.md)
- [Use Case Diagram](/Users/arhanalam/Desktop/WashFlow/diagrams/use-case-diagram.md)
- [Conceptual ER Diagram](/Users/arhanalam/Desktop/WashFlow/diagrams/conceptual-er-diagram.md)
- [Class Diagram](/Users/arhanalam/Desktop/WashFlow/diagrams/class-diagram.md)

## Documentation

- [SDLC and OOP Notes](/Users/arhanalam/Desktop/WashFlow/docs/sdlc-oop-notes.md)
- [Progress Checklist](/Users/arhanalam/Desktop/WashFlow/docs/progress-checklist.md)
- [Database Schema](/Users/arhanalam/Desktop/WashFlow/db/schema.sql)
