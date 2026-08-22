# 🌐 API Documentation — MovieHub
**Base URL:** `/api`  
**Response Format:** JSON  
**Auth Method:** Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 📋 ملخص سريع لكل الـ APIs

### 🔐 1. Authentication — `/api/auth`
> مسؤول: **Backend 1** & **Frontend 2**

| Method | Endpoint | Access | الوصف |
|--------|----------|--------|-------|
| `POST` | `/api/auth/register` | Public | تسجيل مستخدم جديد وإرجاع JWT token |
| `POST` | `/api/auth/login` | Public | تسجيل دخول وإرجاع JWT token |
| `GET` | `/api/auth/me` | Private | جلب بيانات المستخدم الحالي من التوكن |

---

### 🎬 2. Movies — `/api/movies`
> مسؤول: **Backend 2** & **Frontend 1, 3**

| Method | Endpoint | Access | الوصف |
|--------|----------|--------|-------|
| `GET` | `/api/movies` | Public | جلب كل الأفلام مع فلترة وبحث وتقسيم صفحات |
| `GET` | `/api/movies/:id` | Public | جلب تفاصيل فيلم معين |
| `POST` | `/api/movies` | Admin | إضافة فيلم جديد |
| `PUT` | `/api/movies/:id` | Admin | تعديل بيانات فيلم |
| `DELETE` | `/api/movies/:id` | Admin | حذف فيلم |

---

### ❤️ 3. Favorites — `/api/favorites`
> مسؤول: **Backend 3** & **Frontend 1**

| Method | Endpoint | Access | الوصف |
|--------|----------|--------|-------|
| `GET` | `/api/favorites` | Private | جلب قائمة المفضلة للمستخدم |
| `POST` | `/api/favorites` | Private | إضافة فيلم للمفضلة |
| `DELETE` | `/api/favorites/:movieId` | Private | حذف فيلم من المفضلة |

---

### ⭐ 4. Reviews — `/api/reviews`
> مسؤول: **Backend 3** & **Frontend 2**

| Method | Endpoint | Access | الوصف |
|--------|----------|--------|-------|
| `GET` | `/api/reviews/:movieId` | Public | جلب كل التقييمات لفيلم معين |
| `POST` | `/api/reviews` | Private | إضافة تقييم جديد لفيلم |
| `DELETE` | `/api/reviews/:id` | Private / Admin | حذف تقييم |

---

### 👤 5. Users — `/api/users`
> مسؤول: **Backend 1** & **Frontend 3**

| Method | Endpoint | Access | الوصف |
|--------|----------|--------|-------|
| `PATCH` | `/api/users/updateprofile` | Private | تعديل اسم وإيميل المستخدم |
| `PATCH` | `/api/users/changepassword` | Private | تغيير كلمة المرور |
| `DELETE` | `/api/users/deleteprofile` | Private | حذف حساب المستخدم |
| `PATCH` | `/api/users/updateimage` | Private | رفع وتغيير صورة البروفايل |
| `GET` | `/api/users/getAllUsers` | Admin | جلب كل المستخدمين |
| `GET` | `/api/users/getUserById` | Admin | جلب مستخدم معين بالـ ID |
| `DELETE` | `/api/users/deleteUserByAdmin` | Admin | حذف مستخدم بواسطة الأدمن |
| `PATCH` | `/api/users/updateUserStatus` | Admin | تفعيل أو تعطيل حساب مستخدم |

---

## 📖 التوثيق التفصيلي

---
## 1. Authentication APIs (`/api/auth`)

