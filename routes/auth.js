const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuarios } = require('./schemas/models');

const router = express.Router();

// Registrar usuário
router.post('/auth/register', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = new Usuarios({ email, senha: senhaHash });
    await usuario.save();
    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login de usuário
router.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuarios.findOne({ email });
    if (!usuario) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;