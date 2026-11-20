const express = require('express');
const cors = require('cors');
const atividadesRoutes = require('./routes/atividades');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Organiza as rotas do recurso principal
app.use('/api/atividades', atividadesRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

// Tratamento padrão para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Tratamento padrão para erros de JSON ou servidor (400 / 500)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ erro: 'JSON inválido na requisição.' });
  }
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}/api/atividades`);
});