const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
  },
  coverImage: { 
    type: String, 
    required: [true, 'Cover image is required'] 
  },
  cloudinaryId: { 
    type: String, 
    required: true 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);