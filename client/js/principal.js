/**
 * principal.js - Lógica Assíncrona do Dashboard Completo (Etapa 05)
 * Projeto: EasySched
 */

import { fetchAtividadesAPI, updateAtividadeAPI, deleteAtividadeAPI } from './api.js';

let listaGlobalAtividades = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
});

/**
 * Consulta a API e atualiza todas as seções do Dashboard
 */
async function carregarDashboard() {
  const secaoResumo = document.getElementById('secao-resumo') || 
                      document.querySelector('section[aria-labelledby="titulo-resumo"]');
  const secaoCronograma = document.getElementById('secao-cronograma') || 
                         document.querySelector('section[aria-labelledby="titulo-cronograma"]');
  const secaoLembretes = document.getElementById('secao-lembretes') || 
                        document.querySelector('section[aria-labelledby="titulo-lembretes"]');

  // Estado de Carregamento (Loading)
  if (secaoCronograma) {
    exibirMensagemContainer(secaoCronograma, '⏳ Carregando compromissos...', 'info');
  }

  try {
    // Consulta GET assíncrona na API
    listaGlobalAtividades = await fetchAtividadesAPI();

    // Renderiza cada uma das 3 seções do Dashboard
    if (secaoResumo) renderizarResumoHoje(secaoResumo, listaGlobalAtividades);
    if (secaoCronograma) renderizarCronograma(secaoCronograma, listaGlobalAtividades);
    if (secaoLembretes) renderizarLembretes(secaoLembretes, listaGlobalAtividades);

  } catch (erro) {
    if (secaoCronograma) {
      exibirMensagemContainer(secaoCronograma, 'Não foi possível carregar os dados. Verifique a conexão com o servidor.', 'erro');
    }
    console.error('Erro ao carregar o dashboard:', erro);
  }
}

// --------------------------------------------------------------------------
// 1. SEÇÃO RESUMO DE HOJE
// --------------------------------------------------------------------------
function renderizarResumoHoje(container, lista) {
  const hojeStr = getHojeDataStr();
  const atividadesHoje = lista.filter(item => item.data === hojeStr);

  const totalHoje = atividadesHoje.length;
  const concluidasHoje = atividadesHoje.filter(i => i.status === 'concluido').length;
  const emAndamentoHoje = atividadesHoje.filter(i => i.status === 'em_andamento').length;
  const pendentesHoje = atividadesHoje.filter(i => i.status === 'pendente').length;

  const header = container.querySelector('h2');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  if (totalHoje === 0) {
    container.innerHTML += `<p class="mensagem-vazia">Nenhuma atividade agendada para o dia de hoje.</p>`;
    return;
  }

  const divResumo = document.createElement('div');
  divResumo.className = 'cards-resumo-container';
  divResumo.innerHTML = `
    <article class="card-resumo-item">
      <h4>Total de Hoje</h4>
      <p><strong>${totalHoje}</strong></p>
    </article>
    <article class="card-resumo-item">
      <h4>Concluídas</h4>
      <p><strong>${concluidasHoje}</strong></p>
    </article>
    <article class="card-resumo-item">
      <h4>Em Andamento</h4>
      <p><strong>${emAndamentoHoje}</strong></p>
    </article>
    <article class="card-resumo-item">
      <h4>Pendentes</h4>
      <p><strong>${pendentesHoje}</strong></p>
    </article>
  `;

  container.appendChild(divResumo);
}

// --------------------------------------------------------------------------
// 2. SEÇÃO CRONOGRAMA DIÁRIO
// --------------------------------------------------------------------------
function renderizarCronograma(container, lista) {
  const header = container.querySelector('h2');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  if (lista.length === 0) {
    container.innerHTML += `<p class="mensagem-vazia">Nenhuma atividade cadastrada no momento.</p>`;
    return;
  }

  lista.forEach(item => {
    const card = criarCardAtividade(item);
    container.appendChild(card);
  });
}

