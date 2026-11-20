const express = require('express');
const router = express.Router();

// Banco de dados simples em memória (já inicia com 1 exemplo para testes)
let atividades = [
  {
    id: '1',
    titulo: 'Revisão de Desenvolvimento Web',
    descricao: 'Testar API REST da Etapa 06',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '14:00',
    horaFim: '16:00',
    categoria: 'estudos',
    categoriaRotulo: 'Estudos',
    status: 'pendente',
    statusRotulo: 'Pendente',
    ativarLembrete: true,
    antecedencia: '30',
    canalAlerta: 'navegador'
  }
];

// Função simples de validação de entrada
function validarAtividade(dados) {
  const erros = [];
  if (!dados.titulo || dados.titulo.trim() === '') erros.push('O título é obrigatório.');
  if (!dados.data) erros.push('A data é obrigatória.');
  if (!dados.horaInicio || !dados.horaFim) erros.push('Os horários de início e fim são obrigatórios.');
  if (dados.horaInicio && dados.horaFim && dados.horaFim <= dados.horaInicio) {
    erros.push('O horário de término deve ser maior que o de início.');
  }
  if (!dados.categoria) erros.push('A categoria é obrigatória.');
  return erros;
}

// 1. GET - Consulta geral
router.get('/', (req, res) => {
  res.status(200).json(atividades);
});

// 2. GET /:id - Consulta individual
router.get('/:id', (req, res) => {
  const item = atividades.find(a => String(a.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ erro: 'Atividade não encontrada.' });
  }
  res.status(200).json(item);
});

// 3. POST - Criação
router.post('/', (req, res) => {
  const erros = validarAtividade(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
  }

  const nova = {
    ...req.body,
    id: Date.now().toString(),
    status: req.body.status || 'pendente'
  };

  atividades.push(nova);
  res.status(201).json(nova);
});

// 4. PUT /:id - Alteração
router.put('/:id', (req, res) => {
  const index = atividades.findIndex(a => String(a.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ erro: 'Atividade não encontrada.' });
  }

  const erros = validarAtividade(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
  }

  atividades[index] = {
    ...atividades[index],
    ...req.body,
    id: String(req.params.id)
  };

  res.status(200).json(atividades[index]);
});

// 5. DELETE /:id - Exclusão
router.delete('/:id', (req, res) => {
  const index = atividades.findIndex(a => String(a.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ erro: 'Atividade não encontrada.' });
  }

  const removida = atividades.splice(index, 1)[0];
  res.status(200).json({ mensagem: 'Atividade excluída com sucesso.', atividade: removida });
});

module.exports = router;