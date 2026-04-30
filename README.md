# Production-Ready MERN User Management System (TypeScript)

A complete monorepo implementation of a **User Management System** using:
- **Frontend:** Next.js (App Router) + React + TypeScript + MUI + Zustand + TanStack Query
- **Backend:** Express + TypeScript + MongoDB + Mongoose + Zod + JWT
- **Security/DevOps:** Helmet, CORS, rate limiting, sanitization, audit logs, Swagger, Docker, Husky, CI workflow

---

## 1. Architecture Overview

### High-Level Components
- `frontend`: UI layer and client-side auth/session handling
- `backend`: REST API (`/api/v1`) with controller-service-repository architecture
- `mongodb`: persistent datastore

### Backend Request Flow
```text
Client Request
  -> Express Route (/api/v1/...)
    -> Validation Middleware (Zod)
    -> Auth Middleware (JWT Access Token)
    -> RBAC Middleware (Admin/User)
    -> Controller
    -> Service (business rules, hashing, token rotation, audit logic)
    -> Repository (Mongoose queries)
    -> MongoDB
  <- Standard JSON response formatter
```

### Auth Flow (Access + Refresh)
```text
Login
  -> verify username/password
  -> issue access token + refresh token
  -> store hashed refresh token in DB
  -> return access token + set httpOnly refresh cookie

Protected API call
  -> attach access token in Authorization header
  -> backend verifies token + user status + role

Access token expires
  -> frontend interceptor calls /auth/refresh (cookie-based)
  -> backend verifies refresh token record + rotates it
  -> new access token returned + store updated
```

---

## 2. Feature Coverage

### Authentication
- Login with username/password
- JWT access + refresh tokens
- Refresh token rotation and hashed refresh storage
- Role-based access control (`ADMIN`, `USER`)
- Protected routes (backend middleware + frontend auth guard)

### User CRUD
- Create user
- List users with pagination, search, filtering, sorting
- View details
- Update user
- Soft delete user (`isDeleted`, `deletedAt`)

### Bonus Features
- Debounced search (frontend)
- Optimistic UI updates (update/delete)
- React Query caching/retries
- Audit logs (`CREATE/UPDATE/DELETE` with actor/request context)
- Dark mode toggle (feature-flagged)
- Feature flags (`NEXT_PUBLIC_FEATURE_*`)
- Async patterns demo endpoint (`/api/v1/patterns/async`)

---

## 3. Folder Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── dto
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   │   └── v1
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   └── validations
│   └── tests
│       ├── integration
│       └── unit
├── frontend
│   └── src
│       ├── app
│       ├── components
│       ├── hooks
│       ├── modules
│       │   ├── auth
│       │   └── users
│       ├── providers
│       ├── services
│       ├── store
│       ├── types
│       └── utils
├── postman
│   └── user-management.postman_collection.json
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## 4. Frontend Patterns Implemented

- **Hooks Pattern:** `useLoginForm`, `useUsersQuery`, `useUsersFiltersReducer`, `useUserMutations`, `useAuthGuard`
- **Container/Presentational:**
  - Containers: `login-container`, `users-management-container`, `user-details-container`
  - Presentational: `login-form`, `users-table`, `users-toolbar`, `user-details-card`, `user-form-dialog`
- **State Reducer Pattern:** `useUsersFiltersReducer` with typed reducer actions
- **Error Boundaries:**
  - Global: `app/global-error.tsx`, `app/error.tsx`
  - Component-level: `ComponentErrorBoundary`
- **Controlled + Uncontrolled Components:**
  - Controlled: RHF Controllers for login/user forms
  - Uncontrolled: debounced search input (`inputRef`)
- **Form Validation:** RHF + Zod
- **API abstraction:** service layer + shared Axios client
- **Axios interceptors:** auth header injection + refresh/retry flow

---

## 5. Backend Patterns Implemented

- **Middleware Pattern:** auth, RBAC, validation, response formatter, request context, error handler, rate limiting
- **Validation Layer:** Zod schemas + DTO-driven request contracts
- **Architecture:** Controller -> Service -> Repository
- **Async Handling:** async/await in APIs + callback/promise/async demo service
- **Security:** helmet, cors, hpp, mongo sanitize, xss-clean, rate limiting, cookie-based refresh strategy
- **Logging:** Winston + Morgan stream
- **Database:** indexed schemas, soft delete, timestamps, audit logs, refresh token store
- **API Standards:** REST conventions + versioned routes (`/api/v1`)

---

## 6. How to Run Locally

### Prerequisites
- Node.js 22+
- npm 10+
- MongoDB local instance (or Docker)

### Setup
```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Development
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Swagger: `http://localhost:5000/docs`

### Quality checks
```bash
npm run lint
npm run test
npm run build
```

---

## 7. Docker

```bash
docker compose up --build
```

Services:
- `frontend` on `3000`
- `backend` on `5000`
- `mongodb` on `27017`

---

## 8. API Documentation & Postman

- Swagger UI: `http://localhost:5000/docs`
- Postman collection: `postman/user-management.postman_collection.json`

Import the collection, run `Auth > Login`, then proceed with Users requests.

---

## 9. Sample Environment Files

### backend/.env
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/user_management
JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
JWT_REFRESH_COOKIE_NAME=ums_refresh_token
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
ENABLE_SWAGGER=true
CSRF_ENABLED=false
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=User Management System
NEXT_PUBLIC_FEATURE_DARK_MODE=true
```

---

## 10. CI/CD

GitHub Actions workflow file included at:
- `.github/workflows/ci.yml`

Pipeline stages:
1. Install deps
2. Lint
3. Test
4. Build

---

## 11. Notes

- Husky is configured but requires a git repository to activate hooks.
- `xss-clean` and `csurf` are legacy ecosystem packages; production teams often replace these with actively maintained alternatives and stricter CSP + trusted input/output encoding strategy.
