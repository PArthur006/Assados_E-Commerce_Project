const mongoose = require('mongoose');

// Middleware para adicionar campos obrigatórios
const addTimestamps = (schema) => {
  schema.add({
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
  });

  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });
};

// Schema para a coleção Catálogo
const catalogSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  categoria: { type: String, required: true },
  preco: { type: Number, required: true },
});
addTimestamps(catalogSchema);

// Schema para a coleção Pedidos
const orderSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  produtos: [
    {
      nome: String,
      preco: Number,
      quantidade: Number,
    },
  ],
  total: { type: Number, required: true },
});
addTimestamps(orderSchema);

// Schema para a coleção Estoque
const stockSchema = new mongoose.Schema({
  produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogo' },
  quantidade: { type: Number, required: true },
});
addTimestamps(stockSchema);

// Exportar modelos
module.exports = {
  Catalogo: mongoose.model('Catalogo', catalogSchema),
  Pedidos: mongoose.model('Pedidos', orderSchema),
  Estoque: mongoose.model('Estoque', stockSchema),
};