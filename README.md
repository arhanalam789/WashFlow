# WashFlow

WashFlow is a laundry management website built with React on the frontend and Node.js, Express, TypeScript, and MongoDB on the backend. The system supports role-based workflows for customers, managers, and admins, including request creation, washing center assignment, request tracking, notifications, and concern ticket confirmation.

## Project Overview

The project was structured to satisfy course requirements around:

- OOP concepts
- SOLID principles
- system design and layered architecture
- design patterns
- UML and ER documentation
- a working demo-ready full-stack application

## Tech Stack

### Frontend

- React
- Vite
- JavaScript / JSX
- CSS

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs

### Tools

- Git and GitHub
- ESLint
- TypeScript compiler
- CUPS text-to-PDF generation for the report

## Folder Structure

```text
WashFlow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── container/
│   │   ├── controllers/
│   │   ├── factories/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── diagrams/
├── docs/
├── db/
├── script.py
└── report.pdf
```

## Features

- Register and log in as `customer`, `manager`, or `admin`
- Customer can create a laundry request and specify pickup details
- Customer can track request status
- Customer can view notifications and mark them as read
- Customer can confirm concern tickets
- Manager can view incoming assigned requests
- Manager can verify clothes count by moving requests into progress
- Manager can mark requests as completed
- Manager can raise concern tickets
- Admin can assign requests to washing centers
- Admin can send customer notifications

## Architecture Explanation

WashFlow uses a layered backend architecture:

- `routes` handle URL mapping only
- `controllers` handle HTTP request/response orchestration
- `services` contain business rules
- `repositories` isolate database access
- `factories` centralize notification object creation
- `middleware` handles auth, errors, and cross-cutting behavior

This structure improves maintainability and supports SOLID principles by keeping responsibilities separated and dependencies explicit.

## Design Patterns Used

- `Repository Pattern`: database access is encapsulated inside repository classes under `backend/src/repositories`
- `Factory Pattern`: notification messages and types are created through `backend/src/factories/notification.factory.ts`
- `Dependency Injection / Composition Root`: shared dependencies are wired in `backend/src/container/index.ts`

## OOP Concepts Used

- `Encapsulation`: business rules are encapsulated inside service classes such as `AuthService`, `LaundryRequestService`, and `ConcernService`
- `Abstraction`: repository interfaces in `backend/src/repositories/interfaces` define contracts for data access
- `Inheritance`: the documentation/domain layer under root `src/` uses shared base entity abstractions
- `Polymorphism`: repository implementations satisfy interchangeable repository contracts used by services

## Setup And Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd WashFlow
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=washflow-dev-secret
PORT=5001
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Optional frontend env:

```env
VITE_API_BASE_URL=http://127.0.0.1:5001
```

## How To Run The Project

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

### Build checks

```bash
cd backend && npm run build
cd frontend && npm run build
cd frontend && npm run lint
```

## Demo Flow

1. Sign up as a customer and create a request.
2. Sign up as an admin and assign the request to a washing center.
3. Sign up as a manager and move the request through processing.
4. Raise a concern ticket if needed.
5. Log back in as the customer and confirm the concern ticket.

## Documentation And Deliverables

- [ER Diagram](diagrams/er-diagram.md)
- [Use Case Diagram](diagrams/use-case-diagram.md)
- [Class Diagram](diagrams/class-diagram.md)
- [Sequence Diagram](diagrams/sequence-diagram.md)
- [Conceptual ER Diagram](diagrams/conceptual-er-diagram.md)
- [Project Report Source](docs/project-report.txt)
- `report.pdf`
- [Test Cases](docs/test-cases.md)
- [Database Schema Draft](db/schema.sql)

## Team Members And Contributions

Current repository attribution:

- `Arhan Alam` — project architecture, backend implementation, frontend implementation, diagrams, report drafting, and workflow verification

If additional team members are part of the final course submission, add them here before submission.

## How The Live Demo Was Verified

The following workflows were manually tested against the live application:

- signup and login
- request creation
- pickup detail submission
- admin assignment to washing center
- admin notification sending
- manager request processing
- concern ticket creation
- customer concern confirmation
- notification read state update
