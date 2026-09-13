const ArticleModel = require('../models/article.model');

// Create Article
const postArticle = async (req, res, next) => {
  try {
    const newArticle = new ArticleModel({
      title: req.body.title,
      content: req.body.content,
      author: req.user.userId, // Extracted from JWT token payload
    });

    await newArticle.save();

    return res.status(201).json({
      message: 'Article created',
      data: newArticle,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Articles
const getAllArticle = async (req, res, next) => {
  try {
    // The .populate() method replaces the author ID with the actual user document
    const articles = await ArticleModel.find().populate('author', 'name email');
    return res.status(200).json({ data: articles });
  } catch (error) {
    next(error);
  }
};

// Get Article By ID
const getArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id).populate('author', 'name email');
    if (!article) return res.status(404).json({ message: 'Article not found' });
    
    return res.status(200).json({ data: article });
  } catch (error) {
    next(error);
  }
};

// Update Article (With Step 5 Bonus Ownership Check)
const updateArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Bonus: Ownership Check
    if (article.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You can only edit your own articles' });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Article updated', data: updatedArticle });
  } catch (error) {
    next(error);
  }
};

// Delete Article (With Step 5 Bonus Ownership Check)
const deleteArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Bonus: Ownership Check
    if (article.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own articles' });
    }

    await ArticleModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
};