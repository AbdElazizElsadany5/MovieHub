# 🌐 API Documentation — MovieHub
**Base URL:** `/api`  
**Response Format:** JSON  
**Auth Method:** Bearer JWT Token (`Authorization: Bearer <token>`)
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