function criarCardAtividade(item) {
  const article = document.createElement('article');
  article.dataset.id = item.id;

  let botoesAcao = '';
  if (item.status === 'pendente') {
    botoesAcao += `<button type="button" class="btn-iniciar" onclick="acaoMudarStatus('${item.id}', 'em_andamento')">Iniciar</button>`;
  }
  if (item.status === 'em_andamento') {
    botoesAcao += `<button type="button" class="btn-concluir" onclick="acaoMudarStatus('${item.id}', 'concluido')">Concluir</button>`;
  }
  
  botoesAcao += `<a href="atividade.html?id=${item.id}" class="btn-editar button-like">Editar</a>`;
  botoesAcao += `<button type="button" class="btn-excluir" onclick="acaoExcluir('${item.id}')">Excluir</button>`;

  article.innerHTML = `
    <header>
      <h3>${escapeHtml(item.titulo)}</h3>
      <p>Data: ${formatarDataBR(item.data)} | Horário: ${item.horaInicio} às ${item.horaFim}</p>
    </header>
    <p><strong>Categoria:</strong> <mark>${escapeHtml(item.categoriaRotulo || item.categoria)}</mark></p>
    <p><strong>Status:</strong> <span class="badge-status status-${item.status}">${escapeHtml(item.statusRotulo || item.status)}</span></p>
    <p>${escapeHtml(item.descricao)}</p>
    <footer>
      ${botoesAcao}
    </footer>
  `;

  return article;
}

// --------------------------------------------------------------------------
// 3. SEÇÃO PRÓXIMOS LEMBRETES
// --------------------------------------------------------------------------
function renderizarLembretes(container, lista) {
  const lembretes = lista.filter(item => item.ativarLembrete === true || item.ativarLembrete === 'true');

  const header = container.querySelector('h2');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  if (lembretes.length === 0) {
    container.innerHTML += `<p class="mensagem-vazia">Nenhum lembrete configurado.</p>`;
    return;
  }

  lembretes.forEach(item => {
    const article = document.createElement('article');
    article.innerHTML = `
      <header>
        <h3>${escapeHtml(item.titulo)}</h3>
        <p>Data: ${formatarDataBR(item.data)} | às ${item.horaInicio}</p>
      </header>
      <p><strong>Antecedência:</strong> ${item.antecedencia || 15} minutos antes</p>
      <p><strong>Canal:</strong> ${escapeHtml(item.canalAlerta || 'Navegador')}</p>
    `;
    container.appendChild(article);
  });
}

// --------------------------------------------------------------------------
// AÇÕES GLOBAIS DA API (EXPOSTAS NO WINDOW PARA O EVENTO ONCLICK)
// --------------------------------------------------------------------------
window.acaoMudarStatus = async function(id, novoStatus) {
  const itemOriginal = listaGlobalAtividades.find(i => String(i.id) === String(id));
  if (!itemOriginal) return;

  const mapRotulos = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído'
  };

  const itemAtualizado = {
    ...itemOriginal,
    status: novoStatus,
    statusRotulo: mapRotulos[novoStatus] || novoStatus
  };

  try {
    await updateAtividadeAPI(id, itemAtualizado);
    await carregarDashboard();
  } catch (erro) {
    alert('Erro ao alterar status da atividade.');
    console.error(erro);
  }
};

window.acaoExcluir = async function(id) {
  if (!confirm('Deseja realmente excluir esta atividade?')) return;

  try {
    await deleteAtividadeAPI(id);
    await carregarDashboard();
  } catch (erro) {
    alert('Erro ao excluir atividade.');
    console.error(erro);
  }
};

// --------------------------------------------------------------------------
// FUNÇÕES UTILITÁRIAS
// --------------------------------------------------------------------------
function getHojeDataStr() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(dataStr) {
  if (!dataStr) return '';
  if (dataStr.includes('-')) {
    const [a, m, d] = dataStr.split('-');
    return `${d}/${m}/${a}`;
  }
  return dataStr;
}

function exibirMensagemContainer(container, mensagem, tipo) {
  const header = container.querySelector('h2');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  const banner = document.createElement('div');
  banner.className = `mensagem-banner ${tipo === 'erro' ? 'mensagem-erro' : ''}`;
  banner.style.padding = '1rem';
  banner.style.margin = '1rem 0';
  banner.innerHTML = `<p>${mensagem}</p>`;
  container.appendChild(banner);
}

function escapeHtml(texto) {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}