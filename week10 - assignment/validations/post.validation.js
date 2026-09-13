const Joi = require('joi');

const validateArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5),
    content: Joi.string().min(20),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateArticle, validateUpdateArticle };