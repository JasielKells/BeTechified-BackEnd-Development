const Article = require('../models/Article');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create article (Protected)
// @route   POST /api/articles
exports.createArticle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a cover image' });
    }

    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      coverImage: req.file.path,
      cloudinaryId: req.file.filename,
      author: req.user._id // Injected by auth middleware
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles (Public)
// @route   GET /api/articles
exports.getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article (Public)
// @route   GET /api/articles/:id
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email');

    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article (Protected — author only)
// @route   PUT /api/articles/:id
exports.updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Ownership check
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    // If new image uploaded, delete old one from Cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(article.cloudinaryId);
      req.body.coverImage = req.file.path;
      req.body.cloudinaryId = req.file.filename;
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article (Protected — author only)
// @route   DELETE /api/articles/:id
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await cloudinary.uploader.destroy(article.cloudinaryId);
    await article.deleteOne();

    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
};