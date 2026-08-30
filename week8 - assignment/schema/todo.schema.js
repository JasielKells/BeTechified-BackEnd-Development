const Joi = require('joi');

// Schema for creating a new todo
const createTodoSchema = Joi.object({
  task: Joi.string().min(3).required().messages({
    'string.min': 'Task must be at least 3 characters long',
    'any.required': 'Task field is required'
  }),
  completed: Joi.boolean().required().messages({
    'any.required': 'Completed field is required'
  })
});

// Schema for updating a todo (all fields optional)
const updateTodoSchema = Joi.object({
  task: Joi.string().min(3).messages({
    'string.min': 'Task must be at least 3 characters long'
  }),
  completed: Joi.boolean()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = {
  createTodoSchema,
  updateTodoSchema
};