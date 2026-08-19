MovieHub/
│
├── 📂 Frontend/
│   ├── 📂 src/
│   │   └── 📂 app/
│   │       │
│   │       ├── 🏠 home/
│   │       ├── 🎬 movies/
│   │       ├── 🎞️ movie-card/
│   │       ├── ❤️ favorites/
│   │       ├── 🧭 navbar/
│   │       ├── 👣 footer/
│   │       │
│   │       ├── 🔐 login/
│   │       ├── 📝 register/
│   │       │
│   │       ├── 🎥 movie-details/
│   │       ├── 🎬 trailer-modal/
│   │       ├── 🎞️ similar-movies/
│   │       │
│   │       ├── 👤 profile/
│   │       │
│   │       ├── 🛡️ admin/
│   │       │   ├── 📊 dashboard/
│   │       │   └── 🎬 movies/
│   │       │       ├── 📋 movie-list/
│   │       │       ├── ➕ add-movie/
│   │       │       └── ✏️ edit-movie/
│   │       │
│   │       ├── ⚙️ services/
│   │       │   ├── auth.service.ts
│   │       │   ├── movie.service.ts
│   │       │   └── favorite.service.ts
│   │       │
│   │       └── 🛡️ guards/
│   │           ├── auth.guard.ts
│   │           └── admin.guard.ts
│   │
│   └── package.json
│
├── 📂 Backend/
│   │
│   ├── ⚙️ config/
│   │   └── connectDB.js
│   │
│   ├── 🎮 controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── movie.controller.js
│   │   ├── favorite.controller.js
│   │   └── review.controller.js
│   │
│   ├── 🛡️ middlewares/
│   │   ├── auth.js
│   │   ├── globalError.js
│   │   └── restrictTo.js
│   │
│   ├── 🗄️ models/
│   │   ├── user.model.js
│   │   ├── movie.model.js
│   │   ├── favorite.model.js
│   │   └── review.model.js
│   │
│   ├── 🛣️ routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── movie.route.js
│   │   ├── favorite.route.js
│   │   └── review.route.js
│   │
│   ├── 🔧 utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   └── ApiFeatures.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── 📂 docs/
│   ├── 📄 api.md
│   └── 📄 database.md


│
├── .gitignore
└── README.md
