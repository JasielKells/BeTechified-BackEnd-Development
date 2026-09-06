require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const connectDB = require('./database/connectDB.js');
const articleRoutes = require('./routes/articles.js');

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/articles', articleRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API is running successfully',
        endpoints: {
            getAll: 'GET /api/articles',
            getOne: 'GET /api/articles/:id',
            create: 'POST /api/articles',
            update: 'PUT /api/articles/:id',
            delete: 'DELETE /api/articles/:id',
            search: 'GET /api/articles/search?q=keyword'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});