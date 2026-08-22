# 🎬 MovieHub

> A full-stack movie browsing web application built with **Angular**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 👥 Team Composition

| # | Member | Role |
|---|--------|------|
| 1 | Frontend 1 | Home + Movies + Favorites + Navbar + Footer |
| 2 | Frontend 2 | Auth (Login/Register) + Movie Details + Trailer |
| 3 | Frontend 3 | Admin Dashboard + User Profile + Guards |
| 4 | Backend 1 | Auth APIs + User Model + JWT |
| 5 | Backend 2 | Movie APIs + CRUD + Search/Filter/Sort |
| 6 | Backend 3 | Favorites APIs |

---

## 📁 Project Structure

```
MovieHub/
├── Frontend/                          ← Angular Project
│   └── src/
│       └── app/
│           ├── home/                  ← Home Page (Hero + Featured Movies)
│           │   ├── home.component.ts
│           │   └── home.component.html
│           ├── movies/                ← All Movies (Search + Filter + Sort + Pagination)
│           │   ├── movies.component.ts
│           │   └── movies.component.html
│           ├── movie-card/            ← Reusable Movie Card Component
│           │   ├── movie-card.component.ts
│           │   └── movie-card.component.html
│           ├── favorites/             ← Favorites Page
│           │   ├── favorites.component.ts
│           │   └── favorites.component.html
│           ├── navbar/                ← Navigation Bar
│           │   ├── navbar.component.ts
│           │   └── navbar.component.html
│           ├── footer/                ← Footer
│           │   ├── footer.component.ts
│           │   └── footer.component.html
│           ├── login/                 ← Login Page
│           │   ├── login.component.ts
│           │   └── login.component.html
│           ├── register/              ← Register Page
│           │   ├── register.component.ts
│           │   └── register.component.html
│           ├── movie-details/         ← Movie Details Page (Cast + Trailer + Rating)
│           │   ├── movie-details.component.ts
│           │   └── movie-details.component.html
│           ├── trailer-modal/         ← Trailer Modal Popup
│           │   ├── trailer-modal.component.ts
│           │   └── trailer-modal.component.html
│           ├── similar-movies/        ← Similar Movies Section
│           │   ├── similar-movies.component.ts
│           │   └── similar-movies.component.html
│           ├── profile/               ← User Profile Page
│           │   ├── profile.component.ts
│           │   └── profile.component.html
│           ├── admin/                 ← Admin Area (Admin only)
│           │   ├── dashboard/         ← Admin Dashboard (Stats)
│           │   │   ├── dashboard.component.ts
│           │   │   └── dashboard.component.html
│           │   ├── movies/
│           │   │   ├── movie-list/    ← List all movies with actions
│           │   │   │   ├── movie-list.component.ts
│           │   │   │   └── movie-list.component.html
│           │   │   ├── add-movie/     ← Add new movie form
│           │   │   │   ├── add-movie.component.ts
│           │   │   │   └── add-movie.component.html
│           │   │   └── edit-movie/    ← Edit existing movie form
│           │   │       ├── edit-movie.component.ts
│           │   │       └── edit-movie.component.html
│           │   └── users/             ← Users Management (Admin only)
│           │       └── user-list/     ← View registered users
│           │           ├── user-list.component.ts
│           │           └── user-list.component.html
│           ├── services/              ← Angular Services (API calls)
│           │   ├── auth.service.ts    ← Login + Register + JWT + User state
│           │   ├── movie.service.ts   ← Fetch movies from API
│           │   └── favorite.service.ts← Add/Remove/Get favorites
│           └── guards/                ← Route Guards
│               ├── auth.guard.ts      ← Protect routes for logged-in users
│               └── admin.guard.ts     ← Protect admin routes
│
├── Backend/                           ← Node.js + Express Project
│   ├── config/
│   │   └── connectDB.js               ← MongoDB connection setup
│   ├── controllers/
│   │   ├── auth.controller.js         ← register, login, getMe
│   │   ├── user.controller.js         ← getProfile, updateProfile
│   │   ├── movie.controller.js        ← CRUD operations for movies
│   │   └── favorite.controller.js     ← Add/Remove/Get favorites
│   ├── middlewares/
│   │   ├── auth.js                    ← Verify JWT token (protect routes)
│   │   ├── globalError.js             ← Global error handler middleware
│   │   └── restrictTo.js              ← Role-based access (admin only)
│   ├── models/
│   │   ├── user.model.js              ← User schema (name, email, password, role)
│   │   ├── movie.model.js             ← Movie schema (title, poster, genre, rating...)
│   │   └── favorite.model.js          ← Favorite schema (user, movie)
│   ├── routes/
│   │   ├── auth.route.js              ← POST /api/auth/register, /login, GET /me
│   │   ├── user.route.js              ← GET/PUT /api/users/profile
│   │   ├── movie.route.js             ← GET/POST/PUT/DELETE /api/movies
│   │   └── favorite.route.js          ← GET/POST/DELETE /api/favorites
│   ├── utils/
│   │   ├── AppError.js                ← Custom operational error class
│   │   ├── catchAsync.js              ← Async error wrapper for controllers
│   │   └── ApiFeatures.js             ← Search, Filter, Sort, Pagination helper
│   ├── app.js                         ← Express app setup + routes mounting
│   ├── server.js                      ← Server entry point + DB connection
│   ├── .env.example                   ← Environment variables template
│   ├── .gitignore
│   └── package.json
│
├── docs/
│   ├── api.md                         ← All API endpoints documentation
│   └── database.md                    ← MongoDB schemas documentation
│
└── README.md                          ← This file
```

---

## 🔌 API Endpoints

### Auth — `Backend 1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current logged-in user |

### Movies — `Backend 2`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies (search, filter, sort, paginate) |
| GET | `/api/movies/:id` | Get single movie by ID |
| POST | `/api/movies` | Add new movie (Admin only) |
| PUT | `/api/movies/:id` | Update movie (Admin only) |
| DELETE | `/api/movies/:id` | Delete movie (Admin only) |

### Favorites — `Backend 3`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites` | Add movie to favorites |
| DELETE | `/api/favorites/:id` | Remove movie from favorites |

---

## 🗄️ Database — MongoDB

**Database name:** `moviehub`

| Collection | Description |
|------------|-------------|
| `users` | Stores user accounts (name, email, hashed password, role) |
| `movies` | Stores movie data (title, poster, genre, rating, cast...) |
| `favorites` | Stores user favorites (user reference + movie reference) |

---

## 🔐 User Roles

| Role | Accessible Pages |
|------|-----------------|
| `user` | Home, Movies, Movie Details, Favorites, Profile |
| `admin` | All user pages + Admin Dashboard + Movie Management + Users List |

---

## 🌿 Git Branches

| Branch | Owner |
|--------|-------|
| `frontend-home-movies-favorites` | Frontend 1 |
| `frontend-auth-movie-details` | Frontend 2 |
| `frontend-admin-profile` | Frontend 3 |
| `backend-auth-users` | Backend 1 |
| `backend-movies` | Backend 2 |
| `backend-favorites` | Backend 3 |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Password | bcryptjs |

---

## 🚀 Getting Started

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm start
```#
