const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/requireAuth');

const {
  postArticle,
  getAllArticles,
  getArticleById,
  updateArticleById,
  deleteArticleById,
} = require('../controllers/article.controller');

const {
  validateArticle,
  validateUpdateArticle,
} = require('../validations/post.validation');

router.post('/', requireAuth, validateArticle, postArticle);
router.get('/', requireAuth, getAllArticles);
router.get('/:id', requireAuth, getArticleById);
router.put('/:id', requireAuth, validateUpdateArticle, updateArticleById);
router.delete('/:id', requireAuth, deleteArticleById);

module.exports = router;