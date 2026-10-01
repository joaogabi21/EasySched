/**
 * principal.js - Lógica do Dashboard e Cronograma Diário (principal.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const estadoFiltros = {
    busca: '',
    categoria: 'todas',
    status: 'todos'
  };

  const sectionResumo = document.querySelector('section[aria-labelledby="titulo-resumo"]');
  const sectionCronograma = document.querySelector('section[aria-labelledby="titulo-cronograma"]');
  const sectionLembretes = document.querySelector('section[aria-labelledby="titulo-lembretes"]');

  if (!sectionCronograma) return;

  injetarBarraFiltros(sectionCronograma, estadoFiltros, () => renderizarTudo());

  function renderizarTudo() {
    const lista = getAtividades();
    renderizarResumo(sectionResumo, lista);
    renderizarCronograma(sectionCronograma, lista, estadoFiltros);
    renderizarLembretes(sectionLembretes, lista);
  }

  renderizarTudo();
});

/**
 * Retorna a data atual no formato 'YYYY-MM-DD' (fuso local).
 */
function getHojeDataStr() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Retorna a data de amanhã no formato 'YYYY-MM-DD' (fuso local).
 */
function getAmanhaDataStr() {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const ano = amanha.getFullYear();
  const mes = String(amanha.getMonth() + 1).padStart(2, '0');
  const dia = String(amanha.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Injeta a barra de pesquisa e filtros na interface.
 */
function injetarBarraFiltros(sectionContainer, estadoFiltros, callbackRender) {
  const containerFiltros = document.createElement('div');
  containerFiltros.className = 'painel-filtros';
  containerFiltros.innerHTML = `
    <div class="grupo-filtro">
      <label for="filtro-busca">Pesquisar:</label>
      <input type="text" id="filtro-busca" placeholder="Buscar por título ou descrição...">
    </div>
    <div class="grupo-filtro">
      <label for="filtro-categoria">Categoria:</label>
      <select id="filtro-categoria">
        <option value="todas">Todas as Categorias</option>
        <option value="estudos">Estudos</option>
        <option value="trabalho">Trabalho / Projetos</option>
        <option value="saude">Saúde / Esportes</option>
        <option value="lazer">Lazer</option>
      </select>
    </div>
    <div class="grupo-filtro">
      <label for="filtro-status">Status:</label>
      <select id="filtro-status">
        <option value="todos">Todos os Status</option>
        <option value="pendente">Pendente</option>
        <option value="em_andamento">Em Andamento</option>
        <option value="concluido">Concluído</option>
      </select>
    </div>
  `;

  const titulo = sectionContainer.querySelector('h2');
  titulo.insertAdjacentElement('afterend', containerFiltros);

  const inputBusca = containerFiltros.querySelector('#filtro-busca');
  const selectCategoria = containerFiltros.querySelector('#filtro-categoria');
  const selectStatus = containerFiltros.querySelector('#filtro-status');

  inputBusca.addEventListener('input', (e) => {
    estadoFiltros.busca = e.target.value.toLowerCase().trim();
    callbackRender();
  });

  selectCategoria.addEventListener('change', (e) => {
    estadoFiltros.categoria = e.target.value;
    callbackRender();
  });

  selectStatus.addEventListener('change', (e) => {
    estadoFiltros.status = e.target.value;
    callbackRender();
  });
}

/**
 * Atualiza os contadores estritamente para as atividades do dia atual.
 */
function renderizarResumo(sectionResumo, lista) {
  if (!sectionResumo) return;

  const hojeDataStr = getHojeDataStr();
  const listaHoje = lista.filter(item => item.data === hojeDataStr);

  const total = listaHoje.length;
  const concluidas = listaHoje.filter(item => item.status === 'concluido').length;
  const emAndamento = listaHoje.filter(item => item.status === 'em_andamento').length;
  const pendentes = listaHoje.filter(item => item.status === 'pendente').length;

  const ul = sectionResumo.querySelector('ul');
  if (ul) {
    ul.innerHTML = `
      <li><strong>Total de Atividades Hoje:</strong> <span>${total}</span></li>
      <li><strong>Concluídas:</strong> <span>${concluidas}</span></li>
      <li><strong>Em Andamento:</strong> <span>${emAndamento}</span></li>
      <li><strong>Pendentes:</strong> <span>${pendentes}</span></li>
    `;
  }
}

/**
 * Renderiza dinamicamente APENAS as atividades de Hoje e de Amanhã.
 */
function renderizarCronograma(sectionCronograma, listaCompleta, filtros) {
  const cardsAntigos = sectionCronograma.querySelectorAll('article');
  cardsAntigos.forEach(card => card.remove());

  const avisosAntigos = sectionCronograma.querySelectorAll('.aviso-vazio, .subtitulo-secao');
  avisosAntigos.forEach(el => el.remove());

  const hojeDataStr = getHojeDataStr();
  const amanhaDataStr = getAmanhaDataStr();

  // 1. Aplicar Filtros de Busca, Categoria e Status
  const listaFiltrada = listaCompleta.filter(item => {
    const atendeBusca = !filtros.busca || 
      item.titulo.toLowerCase().includes(filtros.busca) || 
      item.descricao.toLowerCase().includes(filtros.busca);

    const atendeCategoria = filtros.categoria === 'todas' || item.categoria === filtros.categoria;
    const atendeStatus = filtros.status === 'todos' || item.status === filtros.status;

    return atendeBusca && atendeCategoria && atendeStatus;
  });

  // 2. Filtro Rigoroso: Apenas Hoje e Amanhã
  const atividadesHoje = listaFiltrada.filter(item => item.data === hojeDataStr);
  const atividadesAmanha = listaFiltrada.filter(item => item.data === amanhaDataStr);

  const ordenarPorHora = (a, b) => a.horaInicio.localeCompare(b.horaInicio);
  atividadesHoje.sort(ordenarPorHora);
  atividadesAmanha.sort(ordenarPorHora);

  // Sem nenhuma atividade para hoje nem amanhã
  if (atividadesHoje.length === 0 && atividadesAmanha.length === 0) {
    const aviso = document.createElement('div');
    aviso.className = 'aviso-vazio';
    aviso.innerHTML = '<p>Nenhuma atividade encontrada para hoje ou amanhã.</p>';
    sectionCronograma.appendChild(aviso);
    return;
  }

  // 3. Renderizar Atividades de HOJE
  if (atividadesHoje.length === 0) {
    const avisoHoje = document.createElement('div');
    avisoHoje.className = 'aviso-vazio';
    avisoHoje.innerHTML = '<p>Nenhuma atividade agendada para hoje.</p>';
    sectionCronograma.appendChild(avisoHoje);
  } else {
    atividadesHoje.forEach(item => {
      sectionCronograma.appendChild(criarCardAtividade(item));
    });
  }

  // 4. Renderizar Seção de AMANHÃ (se existir alguma atividade cadastrada para amanhã)
  if (atividadesAmanha.length > 0) {
    const tituloAmanha = document.createElement('h3');
    tituloAmanha.className = 'subtitulo-secao';
    tituloAmanha.style.cssText = 'grid-column: 1 / -1; margin-top: 2rem; color: var(--dark-slate); font-size: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;';
    tituloAmanha.textContent = '📅 Para Amanhã';
    sectionCronograma.appendChild(tituloAmanha);

    atividadesAmanha.forEach(item => {
      sectionCronograma.appendChild(criarCardAtividade(item));
    });
  }
}

/**
 * Cria a estrutura HTML do Card da Atividade.
 */
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
  botoesAcao += `<button type="button" class="btn-excluir" onclick="acaoExcluir('${item.id}')">Excluir</button>`;

  const dataFormatada = new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR');

  article.innerHTML = `
    <header>
      <h3>${escapeHtml(item.titulo)}</h3>
      <p>Data: ${dataFormatada} | Horário: ${item.horaInicio} às ${item.horaFim}</p>
    </header>
    <p><strong>Categoria:</strong> <mark>${escapeHtml(item.categoriaRotulo)}</mark></p>
    <p><strong>Status:</strong> <span class="badge-status status-${item.status}">${escapeHtml(item.statusRotulo)}</span></p>
    <p>${escapeHtml(item.descricao)}</p>
    <footer>
      ${botoesAcao}
    </footer>
  `;

  return article;
}

/**
 * Renderiza Lembretes ativos para Hoje e Amanhã.
 */
function renderizarLembretes(sectionLembretes, lista) {
  if (!sectionLembretes) return;

  const cardsAntigos = sectionLembretes.querySelectorAll('article');
  cardsAntigos.forEach(card => card.remove());

  const hojeDataStr = getHojeDataStr();
  const amanhaDataStr = getAmanhaDataStr();

  const lembretesAtivos = lista.filter(item => 
    item.ativarLembrete && 
    item.status !== 'concluido' && 
    (item.data === hojeDataStr || item.data === amanhaDataStr)
  );

  if (lembretesAtivos.length === 0) {
    const cardVazio = document.createElement('article');
    cardVazio.innerHTML = '<p><small>Nenhum lembrete pendente para hoje ou amanhã.</small></p>';
    sectionLembretes.appendChild(cardVazio);
    return;
  }

  lembretesAtivos.forEach(item => {
    const article = document.createElement('article');
    const dataFormatada = new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR');
    article.innerHTML = `
      <h3>Alerta: ${escapeHtml(item.titulo)}</h3>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Horário do Evento:</strong> ${item.horaInicio}</p>
      <p><strong>Disparo:</strong> ${item.antecedencia} minutos antes</p>
    `;
    sectionLembretes.appendChild(article);
  });
}

window.acaoMudarStatus = function(id, novoStatus) {
  updateStatusAtividade(id, novoStatus);
  window.location.reload();
};

window.acaoExcluir = function(id) {
  if (confirm('Tem certeza de que deseja excluir esta atividade?')) {
    deleteAtividade(id);
    window.location.reload();
  }
};

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}