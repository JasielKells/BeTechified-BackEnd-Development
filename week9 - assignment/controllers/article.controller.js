const ArticleModel = require('../models/article.model');
const Joi = require('joi');

// Validation schemas
const createArticleSchema = Joi.object({
    title: Joi.string().min(5).max(200).required().messages({
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
    }),
    content: Joi.string().min(20).required().messages({
        'string.min': 'Content must be at least 20 characters',
        'any.required': 'Content is required'
    }),
    author: Joi.string().default('Guest'),
    tags: Joi.array().items(Joi.string())
});

const updateArticleSchema = Joi.object({
    title: Joi.string().min(5).max(200),
    content: Joi.string().min(20),
    author: Joi.string(),
    tags: Joi.array().items(Joi.string())
}).min(1);

// GET /articles - Get all articles
const getAllArticles = async (req, res, next) => {
    try {
        const articles = await ArticleModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles',
            error: error.message
        });
    }
};

// GET /articles/:id - Get single article
const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }
        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch article',
            error: error.message
        });
    }
};

// POST /articles - Create article
const postArticle = async (req, res, next) => {
    // Validate request body
    const { error, value } = createArticleSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(d => d.message)
        });
    }

    try {
        const newArticle = new ArticleModel(value);
        const savedArticle = await newArticle.save();
        res.status(201).json({
            success: true,
            data: savedArticle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create article',
            error: error.message
        });
    }
};

// PUT /articles/:id - Update article
const putArticle = async (req, res, next) => {
    const { error, value } = updateArticleSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(d => d.message)
        });
    }

    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            value,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedArticle) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedArticle
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update article',
            error: error.message
        });
    }
};

// DELETE /articles/:id - Delete article
const deleteArticle = async (req, res, next) => {
    try {
        const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);
        
        if (!deletedArticle) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully',
            data: deletedArticle
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete article',
            error: error.message
        });
    }
};

// BONUS: GET /articles/search?q=keyword
const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query parameter "q" is required'
            });
        }

        const articles = await ArticleModel.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(20);

        res.status(200).json({
            success: true,
            count: articles.length,
            query: q,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    postArticle,
    putArticle,
    deleteArticle,
    searchArticles
};