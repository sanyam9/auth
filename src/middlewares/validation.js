const joi = require('joi');

const validateLogin = (req, res, next) => {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  return next();
};

const validateRegister = (req, res, next) => {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref('password')),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  return next();
};

const validateToken = (req, res, next) => {
  const schema = joi.object({
    token: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  return next();
};

module.exports = { validateRegister, validateLogin, validateToken };
