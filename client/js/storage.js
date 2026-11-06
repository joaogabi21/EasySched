/**
 * storage.js - Gerenciamento de Estado e Persistência no LocalStorage (EasySched)
*/

const STORAGE_KEY = 'easysched_atividades_v1';

/**
 * Obtém a lista de atividades cadastradas no localStorage.
 * Retorna um array vazio caso não existam dados salvos.
 * @returns {Array} Lista de objetos de atividade
 */
function getAtividades() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Erro ao ler do localStorage, reinicializando:', e);
    saveAtividades([]);
    return [];
  }
}

/**
 * Salva a array de atividades no localStorage.
 * @param {Array} lista - Lista atualizada de atividades
 */
function saveAtividades(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

/**
 * Adiciona uma nova atividade ao repositório.
 * @param {Object} novaAtividade 
 */
function addAtividade(novaAtividade) {
  const lista = getAtividades();
  lista.push(novaAtividade);
  saveAtividades(lista);
}

/**
 * Atualiza o status de uma atividade existente.
 * @param {string} id - ID da atividade
 * @param {string} novoStatus - Novo status ('pendente', 'em_andamento', 'concluido')
 */
function updateStatusAtividade(id, novoStatus) {
  const mapRotulos = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído'
  };
  const lista = getAtividades();
  const index = lista.findIndex(item => item.id === id);
  if (index !== -1) {
    lista[index].status = novoStatus;
    lista[index].statusRotulo = mapRotulos[novoStatus] || novoStatus;
    saveAtividades(lista);
  }
}

/**
 * Remove uma atividade por ID.
 * @param {string} id - ID da atividade a excluir
 */
function deleteAtividade(id) {
  const lista = getAtividades();
  const listaFiltrada = lista.filter(item => item.id !== id);
  saveAtividades(listaFiltrada);
}

/**
 * Busca uma atividade específica pelo ID.
 * @param {string} id - ID da atividade
 * @returns {Object|null} Retorna a atividade ou null se não for encontrada.
 */
function getAtividadeById(id) {
  const lista = getAtividades();
  return lista.find(item => item.id === id) || null;
}

/**
 * Atualiza os dados de uma atividade existente no localStorage.
 * @param {Object} atividadeAtualizada - Objeto da atividade com dados alterados
 */
function updateAtividade(atividadeAtualizada) {
  const lista = getAtividades();
  const index = lista.findIndex(item => item.id === atividadeAtualizada.id);
  if (index !== -1) {
    lista[index] = atividadeAtualizada;
    saveAtividades(lista);
  }
}