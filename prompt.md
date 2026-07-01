# Store Rating System --- Engineering Specification (PRD + Architecture + Development Guide)

> **Purpose**
>
> This document is the single source of truth for implementing the Store
> Rating System. Follow it exactly. Build incrementally in phases. After
> each phase, stop, verify, commit, and wait before continuing.

------------------------------------------------------------------------

# 1. Project Goals

Build a production-quality Store Rating System that demonstrates:

-   Clean Architecture
-   Secure Authentication & RBAC
-   Excellent UX
-   Robust Validation
-   Modular Code
-   Professional Logging
-   Production-ready API Design
-   Interview-quality codebase

The repository should clearly show incremental progress through
meaningful Git commits.

------------------------------------------------------------------------

# 2. Tech Stack

## Frontend

-   React (Vite)
-   React Router
-   Material UI
-   React Hook Form
-   Zod
-   Axios

## Backend

-   Node.js
-   Express.js
-   Prisma ORM
-   PostgreSQL
-   JWT
-   bcrypt
-   Morgan
-   Winston

------------------------------------------------------------------------

# 3. Architecture

Frontend

    Pages
     ↓
    Components
     ↓
    Hooks
     ↓
    Services
     ↓
    REST API

Backend

    Routes
     ↓
    Controllers
     ↓
    Services
     ↓
    Prisma
     ↓
    Database

No business logic inside routes.

------------------------------------------------------------------------

# 4. Folder Structure

``` text
backend/
 controllers/
 services/
 routes/
 middlewares/
 validators/
 prisma/
 config/
 utils/
 logs/

frontend/
 pages/
 layouts/
 components/
 hooks/
 services/
 contexts/
 validations/
 utils/
 assets/
```

------------------------------------------------------------------------

# 5. Database Schema

## User

-   id
-   name
-   email (unique)
-   password
-   address
-   role
-   createdAt
-   updatedAt

Roles: - ADMIN - USER - STORE_OWNER

## Store

-   id
-   name
-   email
-   address
-   ownerId (FK)

## Rating

-   id
-   userId (FK)
-   storeId (FK)
-   rating (1-5)

Constraint: - Unique(userId, storeId)

------------------------------------------------------------------------

# 6. RBAC Matrix

  Feature            Admin              User   Owner
  ------------------ ------------------ ------ ---------------
  Login              ✓                  ✓      ✓
  Signup             ✓ (create users)   ✓      ✗
  Dashboard          ✓                  ✗      ✓
  Add Store          ✓                  ✗      ✗
  Rate Store         ✗                  ✓      ✗
  View Own Ratings   ✗                  ✓      ✓ (aggregate)
  Update Password    ✓                  ✓      ✓

------------------------------------------------------------------------

# 7. API Standards

Response

``` json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": null
}
```

Use proper HTTP status codes.

------------------------------------------------------------------------

# 8. Validation

## Name

20--60 chars

## Email

RFC-compliant email

## Password

8--16 chars Uppercase required Special character required

## Address

≤400 chars

## Rating

Integer 1--5

Validate on BOTH frontend and backend.

------------------------------------------------------------------------

# 9. Security

-   bcrypt hashing
-   JWT middleware
-   RBAC middleware
-   Input sanitization
-   Duplicate email prevention
-   Duplicate rating prevention

------------------------------------------------------------------------

# 10. Logging

Morgan + Winston.

Log: - Startup - Requests - Status codes - Response time - Auth
failures - Exceptions

Store under backend/logs.

------------------------------------------------------------------------

# 11. UI Standards

-   Material UI
-   Dark & Light Theme
-   Persist theme with localStorage
-   Responsive
-   Loading states
-   Toasts
-   Confirmation dialogs
-   Empty states

------------------------------------------------------------------------

# 12. Tables

Support: - Search - Sort - Filter - Pagination (if needed)

------------------------------------------------------------------------

# 13. Implementation Phases

## Phase 1

Project setup Folder structure Prisma Theme Logger Error handler
Validation setup

Deliverables: - Running frontend - Running backend - Connected DB -
Commit message

------------------------------------------------------------------------

## Phase 2

Authentication JWT RBAC Signup Login Logout

Acceptance: - Protected routes work - Passwords hashed - Validation
working

Commit and stop.

------------------------------------------------------------------------

## Phase 3

Admin Module

Dashboard CRUD Users CRUD Stores Search Filter Sort

Acceptance: Everything tested.

Commit and stop.

------------------------------------------------------------------------

## Phase 4

Normal User

Browse Stores Search Rate Store Edit Rating Password Update

Acceptance: One rating per store.

Commit and stop.

------------------------------------------------------------------------

## Phase 5

Store Owner

Dashboard Average Rating Users who rated Password update

Commit and stop.

------------------------------------------------------------------------

## Phase 6

UI Polish

Accessibility Responsive fixes Dark/Light improvements Loading skeletons

Commit and stop.

------------------------------------------------------------------------

## Phase 7

Final QA

Bug fixes Performance Security review Validation review README
Deployment guide

------------------------------------------------------------------------

# 14. Git Strategy

After EVERY phase output:

-   Completed features
-   Files added
-   Files modified
-   Tests executed
-   Known issues
-   Suggested commit message

Never continue automatically.

------------------------------------------------------------------------

# 15. Definition of Done

Every feature must satisfy:

-   Functional
-   Validated
-   Logged
-   Responsive
-   Secure
-   Tested
-   No console errors
-   No lint errors
-   No build warnings

------------------------------------------------------------------------

# Final Instructions for the Coding Agent

You are acting as a senior engineer.

Do NOT skip phases.

Do NOT generate placeholder code.

Implement production-quality code.

Preserve backward compatibility while adding new features.

Test every feature before declaring a phase complete.

Pause after each phase and provide a Git commit message before moving
forward.
