import { listarAtividades, listarCategorias } from './api.js';

const CATEGORIAS_PADRAO = [
  { id: 1, slug: 'estudos', nome: 'Estudos', cor: '#2563eb' },
  { id: 2, slug: 'trabalho', nome: 'Trabalho', cor: '#7c3aed' },
  { id: 3, slug: 'saude', nome: 'Saúde', cor: '#16a34a' },
  { id: 4, slug: 'lazer', nome: 'Lazer', cor: '#ea580c' }
];

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function calcularDuracaoMinutos(horaInicio, horaFim) {
  if (!horaInicio || !horaFim) return 0;

  const [hIni, mIni] = horaInicio.split(':').map(Number);
  const [hFim, mFim] = horaFim.split(':').map(Number);

  if ([hIni, mIni, hFim, mFim].some(Number.isNaN)) return 0;

  const inicio = hIni * 60 + mIni;
  const fim = hFim * 60 + mFim;
  return fim > inicio ? fim - inicio : 0;
}

function formatarHoras(minutosTotais) {
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;

  if (minutosTotais === 0) return '0h';
  if (minutos === 0) return `${horas}h`;
  if (horas === 0) return `${minutos}min`;
  return `${horas}h ${minutos}min`;
}

function parseDataLocal(dataIso) {
  if (!dataIso) return null;
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  if ([ano, mes, dia].some(Number.isNaN)) return null;
  return new Date(ano, mes - 1, dia);
}

function filtrarPorPeriodo(atividades, periodo) {
  if (!periodo || periodo === 'todos') return atividades;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return atividades.filter((item) => {
    const dataItem = parseDataLocal(item.data);
    if (!dataItem) return false;

    if (periodo === 'dia') {
      return dataItem.getTime() === hoje.getTime();
    }

    if (periodo === 'semana') {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6); // Sábado
      return dataItem >= inicioSemana && dataItem <= fimSemana;
    }

    if (periodo === 'mes') {
      return (
        dataItem.getMonth() === hoje.getMonth() &&
        dataItem.getFullYear() === hoje.getFullYear()
      );
    }

    if (periodo === 'ano') {
      return dataItem.getFullYear() === hoje.getFullYear();
    }

    return true;
  });
}

function renderizarCardProgresso(atividades) {
  const cardProgresso = document.getElementById('card-progresso');
  if (!cardProgresso) return;

  const total = atividades.length;
  const concluidas = atividades.filter((a) => a.status === 'concluido').length;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;
  const minutosTotais = atividades.reduce(
    (soma, a) => soma + calcularDuracaoMinutos(a.horaInicio, a.horaFim),
    0
  );

  cardProgresso.innerHTML = `
    <h2>Progresso de Execução</h2>
    <p>
      <strong>${concluidas}</strong> de <strong>${total}</strong> atividade(s) concluída(s)
      (<strong>${percentual}%</strong>) • Tempo total planejado: <strong>${formatarHoras(minutosTotais)}</strong>
    </p>
    <progress value="${percentual}" max="100" style="width: 100%; height: 18px;">${percentual}%</progress>
  `;
}

function renderizarTabelaCategorias(atividades, categorias) {
  const secao = document.querySelector('section[aria-labelledby="titulo-relatorio-categorias"]');
  if (!secao) return;

  const tbody = secao.querySelector('tbody');
  const tfoot = secao.querySelector('tfoot');
  if (!tbody) return;

  const mapa = new Map();
  categorias.forEach((cat) => {
    mapa.set(cat.slug, {
      nome: cat.nome,
      cor: cat.cor || '#2563eb',
      minutos: 0
    });
  });

  let minutosTotaisGeral = 0;

  atividades.forEach((atividade) => {
    const minutos = calcularDuracaoMinutos(atividade.horaInicio, atividade.horaFim);
    minutosTotaisGeral += minutos;

    const slug = atividade.categoria || 'outros';
    if (!mapa.has(slug)) {
      mapa.set(slug, {
        nome: atividade.categoriaRotulo || slug,
        cor: '#64748b',
        minutos: 0
      });
    }
    mapa.get(slug).minutos += minutos;
  });

  const linhas = Array.from(mapa.values());

  tbody.innerHTML = linhas
    .map((item) => {
      const percentual =
        minutosTotaisGeral > 0 ? Math.round((item.minutos / minutosTotaisGeral) * 100) : 0;

      return `
        <tr>
          <td>${escaparHtml(item.nome)}</td>
          <td>${formatarHoras(item.minutos)}</td>
          <td>${percentual}%</td>
          <td>
            <div style="background: #e2e8f0; border-radius: 999px; height: 10px; width: 100%; overflow: hidden;">
              <div style="width: ${percentual}%; background: ${escaparHtml(item.cor)}; height: 100%;"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <th scope="row">Total Geral</th>
        <td><strong>${formatarHoras(minutosTotaisGeral)}</strong></td>
        <td><strong>${minutosTotaisGeral > 0 ? '100%' : '0%'}</strong></td>
        <td>-</td>
      </tr>
    `;
  }
}

function renderizarTabelaStatus(atividades) {
  const secao = document.querySelector('section[aria-labelledby="titulo-status-resumo"]');
  if (!secao) return;

  const tbody = secao.querySelector('tbody');
  if (!tbody) return;

  const total = atividades.length;
  const grupos = [
    { chave: 'pendente', rotulo: 'Pendente' },
    { chave: 'em_andamento', rotulo: 'Em andamento' },
    { chave: 'concluido', rotulo: 'Concluído' }
  ];

  tbody.innerHTML = grupos
    .map((grupo) => {
      const qtd = atividades.filter((a) => a.status === grupo.chave).length;
      const proporcao = total > 0 ? Math.round((qtd / total) * 100) : 0;

      return `
        <tr>
          <td>${grupo.rotulo}</td>
          <td>${qtd}</td>
          <td>${proporcao}%</td>
        </tr>
      `;
    })
    .join('');
}

export async function atualizarRelatorios() {
  try {
    const [todasAtividades, categorias] = await Promise.all([
      listarAtividades(),
      listarCategorias().catch(() => CATEGORIAS_PADRAO)
    ]);

    const selectPeriodo = document.getElementById('filtro-periodo');
    const periodoSelecionado = selectPeriodo ? selectPeriodo.value : 'semana';

    const atividadesFiltradas = filtrarPorPeriodo(todasAtividades, periodoSelecionado);

    renderizarCardProgresso(atividadesFiltradas);
    renderizarTabelaCategorias(atividadesFiltradas, categorias);
    renderizarTabelaStatus(atividadesFiltradas);
  } catch (erro) {
    console.error('Erro ao atualizar relatórios:', erro);
    const cardProgresso = document.getElementById('card-progresso');
    if (cardProgresso) {
      cardProgresso.innerHTML = `<p>Não foi possível carregar os relatórios: ${escaparHtml(erro.message)}</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await atualizarRelatorios();

  const selectPeriodo = document.getElementById('filtro-periodo');
  if (selectPeriodo) {
    selectPeriodo.addEventListener('change', atualizarRelatorios);
  }
});