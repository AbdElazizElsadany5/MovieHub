# 🗄️ Database Documentation — MovieHub

**Database Name:** `moviehub`  
**ORM:** Mongoose

---

## 📋 Collections & Fields Overview

### 1. `users` Collection

> مسؤول عنها: **Backend 1**

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | Unique User Identifier |
| `name` | String | Yes | No | - | Full Name of the user |
| `email` | String | Yes | Yes | - | User Email Address (Lowercase, Trimmed) |
| `password` | String | Yes | No | - | Hashed Password (min 6 characters) |
| `role` | String | Yes | No | `'user'` | Role: `'user'` or `'admin'` |
| `favorites` | Array[ObjectId] | No | No | `[]` | Array of references to `movies._id` |
| `createdAt` | Date | Auto | No | `Date.now` | Account creation timestamp |
| `updatedAt` | Date | Auto | No | `Date.now` | Account last update timestamp |

---

### 2. `movies` Collection

> مسؤول عنها: **Backend 2**

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | Unique Movie Identifier |
| `title` | String | Yes | No | - | Movie Title |
| `overview` | String | Yes | No | - | Plot description / Synopsis |
| `poster` | String | Yes | No | - | Image URL for movie poster |
| `backdrop` | String | No | No | `""` | Wide backdrop header image URL |
| `trailerUrl` | String | No | No | `""` | YouTube Embed Trailer URL |
| `genres` | Array[String] | Yes | No | `[]` | Categories (e.g. `["Action", "Drama"]`) |
| `releaseYear` | Number | Yes | No | - | Release Year (e.g. `2024`) |
| `duration` | Number | No | No | `0` | Movie duration in minutes |
| `rating` | Number | No | No | `0` | Average Rating score (0.0 to 10.0) |
| `numReviews` | Number | No | No | `0` | Total number of user reviews |
| `cast` | Array[String] | No | No | `[]` | List of main actor names |
| `createdBy` | ObjectId | No | No | - | Reference to `users._id` (Admin user) |
| `createdAt` | Date | Auto | No | `Date.now` | Movie entry creation timestamp |
| `updatedAt` | Date | Auto | No | `Date.now` | Movie entry update timestamp |

---

### 3. `favorites` Collection (Standalone Option)

> مسؤول عنها: **Backend 3**

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | Unique Favorite Identifier |
| `user` | ObjectId | Yes | No | - | Reference to `users._id` |
| `movie` | ObjectId | Yes | No | - | Reference to `movies._id` |
| `createdAt` | Date | Auto | No | `Date.now` | Creation timestamp |

---

### 4. `reviews` Collection

> مسؤول عنها: **Backend 3**

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | Auto | Yes | Auto | Unique Review Identifier |
| `user` | ObjectId | Yes | No | - | Reference to `users._id` (Author) |
| `movie` | ObjectId | Yes | No | - | Reference to `movies._id` |
| `rating` | Number | Yes | No | - | Star rating score (1 to 5) |
| `comment` | String | Yes | No | - | User written review text |
| `createdAt` | Date | Auto | No | `Date.now` | Review posting timestamp |
| `updatedAt` | Date | Auto | No | `Date.now` | Review last edit timestamp |

---

## 🔗 Relationships Summary

- **User ↔ Favorites**: One-to-Many (`users.favorites` contains an array of `Movie` ObjectIds).
- **User ↔ Reviews**: One-to-Many (`reviews.user` references `User`).
- **Movie ↔ Reviews**: One-to-Many (`reviews.movie` references `Movie`).
