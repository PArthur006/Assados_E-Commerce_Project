const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const authenticateJWT = require("./middleware/authMiddleware");
const applySecurityMiddleware = require("./middleware/securityMiddleware");

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware para JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota inicial de teste
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rotas
app.use("/api", authRouter);
app.use("/api/produtos", authenticateJWT, productsRouter);
app.use("/api/pedidos", authenticateJWT, ordersRouter);

// Aplicar middleware de segurança
applySecurityMiddleware(app);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
