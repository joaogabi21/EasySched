/**
 * api.js - Módulo de Comunicação Assíncrona via Fetch API (Etapa 05)
 */

// Cole aqui a URL gerada pelo seu MockAPI.io
const API_BASE_URL = 'https://6aed1e42fc3b911e6fd5f00e.mockapi.io/api/v1/atividades';

/**
 * GET: Consulta a lista completa de atividades no servidor.
 */
export async function fetchAtividadesAPI() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Erro na consulta (${response.status}): ${response.statusText}`);
  }
  return await response.json();
}

/**
 * GET por ID: Consulta uma única atividade no servidor.
 */
export async function fetchAtividadeByIdAPI(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar atividade #${id} (${response.status})`);
  }
  return await response.json();
}

/**
 * POST: Cadastra uma nova atividade no servidor.
 */
export async function createAtividadeAPI(novaAtividade) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(novaAtividade)
  });

  if (!response.ok) {
    throw new Error(`Erro ao cadastrar atividade (${response.status})`);
  }

  return await response.json();
}

/**
 * PUT: Atualiza uma atividade existente no servidor.
 */
export async function updateAtividadeAPI(id, atividadeAtualizada) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(atividadeAtualizada)
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar atividade #${id} (${response.status})`);
  }

  return await response.json();
}

/**
 * DELETE: Remove uma atividade do servidor.
 */
export async function deleteAtividadeAPI(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Erro ao excluir atividade #${id} (${response.status})`);
  }

  return await response.json();
}