const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./database/connection');
const atividadesRouter = require('./routes/atividades');
const categoriasRouter = require('./routes/categorias');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API REST
app.use('/api/atividades', atividadesRouter);
app.use('/api/categorias', categoriasRouter);

// Tratamento de rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware global de tratamento de erros (JSON, validação e persistência)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      erro: 'Erro de integridade no banco de dados.',
      detalhes: ['Violação de chave única ou chave estrangeira (registro duplicado ou referência inválida).']
    });
  }

  if (err.code && err.code.startsWith('SQLITE_')) {
    console.error('Erro de persistência SQLite:', err);
    return res.status(500).json({ erro: 'Erro interno ao persistir dados no banco.' });
  }

  console.error('Erro interno:', err);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

async function iniciarServidor() {
  try {
    await getDatabase();
    app.listen(PORT, () => {
      console.log(`Banco SQLite inicializado com sucesso.`);
      console.log(`API rodando em http://localhost:${PORT}/api/atividades`);
    });
  } catch (err) {
    console.error('Falha crítica ao inicializar o banco de dados:', err);
    process.exit(1);
  }
}

iniciarServidor();