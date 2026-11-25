const express = require('express');
const router = express.Router();
const atividadeRepository = require('../repositories/atividadeRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

const STATUS_VALIDOS = ['pendente', 'em_andamento', 'concluido'];

async function validarEResolverDados(body) {
  const erros = [];

  if (!body.titulo || typeof body.titulo !== 'string' || body.titulo.trim() === '') {
    erros.push('O título é obrigatório.');
  }

  if (!body.data || typeof body.data !== 'string' || body.data.trim() === '') {
    erros.push('A data é obrigatória.');
  }

  if (!body.horaInicio || !body.horaFim) {
    erros.push('Os horários de início e fim são obrigatórios.');
  } else if (body.horaFim <= body.horaInicio) {
    erros.push('O horário de término deve ser posterior ao horário de início.');
  }

  if (body.status && !STATUS_VALIDOS.includes(body.status)) {
    erros.push('O status informado é inválido.');
  }

  let categoriaEncontrada = null;

  if (body.categoriaId !== undefined && body.categoriaId !== null && body.categoriaId !== '') {
    categoriaEncontrada = await categoriaRepository.buscarPorId(Number(body.categoriaId));
    if (!categoriaEncontrada) {
      erros.push('A categoriaId informada não existe no banco de dados.');
    }
  } else if (body.categoria && typeof body.categoria === 'string' && body.categoria.trim() !== '') {
    categoriaEncontrada = await categoriaRepository.buscarPorSlug(body.categoria.trim().toLowerCase());
    if (!categoriaEncontrada) {
      erros.push('A categoria informada não existe no banco de dados.');
    }
  } else {
    erros.push('A categoria é obrigatória.');
  }

  return {
    erros,
    categoriaId: categoriaEncontrada ? categoriaEncontrada.id : null
  };
}

// GET /api/atividades - Consulta geral
router.get('/', async (req, res, next) => {
  try {
    const atividades = await atividadeRepository.listarTodas();
    res.status(200).json(atividades);
  } catch (err) {
    next(err);
  }
});

// GET /api/atividades/:id - Consulta individual
router.get('/:id', async (req, res, next) => {
  try {
    const atividade = await atividadeRepository.buscarPorId(req.params.id);
    if (!atividade) {
      return res.status(404).json({ erro: 'Atividade não encontrada.' });
    }
    res.status(200).json(atividade);
  } catch (err) {
    next(err);
  }
});

// POST /api/atividades - Criação com persistência
router.post('/', async (req, res, next) => {
  try {
    const { erros, categoriaId } = await validarEResolverDados(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
    }

    const novaAtividade = await atividadeRepository.criar({
      ...req.body,
      titulo: req.body.titulo.trim(),
      categoriaId
    });

    res.status(201).json(novaAtividade);
  } catch (err) {
    next(err);
  }
});

// PUT /api/atividades/:id - Atualização com persistência
router.put('/:id', async (req, res, next) => {
  try {
    const existente = await atividadeRepository.buscarPorId(req.params.id);
    if (!existente) {
      return res.status(404).json({ erro: 'Atividade não encontrada.' });
    }

    const { erros, categoriaId } = await validarEResolverDados(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
    }

    const atualizada = await atividadeRepository.atualizar(req.params.id, {
      ...req.body,
      titulo: req.body.titulo.trim(),
      categoriaId
    });

    res.status(200).json(atualizada);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/atividades/:id - Exclusão com persistência
router.delete('/:id', async (req, res, next) => {
  try {
    const removida = await atividadeRepository.excluir(req.params.id);
    if (!removida) {
      return res.status(404).json({ erro: 'Atividade não encontrada.' });
    }

    res.status(200).json({
      mensagem: 'Atividade excluída com sucesso.',
      atividade: removida
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;