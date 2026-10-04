const express = require('express');

// Import Routes
const userRoutes = require('./routes/user.route');
const articleRoutes = require('./routes/article.route');

// Import Middleware
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Global Middleware ---
app.use(express.json());
app.use(logger);

// --- Mount Routes ---
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// --- Error Handling Middleware (must be last) ---
app.use(errorHandler);

module.exports = app;