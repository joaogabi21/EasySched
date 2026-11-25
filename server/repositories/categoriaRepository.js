const { getDatabase } = require('../database/connection');

function mapearLinha(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    cor: row.cor
  };
}

async function listarTodas() {
  const db = await getDatabase();
  const rows = await db.all('SELECT * FROM categorias ORDER BY id ASC');
  return rows.map(mapearLinha);
}

async function buscarPorId(id) {
  const db = await getDatabase();
  const row = await db.get('SELECT * FROM categorias WHERE id = ?', [id]);
  return mapearLinha(row);
}

async function buscarPorSlug(slug) {
  const db = await getDatabase();
  const row = await db.get('SELECT * FROM categorias WHERE slug = ?', [slug]);
  return mapearLinha(row);
}

async function criar({ slug, nome, cor }) {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO categorias (slug, nome, cor) VALUES (?, ?, ?)',
    [slug, nome, cor || '#3b82f6']
  );
  return buscarPorId(result.lastID);
}

module.exports = {
  listarTodas,
  buscarPorId,
  buscarPorSlug,
  criar
};