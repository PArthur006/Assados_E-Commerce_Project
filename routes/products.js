const express = require("express");
const router = express.Router();
const { Catalogo } = require("./schemas/models");

// Criar produto
router.post("/produtos", async (req, res) => {
  try {
    const produto = new Catalogo(req.body);
    await produto.save();
    res.status(201).send(produto);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Listar produtos
router.get("/produtos", async (req, res) => {
  try {
    const produtos = await Catalogo.find();
    res.send(produtos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Atualizar produto
router.put("/produtos/:id", async (req, res) => {
  try {
    const produto = await Catalogo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!produto) {
      return res.status(404).send({ error: "Produto não encontrado" });
    }
    res.send(produto);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Excluir produto (exclusão lógica)
router.delete("/produtos/:id", async (req, res) => {
  try {
    const produto = await Catalogo.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true },
    );
    if (!produto) {
      return res.status(404).send({ error: "Produto não encontrado" });
    }
    res.send(produto);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
