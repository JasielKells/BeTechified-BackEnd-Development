# 📝 Blog API - MVC Refactor (Week 14 Assignment)

A robust, production-ready RESTful Blog API built with **Node.js**, **Express**, and **MongoDB**. This project was refactored from a monolithic structure into a clean **MVC (Model-View-Controller)** architecture, complete with **JWT Authentication**, **Cloudinary Image Uploads**, and strict **Environment Variable Validation**.

## 🔗 Live Links
* **API Base URL:** `https://your-render-app-url.onrender.com` *(Replace with your actual Render URL)*
* **GitHub Repository:** `https://github.com/yourusername/week10-assignment` *(Replace with your actual GitHub link)*


## ✨ Features

* **MVC Architecture:** Clean separation of concerns (Models, Views/JSON, Controllers, Routes, Middleware).
* **Authentication:** Secure user registration and login using **JWT (JSON Web Tokens)** and **bcryptjs** for password hashing.
* **Cloud Image Storage:** Seamless integration with **Cloudinary** using **Multer** for handling multipart/form-data article cover images.
* **Data Validation:** Mongoose schema validation and a custom `checkEnv.js` script that prevents the server from starting if required environment variables are missing.
* **Error Handling:** Centralized error-handling middleware that gracefully handles validation errors, duplicate keys, and file size limits.
* **Protected Routes:** Only authenticated users can create, update, or delete their own articles.


## 📂 Project Structure

The project follows a standard `src` directory pattern to keep the root clean and the application scalable.


week14-assignment/
├── src/
│   ├── config/
│   │   ├── checkEnv.js       # Validates required .env variables
│   │   ├── cloudinary.js     # Multer & Cloudinary configuration
│   │   └── db.js             # MongoDB connection logic
│   ├── controllers/
│   │   ├── articleController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
│   │   ├── Article.js
│   │   └── User.js
│   ├── routes/
│   │   ├── articleRoutes.js
│   │   └── authRoutes.js
│   └── app.js                # Express app configuration
├── .env.example              # Template for environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Entry point (Connects DB & starts server)



## 🚀 Getting Started Locally

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) installed locally or a free MongoDB Atlas cluster.
* A [Cloudinary](https://cloudinary.com/) account (Free tier is fine).

### 2. Installation
Clone the repository and install the dependencies:

    git clone https://github.com/yourusername/week10-assignment.git
    cd week10-assignment
    npm install


### 3. Environment Variables
Duplicate the `.env.example` file and rename it to `.env`:

    cp .env.example .env

Open `.env` and fill in your specific credentials:

    PORT=0000
    NODE_ENV=development
    MONGO_URI=mongodb://localhost:27017/blog_api
    JWT_SECRET=your_super_secret_key_here
    JWT_EXPIRES_IN=7d
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret


### 4. Run the Application
Start the development server:

    npm run dev

The server will start at `http://localhost:0000`. If any variables are missing in `.env`, the server will intentionally crash with a descriptive error.



## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method |   Endpoint  |          Description         | Access |
|--------|-------------|------------------------------|--------|
| `POST` | `/register` |     Register a new user      | Public |
| `POST` |   `/login`  |  Login and receive JWT token | Public |

### 📝 Articles (`/api/articles`)
|  Method  | Endpoint |           Description           |           Access           |
|----------|----------|---------------------------------|----------------------------|
|   `GET`  |    `/`   |        Get all articles         |           Public           |
|   `GET`  |   `/:id` |      Get a single article       |           Public           |
|  `POST`  |    `/`   |      Create a new article       | **Private** (Bearer Token) |
|   `PUT`  |   `/:id` | Update an article (Author only) | **Private** (Bearer Token) |
| `DELETE` |   `/:id` | Delete an article (Author only) | **Private** (Bearer Token) |


## 🧪 Testing Guide (Postman)

### 1. Register a User
* **Method:** `POST`
* **URL:** `http://localhost:0000/api/auth/register`
* **Body (raw JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  
* **Response:** Returns a `token`. Copy this token.

### 2. Create an Article (With Cloudinary Image)
* **Method:** `POST`
* **URL:** `http://localhost:0000/api/articles`
* **Headers:**
  * `Authorization`: `Bearer <YOUR_COPIED_TOKEN>`
* **Body (form-data):**
  * `title` (Text): `My First Blog`
  * `content` (Text): `This is the content.`
  * `coverImage` (**File**): *Select a `.jpg` or `.png` file from your computer.*
* *(Note: Do NOT set the `Content-Type` header manually in Postman when using form-data).*

### 3. Delete an Article
* **Method:** `DELETE`
* **URL:** `http://localhost:0000/api/articles/<ARTICLE_ID>`
* **Headers:**
  * `Authorization`: `Bearer <YOUR_COPIED_TOKEN>`
* **Result:** Deletes the article from MongoDB and deletes the image from Cloudinary.


## ☁️ Deployment (Render)

This API is configured to be deployed on **Render**.

1. Push your code to GitHub (ensure `.env` is in `.gitignore`).
2. In Render, create a **New Web Service**.
3. Connect your GitHub repository.
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Go to the **Environment** tab and add all the variables from your `.env` file.
7. Deploy!


## 🛡️ Built With

* [Express.js](https://expressjs.com/) - Web framework
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Database & ODM
* [JSON Web Token](https://jwt.io/) - Authentication
* [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Password hashing
* [Multer](https://github.com/expressjs/multer) - Multipart form-data handling
* [Cloudinary](https://cloudinary.com/) - Cloud image storage