const express = require('express');
const router = express.Router();
const {
    getAllArticles,
    getArticleById,
    postArticle,
    putArticle,
    deleteArticle,
    searchArticles
} = require('../controllers/article.controller');

// Routes
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);
router.post('/', postArticle);
router.put('/:id', putArticle);
router.delete('/:id', deleteArticle);

module.exports = router;