const express = require('express');
const router = express.Router();
const {
  createArticle, getArticles, getArticle, updateArticle, deleteArticle
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getArticles)
  .post(protect, upload.single('coverImage'), createArticle);

router.route('/:id')
  .get(getArticle)
  .put(protect, upload.single('coverImage'), updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;