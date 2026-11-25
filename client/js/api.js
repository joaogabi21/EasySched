const API_BASE_URL = 'http://localhost:3000/api';

async function tratarResposta(response) {
  const dados = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detalhes = Array.isArray(dados.detalhes) ? ` (${dados.detalhes.join(' ')})` : '';
    const mensagem = (dados.erro || `Erro HTTP ${response.status}`) + detalhes;
    throw new Error(mensagem);
  }

  return dados;
}

// ==========================================
// Endpoints de Categorias (/api/categorias)
// ==========================================

export async function listarCategorias() {
  const response = await fetch(`${API_BASE_URL}/categorias`);
  return tratarResposta(response);
}

export async function criarCategoria(dadosCategoria) {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosCategoria)
  });
  return tratarResposta(response);
}

// ==========================================
// Endpoints de Atividades (/api/atividades)
// ==========================================

export async function listarAtividades() {
  const response = await fetch(`${API_BASE_URL}/atividades`);
  return tratarResposta(response);
}

export async function buscarAtividadePorId(id) {
  const response = await fetch(`${API_BASE_URL}/atividades/${id}`);
  return tratarResposta(response);
}

export async function criarAtividade(dadosAtividade) {
  const response = await fetch(`${API_BASE_URL}/atividades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtividade)
  });
  return tratarResposta(response);
}

export async function atualizarAtividade(id, dadosAtividade) {
  const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtividade)
  });
  return tratarResposta(response);
}

export async function excluirAtividade(id) {
  const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
    method: 'DELETE'
  });
  return tratarResposta(response);
}

// Aliases para compatibilidade com principal.js e relatorio.js
export {
  listarAtividades as fetchAtividadesAPI,
  listarAtividades as getAtividadesAPI,
  listarAtividades as listarAtividadesAPI,
  listarAtividades as obterAtividadesAPI,
  buscarAtividadePorId as fetchAtividadeByIdAPI,
  buscarAtividadePorId as fetchAtividadePorIdAPI,
  buscarAtividadePorId as getAtividadeByIdAPI,
  buscarAtividadePorId as buscarAtividadePorIdAPI,
  criarAtividade as createAtividadeAPI,
  criarAtividade as criarAtividadeAPI,
  atualizarAtividade as updateAtividadeAPI,
  atualizarAtividade as atualizarAtividadeAPI,
  excluirAtividade as deleteAtividadeAPI,
  excluirAtividade as excluirAtividadeAPI,
  excluirAtividade as removerAtividadeAPI
};