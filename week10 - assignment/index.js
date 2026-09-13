require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import Routes
const userRoutes = require('./routes/user.route');
const articleRoutes = require('./routes/article.route');

// Import Middleware
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Global Middleware ---
app.use(express.json()); // Parses incoming JSON requests
app.use(logger);         // Logs all incoming requests

// --- Mount Routes ---
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// --- Error Handling Middleware ---
// Must be the last middleware added
app.use(errorHandler);

// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 3007;

app.listen(PORT, () => console.log(`Server is listening on Port ${PORT}`));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch(err => console.error('MongoDB connection error:', err));