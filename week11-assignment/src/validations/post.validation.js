const Joi = require('joi');

const validateArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.empty': 'Title is required',
      'any.required': 'Title is required',
    }),
    content: Joi.string().min(20).required().messages({
      'string.min': 'Content must be at least 20 characters long',
      'string.empty': 'Content is required',
      'any.required': 'Content is required',
    }),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }

  req.body = value;
  next();
};

const validateUpdateArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).messages({
      'string.min': 'Title must be at least 5 characters long',
    }),
    content: Joi.string().min(20).messages({
      'string.min': 'Content must be at least 20 characters long',
    }),
  }).min(1); // require at least one field for update

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }

  req.body = value;
  next();
};

module.exports = { validateArticle, validateUpdateArticle };