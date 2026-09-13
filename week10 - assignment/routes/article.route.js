const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/requireAuth');

const {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
} = require('../controllers/article.controller');

const {
  validateArticle,
  validateUpdateArticle,
} = require('../validations/post.validation');

// FIXED: Removed the '?' to stop the crash
router.post('/', requireAuth, validateArticle, postArticle);
router.get('/', requireAuth, getAllArticle);
router.get('/:id', requireAuth, getArticleById);
router.put('/:id', requireAuth, validateUpdateArticle, updateArticleById);
router.delete('/:id', requireAuth, deleteArticleById);

module.exports = router;