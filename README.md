# RateMyStore 🏪⭐

A production-ready MERN-stack application (using PostgreSQL and Prisma instead of MongoDB) that allows users to rate stores and store owners to view their aggregated feedback on a dashboard.

## Features ✨

- **Role-Based Access Control (RBAC)**
  - **Admin**: Full control over users and stores (CRUD).
  - **User**: Browse stores, submit ratings (one per store), and edit ratings.
  - **Store Owner**: Dashboard view with aggregated rating statistics and list of users who rated their store.
- **Modern UI/UX**: Built with React (Vite) & Material UI, featuring dark/light mode, skeleton loaders, and responsive layouts.
- **Robust Backend**: Node.js & Express API with comprehensive Winston/Morgan logging, global error handling, and Zod validation.
- **Database**: PostgreSQL with Prisma v7 (using the optimized `@prisma/adapter-pg` driver).

## Tech Stack 🛠️

- **Frontend**: React 18, Vite, React Router v6, Material UI (MUI), React Hook Form, Zod.
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), bcryptjs.
- **Database**: PostgreSQL, Prisma ORM v7.

---

## Getting Started 🚀

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd RateMyStore
```

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (refer to `.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ratemystore"
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Run database migrations to generate the schema:
```bash
npx prisma migrate dev --name init
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## API Documentation 📖

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a JWT
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/password` - Change password

### Admin Endpoints (Requires `ADMIN` role)
- `GET /api/admin/dashboard` - Get overall stats
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create a user
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/stores` - List all stores
- `POST /api/admin/stores` - Create a store
- `DELETE /api/admin/stores/:id` - Delete a store

### Store Endpoints
- `GET /api/stores` - List stores (Requires `USER` role)

### Rating Endpoints (Requires `USER` role)
- `POST /api/ratings` - Submit or update a rating for a store
- `GET /api/ratings/my` - Get all ratings by the current user

### Owner Endpoints (Requires `STORE_OWNER` role)
- `GET /api/owner/dashboard` - Get aggregated stats and rater list for the owned store

---

## Deployment Guide ☁️

### Deploying the Backend (e.g., Render, Railway, or Heroku)
1. **Database**: Provision a managed PostgreSQL instance and obtain the connection URL.
2. **Environment Variables**: Add your `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, and `PORT`.
3. **Build Command**: Set the build command to install dependencies and generate the Prisma client:
   ```bash
   npm install && npx prisma generate
   ```
4. **Start Command**:
   ```bash
   node server.js
   ```

### Deploying the Frontend (e.g., Vercel, Netlify)
1. **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://ratemystore-api.onrender.com/api`).
2. **Build Command**:
   ```bash
   npm run build
   ```
3. **Publish Directory**: Set the output directory to `dist`.

## License
MIT License
