// middleware/validateObjectId.js
const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'Invalid Todo ID',
      message: 'The provided ID is not found'
    });
  }
  next();
};

module.exports = validateObjectId;