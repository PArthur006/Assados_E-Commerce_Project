const express = require('express');
const router = express.Router();
const { Pedidos } = require('./schemas/models');

// Criar pedido
router.post('/pedidos', async (req, res) => {
  try {
    const pedido = new Pedidos(req.body);
    await pedido.save();
    res.status(201).send(pedido);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Listar pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedidos.find();
    res.send(pedidos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Atualizar pedido
router.put('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedidos.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pedido) {
      return res.status(404).send({ error: 'Pedido não encontrado' });
    }
    res.send(pedido);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Excluir pedido (exclusão lógica)
router.delete('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedidos.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
    if (!pedido) {
      return res.status(404).send({ error: 'Pedido não encontrado' });
    }
    res.send(pedido);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;