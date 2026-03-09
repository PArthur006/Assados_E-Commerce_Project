const Joi = require('joi');

// Validação de entrada para registro de usuário
const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Validação de entrada para login de usuário
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { validateRegister, validateLogin };