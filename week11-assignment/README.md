# Week 11 Assignment — MVC Blog API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** following the **MVC (Model-View-Controller)** architecture. Users can register, log in, and perform CRUD operations on articles with authentication and ownership protection.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Request Examples](#-request-examples)
- [Error Handling](#-error-handling)
- [Scripts](#-scripts)
- [Design Decisions](#-design-decisions)
- [Testing the API](#-testing-the-api)
- [Author](#-author)
- [License](#-license)

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based auth with hashed passwords (bcrypt)
- 📝 **Article CRUD** — Create, read, update, and delete articles
- 👤 **Ownership Protection** — Users can only edit/delete their own articles
- ✅ **Input Validation** — All inputs validated with Joi before hitting controllers
- ⚙️ **Environment Verification** — Startup check ensures required env vars are set
- 🛡️ **Centralized Error Handling** — Consistent error responses across the API
- 📊 **Request Logging** — Middleware logs each request with status and timestamp
- 🧱 **MVC Architecture** — Clean separation of concerns across layers

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Validation | Joi |
| Dev Tools | nodemon, dotenv |

---

## 📁 Project Structure

```
week11-assignment/
├── config/
│   ├── connectDB.js         # MongoDB connection logic
│   └── verifyEnv.js         # Ensures required env vars are set
├── src/
│   ├── controllers/         # Request handlers (HTTP logic)
│   │   ├── article.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Express middlewares
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── requireAuth.js
│   ├── models/              # Mongoose schemas (data layer)
│   │   ├── article.model.js
│   │   └── user.model.js
│   ├── routes/              # API route definitions
│   │   ├── article.route.js
│   │   └── user.route.js
│   ├── validations/         # Joi validation schemas
│   │   ├── post.validation.js
│   │   └── user.validation.js
│   └── app.js               # Express app configuration
├── .env.example             # Sample environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Server entry point
```

### 🧭 MVC Flow

```
Request → Route → Middleware (auth + validation) → Controller → Model → Response
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/week11-assignment.git
cd week11-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

### 4. Start the development server

```bash
npm run dev
```

If everything is set up correctly, you'll see:

```
✅ Environment variables verified.
MongoDB connected successfully
Server is listening on Port 3000
```

---

## 🔑 Environment Variables

The app **verifies these variables on startup** via `config/verifyEnv.js`. If any are missing, it exits with a clear error message.

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/week11` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_string` |
| `NODE_ENV` | Environment mode (optional) | `development` / `production` |

Example `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/week11
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> ⚠️ **Never commit `.env` to version control.** It's already listed in `.gitignore`.

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:3000/api`

### 👤 User Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/users/signup` | Public | Register a new user |
| `POST` | `/users/login` | Public | Log in and receive a JWT |

### 📝 Article Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/articles` | Private | Create a new article |
| `GET` | `/articles` | Private | Get all articles |
| `GET` | `/articles/:id` | Private | Get a single article by ID |
| `PUT` | `/articles/:id` | Private (owner) | Update your own article |
| `DELETE` | `/articles/:id` | Private (owner) | Delete your own article |

> **Private** = requires a `Bearer <token>` in the `Authorization` header.

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)**. After logging in, include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after **7 days**. Requests without a valid token receive `401 Unauthorized`.

---

## 🧪 Request Examples

### 1. Sign Up

```http
POST /api/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### 2. Log In

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### 3. Create an Article

```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Article",
  "content": "This is a long enough content to pass validation."
}
```

**Response (201):**
```json
{
  "message": "Article created",
  "data": {
    "_id": "...",
    "title": "My First Article",
    "content": "This is a long enough content to pass validation.",
    "author": "user_id_here",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. Get All Articles

```http
GET /api/articles
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "My First Article",
      "content": "...",
      "author": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

---

### 5. Update an Article (Owner Only)

```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title"
}
```

**Response (200):** `{ "message": "Article updated", "data": { ... } }`

**Response (403) if you're not the owner:**
```json
{ "message": "You can only edit your own articles" }
```

---

### 6. Delete an Article (Owner Only)

```http
DELETE /api/articles/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{ "message": "Article deleted successfully" }
```

---

## 🚨 Error Handling

All errors flow through a centralized `errorHandler` middleware that returns consistent JSON:

```json
{
  "status": "error",
  "message": "Description of what went wrong",
  "stack": "..." // Only shown in development
}
```

### Common Status Codes

| Code | Meaning |
|---|---|
| `200` | OK — successful request |
| `201` | Created — resource successfully created |
| `400` | Bad Request — validation or duplicate key error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — you don't own this resource |
| `404` | Not Found — resource doesn't exist |
| `500` | Internal Server Error |

### Validation Errors

Validation failures return **all** error messages at once:

```json
{
  "errors": [
    "Title must be at least 5 characters long",
    "Content must be at least 20 characters long"
  ]
}
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm start` | Run the server in production mode |
| `npm run dev` | Run with nodemon (auto-reload on save) |

Example `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🧠 Design Decisions

- **MVC Layering** — Controllers never contain DB queries directly; models handle schemas, controllers handle logic, routes handle mapping.
- **Password Hashing in Model Hook** — The `pre('save')` hook guarantees passwords are always hashed, even if other code creates users.
- **Ownership Check Before Update/Delete** — Prevents users from modifying each other's articles.
- **Whitelisting Update Fields** — `title` and `content` are explicitly picked from `req.body` so users can't hijack the `author` field.
- **Environment Verification** — Fails fast on startup if `.env` is misconfigured, avoiding cryptic runtime errors.
- **`runValidators: true`** — Ensures Mongoose schema rules (minLength, required) are enforced during updates.

---

## 🧪 Testing the API

You can test the endpoints using:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- `curl` in the terminal

Example `curl` for signup:

```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"secret123"}'
```

---

## 📌 Notes

- **Do not commit your `.env` file.** Use `.env.example` as a template.
- Passwords are hashed with **bcrypt** (10 salt rounds) and never returned in API responses.
- JWT tokens expire after **7 days** — clients must re-authenticate after expiration.

---

---

## 📄 License

This project is for educational purposes as part of the **Week 11 Assignment**.

---

⭐ If this project helped you understand MVC in Node.js, give it a star!