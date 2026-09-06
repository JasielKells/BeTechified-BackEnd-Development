const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        minlength: [20, 'Content must be at least 20 characters']
    },
    author: {
        type: String,
        default: 'Guest',
        trim: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Text index for search (bonus)
articleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);