> مسؤول عنها: **Backend 1** & **Frontend 2**
### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response Success (201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGciOi...",
  "data": {
    "user": {
      "_id": "60d5ec49f1a2c82d88c2e111",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 1.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response Success (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOi...",
  "data": {
    "user": {
      "_id": "60d5ec49f1a2c82d88c2e111",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 1.3 Get Current User
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`
- **Access:** Private (User / Admin)
- **Response Success (200 OK):**
```json
{
  "status": "success",
  "data": 
    "user": {
      "_id": "60d5ec49f1a2c82d88c2e111",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "favorites": []
    }
  }
}
```

---

## 2. Movie APIs (`/api/movies`)

> مسؤول عنها: **Backend 2** & **Frontend 1, 3**

### 2.1 Get All Movies
- **Method:** `GET`
- **Endpoint:** `/api/movies`
- **Access:** Public
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (filter by title)
  - `genre` (filter by genre)
  - `sort` (e.g. `rating`, `-releaseYear`)
- **Response Success (200 OK):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "movies": [
      {
        "_id": "60d5ec49f1a2c82d88c2e222",
        "title": "Inception",
        "overview": "A thief who steals corporate secrets...",
        "poster": "https://example.com/poster.jpg",
        "genres": ["Action", "Sci-Fi"],
        "releaseYear": 2010,
        "rating": 8.8
      }
    ]
  }
}
```

### 2.2 Get Single Movie
- **Method:** `GET`
- **Endpoint:** `/api/movies/:id`
- **Access:** Public
- **Response Success (200 OK):**
```json
{
  "status": "success",
  "data": {
    "movie": {
      "_id": "60d5ec49f1a2c82d88c2e222",
      "title": "Inception",
      "overview": "A thief who steals corporate secrets...",
      "poster": "https://example.com/poster.jpg",
      "trailerUrl": "https://www.youtube.com/embed/...",
      "genres": ["Action", "Sci-Fi"],
      "releaseYear": 2010,
      "duration": 148,
      "rating": 8.8,
      "numReviews": 15,
      "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
    }
  }
}
```

### 2.3 Add New Movie
- **Method:** `POST`
- **Endpoint:** `/api/movies`
- **Access:** Admin only
- **Request Body:**
```json
{
  "title": "Inception",
  "overview": "A thief who steals corporate secrets...",
  "poster": "https://example.com/poster.jpg",
  "backdrop": "https://example.com/backdrop.jpg",
  "trailerUrl": "https://youtube.com/watch?v=...",
  "genres": ["Action", "Sci-Fi"],
  "releaseYear": 2010,
  "duration": 148,
  "cast": ["Leonardo DiCaprio"]
}
```

### 2.4 Update Movie
- **Method:** `PUT`
- **Endpoint:** `/api/movies/:id`
- **Access:** Admin only

### 2.5 Delete Movie
- **Method:** `DELETE`
- **Endpoint:** `/api/movies/:id`
- **Access:** Admin only

---

## 3. Favorites APIs (`/api/favorites`)

> مسؤول عنها: **Backend 3** & **Frontend 1**

### 3.1 Get User Favorites
- **Method:** `GET`
- **Endpoint:** `/api/favorites`
- **Access:** Private (User)
- **Response Success (200 OK):**
```json
{
  "status": "success",
  "data": {
    "favorites": [
      {
        "_id": "60d5ec49f1a2c82d88c2e222",
        "title": "Inception",
        "poster": "https://example.com/poster.jpg",
        "rating": 8.8
      }
    ]
  }
}
```

### 3.2 Add Movie to Favorites
- **Method:** `POST`
- **Endpoint:** `/api/favorites`
- **Access:** Private (User)
- **Request Body:**
```json
{
  "movieId": "60d5ec49f1a2c82d88c2e222"
}
```

### 3.3 Remove Movie from Favorites
- **Method:** `DELETE`
- **Endpoint:** `/api/favorites/:movieId`
- **Access:** Private (User)

---

## 4. Reviews APIs (`/api/reviews`)

> مسؤول عنها: **Backend 3** & **Frontend 2**

### 4.1 Get Reviews for a Movie
- **Method:** `GET`
- **Endpoint:** `/api/reviews/:movieId`
- **Access:** Public

### 4.2 Add Review
- **Method:** `POST`
- **Endpoint:** `/api/reviews`
- **Access:** Private (User)
- **Request Body:**
```json
{
  "movieId": "60d5ec49f1a2c82d88c2e222",
  "rating": 5,
  "comment": "Amazing movie!"
}
```

### 4.3 Delete Review
- **Method:** `DELETE`
- **Endpoint:** `/api/reviews/:id`
- **Access:** Private (User / Admin)

---

## 5. User APIs (`/api/users`)

> مسؤول عنها: **Backend 1** & **Frontend 3**

### 5.1 Update Profile
- **Method:** `PATCH`
- **Endpoint:** `/api/users/updateprofile`
- **Access:** Private (User)
- **Request Body:**
```json
{
  "name": "John Updated",
  "email": "john_updated@example.com"
}
```
- **Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c82d88c2e111",
    "name": "John Updated",
    "email": "john_updated@example.com",
    "role": "user"
  }
}
```

### 5.2 Change Password
- **Method:** `PATCH`
- **Endpoint:** `/api/users/changepassword`
- **Access:** Private (User)
- **Request Body:**
```json
{
  "password": "oldPassword123",
  "newPassword": "newPassword456"
}
```
- **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Password Changed Successfully"
}
```

### 5.3 Delete Profile
- **Method:** `DELETE`
- **Endpoint:** `/api/users/deleteprofile`
- **Access:** Private (User)
- **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Profile Deleted Successfully"
}
```

### 5.4 Update Profile Image
- **Method:** `PATCH`
- **Endpoint:** `/api/users/updateimage`
- **Access:** Private (User)
- **Request Body:** `multipart/form-data`
  - `image` — ملف الصورة (مطلوب)
- **Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c82d88c2e111",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "filename.jpg"
  }
}
```

---

### 5.5 Get All Users *(Admin Only)*
- **Method:** `GET`
- **Endpoint:** `/api/users/getAllUsers`
- **Access:** Private (Admin)
- **Response Success (200 OK):**
```json
{
  "success": true,
  "results": 2,
  "data": [
    {
      "_id": "60d5ec49f1a2c82d88c2e111",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "image": "filename.jpg"
    }
  ]
}
```

### 5.6 Get User By ID *(Admin Only)*
- **Method:** `GET`
- **Endpoint:** `/api/users/getUserById`
- **Access:** Private (Admin)
- **Query Parameters:**
  - `id` — ID المستخدم
- **Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c82d88c2e111",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "image": "filename.jpg"
  }
}
```

### 5.7 Delete User By Admin *(Admin Only)*
- **Method:** `DELETE`
- **Endpoint:** `/api/users/deleteUserByAdmin`
- **Access:** Private (Admin)
- **Query Parameters:**
  - `id` — ID المستخدم المراد حذفه
- **Response Success (200 OK):**
```json
{
  "success": true,
  "message": "User Deleted Successfully"
}
```

### 5.8 Update User Status *(Admin Only)*
- **Method:** `PATCH`
- **Endpoint:** `/api/users/updateUserStatus`
- **Access:** Private (Admin)
- **Query Parameters:**
  - `id` — ID المستخدم
- **Request Body:**
```json
{
  "isActive": false
}
```
- **Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c82d88c2e111",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": false
  }
}
```
