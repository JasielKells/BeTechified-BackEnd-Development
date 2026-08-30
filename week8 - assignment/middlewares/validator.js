const { createTodoSchema, updateTodoSchema } = require('../schema/todo.schema');

// Middleware to validate POST requests
const validateCreateTodo = (req, res, next) => {
  const { error, value } = createTodoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  
  // Replace req.body with validated value
  req.body = value;
  next();
};

// Middleware to validate PATCH requests
const validateUpdateTodo = (req, res, next) => {
  const { error, value } = updateTodoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  
  // Replace req.body with validated value
  req.body = value;
  next();
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo
};