const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middleware de segurança
module.exports = (app) => {
  // Proteção de cabeçalhos HTTP
  app.use(helmet());

  // Limitação de taxa de requisições
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: "Muitas requisições vindas deste IP. Tente novamente mais tarde.",
  });
  app.use(limiter);
};
