/**
 * relatorio.js - Lógica de Cálculos e Filtros Temporais de Relatórios (relatorio.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const selectPeriodo = document.getElementById('filtro-periodo');
  
  // Função que atualiza todos os relatórios com base no período selecionado
  function atualizarRelatorios() {
    const listaCompleta = getAtividades();
    const periodoSelecionado = selectPeriodo ? selectPeriodo.value : 'semana';
    
    // Filtrar a lista pelo intervalo temporal
    const listaFiltrada = filtrarPorPeriodo(listaCompleta, periodoSelecionado);

    renderizarProgressoGeral(listaFiltrada, periodoSelecionado);
    renderizarRelatorioCategorias(listaFiltrada);
    renderizarRelatorioStatus(listaFiltrada);
  }

  // Event listener para mudança de filtro
  if (selectPeriodo) {
    selectPeriodo.addEventListener('change', atualizarRelatorios);
  }

  // Renderização inicial
  atualizarRelatorios();
});

/**
 * Filtra o array de atividades conforme o período selecionado.
 */
function filtrarPorPeriodo(lista, periodo) {
  const agora = new Date();
  
  return lista.filter(item => {
    if (!item.data) return false;
    
    const [ano, mes, dia] = item.data.split('-').map(Number);
    const dataItem = new Date(ano, mes - 1, dia);

    if (periodo === 'dia') {
      return dataItem.toDateString() === agora.toDateString();
    }

    if (periodo === 'semana') {
      const diaSemana = agora.getDay();
      const diffSegunda = agora.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
      
      const inicioSemana = new Date(agora.getFullYear(), agora.getMonth(), diffSegunda, 0, 0, 0);
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);
      fimSemana.setHours(23, 59, 59, 999);

      return dataItem >= inicioSemana && dataItem <= fimSemana;
    }

    if (periodo === 'mes') {
      return dataItem.getFullYear() === agora.getFullYear() && dataItem.getMonth() === agora.getMonth();
    }

    if (periodo === 'ano') {
      return dataItem.getFullYear() === agora.getFullYear();
    }

    return true;
  });
}

/**
 * Renderiza o progresso de conclusão do período ajustado para o container #card-progresso.
 */
function renderizarProgressoGeral(lista, periodo) {
  const cardProgresso = document.getElementById('card-progresso');
  if (!cardProgresso) return;

  const total = lista.length;
  const concluidas = lista.filter(item => item.status === 'concluido').length;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const titulosPeriodo = {
    'dia': 'no Dia de Hoje',
    'semana': 'na Semana',
    'mes': 'no Mês Atual',
    'ano': 'no Ano Atual',
    'todos': 'em Todo o Histórico'
  };

  if (total === 0) {
    cardProgresso.innerHTML = `
      <h3>Conclusão Geral de Compromissos</h3>
      <p>Nenhuma atividade registrada para o período selecionado (${titulosPeriodo[periodo] || 'selecionado'}).</p>
    `;
    return;
  }

  cardProgresso.innerHTML = `
    <h3>Conclusão Geral de Compromissos (${titulosPeriodo[periodo] || 'Período'})</h3>
    <p>Taxa de atividades concluídas em relação ao total planejado:</p>
    <p>
      <strong>Progresso: ${percentual}%</strong><br>
      <progress value="${percentual}" max="100">${percentual}%</progress>
    </p>
    <p><small>${concluidas} de ${total} atividades foram concluídas com sucesso.</small></p>
  `;
}

/**
 * Calcula a duração em horas decimais entre dois horários "HH:MM".
 */
function calcularHoras(horaInicio, horaFim) {
  if (!horaInicio || !horaFim) return 0;
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFim.split(':').map(Number);
  const diffMinutos = (h2 * 60 + m2) - (h1 * 60 + m1);
  return diffMinutos > 0 ? diffMinutos / 60 : 0;
}

/**
 * Formata horas decimais em string legível (ex: "9h 30min").
 */
function formatarHoras(horasDecimais) {
  const horas = Math.floor(horasDecimais);
  const minutos = Math.round((horasDecimais - horas) * 60);
  if (minutos === 0) return `${horas}h 00min`;
  return `${horas}h ${minutos < 10 ? '0' : ''}${minutos}min`;
}

/**
 * Renderiza a tabela de distribuição de tempo por categoria.
 */
function renderizarRelatorioCategorias(lista) {
  const sectionCategoria = document.querySelector('section[aria-labelledby="titulo-relatorio-categorias"]');
  if (!sectionCategoria) return;

  const tbody = sectionCategoria.querySelector('tbody');
  const tfoot = sectionCategoria.querySelector('tfoot');
  if (!tbody) return;

  const acumulador = {
    'trabalho': { rotulo: 'Trabalho / Projetos', horas: 0 },
    'estudos': { rotulo: 'Estudos', horas: 0 },
    'saude': { rotulo: 'Saúde / Esportes', horas: 0 },
    'lazer': { rotulo: 'Lazer', horas: 0 }
  };

  lista.forEach(item => {
    const duracao = calcularHoras(item.horaInicio, item.horaFim);
    if (acumulador[item.categoria]) {
      acumulador[item.categoria].horas += duracao;
    }
  });

  const totalHorasGeral = Object.values(acumulador).reduce((acc, cat) => acc + cat.horas, 0);

  let htmlBody = '';
  Object.keys(acumulador).forEach(chave => {
    const cat = acumulador[chave];
    const proporcao = totalHorasGeral > 0 ? (cat.horas / totalHorasGeral) : 0;
    const percentualTexto = (proporcao * 100).toFixed(1) + '%';

    htmlBody += `
      <tr>
        <th scope="row">${cat.rotulo}</th>
        <td>${formatarHoras(cat.horas)}</td>
        <td>${percentualTexto}</td>
        <td>
          <meter value="${proporcao.toFixed(3)}" min="0" max="1">${percentualTexto}</meter>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = htmlBody;

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <th scope="row">Total Geral</th>
        <td><strong>${formatarHoras(totalHorasGeral)}</strong></td>
        <td><strong>100%</strong></td>
        <td></td>
      </tr>
    `;
  }
}

/**
 * Renderiza a tabela de resumo por status.
 */
function renderizarRelatorioStatus(lista) {
  const sectionStatus = document.querySelector('section[aria-labelledby="titulo-status-resumo"]');
  if (!sectionStatus) return;

  const tbody = sectionStatus.querySelector('tbody');
  if (!tbody) return;

  const total = lista.length;
  const concluidos = lista.filter(i => i.status === 'concluido').length;
  const emAndamento = lista.filter(i => i.status === 'em_andamento').length;
  const pendentes = lista.filter(i => i.status === 'pendente').length;

  const pConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  const pAndamento = total > 0 ? Math.round((emAndamento / total) * 100) : 0;
  const pPendente = total > 0 ? Math.round((pendentes / total) * 100) : 0;

  tbody.innerHTML = `
    <tr>
      <th scope="row">Concluído</th>
      <td>${concluidos}</td>
      <td>${pConcluido}%</td>
    </tr>
    <tr>
      <th scope="row">Em Andamento</th>
      <td>${emAndamento}</td>
      <td>${pAndamento}%</td>
    </tr>
    <tr>
      <th scope="row">Pendente</th>
      <td>${pendentes}</td>
      <td>${pPendente}%</td>
    </tr>
  `;
}