const { getDatabase } = require('../database/connection');

const STATUS_ROTULOS = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído'
};

function mapearLinhaParaObjeto(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    titulo: row.titulo,
    descricao: row.descricao || '',
    data: row.data,
    horaInicio: row.hora_inicio,
    horaFim: row.hora_fim,
    categoriaId: row.categoria_id,
    categoria: row.categoria_slug,
    categoriaRotulo: row.categoria_nome,
    status: row.status,
    statusRotulo: STATUS_ROTULOS[row.status] || 'Pendente',
    ativarLembrete: Boolean(row.ativar_lembrete),
    antecedencia: row.antecedencia,
    canalAlerta: row.canal_alerta
  };
}

async function listarTodas() {
  const db = await getDatabase();
  const rows = await db.all(`
    SELECT a.*, c.slug AS categoria_slug, c.nome AS categoria_nome
    FROM atividades a
    INNER JOIN categorias c ON a.categoria_id = c.id
    ORDER BY a.data ASC, a.hora_inicio ASC
  `);
  return rows.map(mapearLinhaParaObjeto);
}

async function buscarPorId(id) {
  const db = await getDatabase();
  const row = await db.get(`
    SELECT a.*, c.slug AS categoria_slug, c.nome AS categoria_nome
    FROM atividades a
    INNER JOIN categorias c ON a.categoria_id = c.id
    WHERE a.id = ?
  `, [id]);
  return mapearLinhaParaObjeto(row);
}

async function criar(dados) {
  const db = await getDatabase();
  const result = await db.run(`
    INSERT INTO atividades (
      titulo, descricao, data, hora_inicio, hora_fim,
      status, ativar_lembrete, antecedencia, canal_alerta, categoria_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    dados.titulo,
    dados.descricao || '',
    dados.data,
    dados.horaInicio,
    dados.horaFim,
    dados.status || 'pendente',
    dados.ativarLembrete ? 1 : 0,
    dados.antecedencia || '15',
    dados.canalAlerta || 'navegador',
    dados.categoriaId
  ]);
  return buscarPorId(result.lastID);
}

async function atualizar(id, dados) {
  const db = await getDatabase();
  const result = await db.run(`
    UPDATE atividades
    SET titulo = ?, descricao = ?, data = ?, hora_inicio = ?, hora_fim = ?,
        status = ?, ativar_lembrete = ?, antecedencia = ?, canal_alerta = ?, categoria_id = ?
    WHERE id = ?
  `, [
    dados.titulo,
    dados.descricao || '',
    dados.data,
    dados.horaInicio,
    dados.horaFim,
    dados.status || 'pendente',
    dados.ativarLembrete ? 1 : 0,
    dados.antecedencia || '15',
    dados.canalAlerta || 'navegador',
    dados.categoriaId,
    id
  ]);
  if (result.changes === 0) return null;
  return buscarPorId(id);
}

async function excluir(id) {
  const existente = await buscarPorId(id);
  if (!existente) return null;
  const db = await getDatabase();
  await db.run('DELETE FROM atividades WHERE id = ?', [id]);
  return existente;
}

module.exports = { listarTodas, buscarPorId, criar, atualizar, excluir };