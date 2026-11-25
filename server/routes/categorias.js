const express = require('express');
const router = express.Router();
const categoriaRepository = require('../repositories/categoriaRepository');

function gerarSlug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/categorias - Lista todas as categorias do banco
router.get('/', async (req, res, next) => {
  try {
    const categorias = await categoriaRepository.listarTodas();
    res.status(200).json(categorias);
  } catch (err) {
    next(err);
  }
});

// POST /api/categorias - Cria uma nova categoria
router.post('/', async (req, res, next) => {
  try {
    const { nome, slug, cor } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({
        erro: 'Dados inválidos.',
        detalhes: ['O nome da categoria é obrigatório.']
      });
    }

    const slugFinal = slug && slug.trim() !== '' ? gerarSlug(slug) : gerarSlug(nome);
    const novaCategoria = await categoriaRepository.criar({
      slug: slugFinal,
      nome: nome.trim(),
      cor: cor && cor.trim() !== '' ? cor.trim() : '#3b82f6'
    });

    res.status(201).json(novaCategoria);
  } catch (err) {
    next(err);
  }
});

module.exports = router;