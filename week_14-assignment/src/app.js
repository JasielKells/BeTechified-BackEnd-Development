require('dotenv').config();
const checkEnv = require('./config/checkEnv');
checkEnv();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Error handler (LAST)
app.use(errorHandler);

module.exports = app;