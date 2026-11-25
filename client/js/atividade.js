import {
  listarCategorias,
  buscarAtividadePorId,
  criarAtividade,
  atualizarAtividade
} from './api.js';

const form = document.querySelector('form');
const campoTitulo = document.getElementById('titulo');
const campoDescricao = document.getElementById('descricao');
const campoData = document.getElementById('data');
const campoHoraInicio = document.getElementById('horaInicio') || document.getElementById('hora-inicio');
const campoHoraFim = document.getElementById('horaFim') || document.getElementById('hora-fim');
const campoCategoria = document.getElementById('categoria');
const campoStatus = document.getElementById('status');
const campoAtivarLembrete = document.getElementById('ativarLembrete') || document.getElementById('ativar-lembrete');
const campoAntecedencia = document.getElementById('antecedencia');
const campoCanalAlerta = document.getElementById('canalAlerta') || document.getElementById('canal-alerta');
const mensagemFeedback = document.getElementById('feedback-mensagem') || document.getElementById('mensagem-erro');

const params = new URLSearchParams(window.location.search);
const atividadeId = params.get('id');

function exibirMensagem(texto, tipo = 'erro') {
  if (!mensagemFeedback) {
    if (tipo === 'erro') alert(texto);
    return;
  }
  mensagemFeedback.textContent = texto;
  mensagemFeedback.className = `feedback ${tipo}`;
  mensagemFeedback.hidden = false;
}

async function carregarCategorias() {
  if (!campoCategoria) return;

  try {
    const categorias = await listarCategorias();
    campoCategoria.innerHTML = '<option value="">Selecione uma categoria...</option>';

    categorias.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat.slug;
      option.dataset.categoriaId = cat.id;
      option.textContent = cat.nome;
      campoCategoria.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar categorias da API:', erro);
    exibirMensagem('Não foi possível carregar as categorias do servidor.', 'erro');
  }
}

async function carregarDadosParaEdicao() {
  if (!atividadeId) return;

  try {
    const atividade = await buscarAtividadePorId(atividadeId);

    if (campoTitulo) campoTitulo.value = atividade.titulo || '';
    if (campoDescricao) campoDescricao.value = atividade.descricao || '';
    if (campoData) campoData.value = atividade.data || '';
    if (campoHoraInicio) campoHoraInicio.value = atividade.horaInicio || '';
    if (campoHoraFim) campoHoraFim.value = atividade.horaFim || '';
    if (campoCategoria) campoCategoria.value = atividade.categoria || '';
    if (campoStatus) campoStatus.value = atividade.status || 'pendente';
    if (campoAtivarLembrete) campoAtivarLembrete.checked = Boolean(atividade.ativarLembrete);
    if (campoAntecedencia) campoAntecedencia.value = atividade.antecedencia || '15';
    if (campoCanalAlerta) campoCanalAlerta.value = atividade.canalAlerta || 'navegador';
  } catch (erro) {
    exibirMensagem(`Erro ao carregar atividade: ${erro.message}`, 'erro');
  }
}

function alternarCamposLembrete() {
  if (!campoAtivarLembrete) return;
  const ativo = campoAtivarLembrete.checked;
  if (campoAntecedencia) campoAntecedencia.disabled = !ativo;
  if (campoCanalAlerta) campoCanalAlerta.disabled = !ativo;
}

if (campoAtivarLembrete) {
  campoAtivarLembrete.addEventListener('change', alternarCamposLembrete);
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const optionSelecionada = campoCategoria?.selectedOptions?.[0];
    const categoriaId = optionSelecionada?.dataset?.categoriaId
      ? Number(optionSelecionada.dataset.categoriaId)
      : undefined;

    const payload = {
      titulo: campoTitulo?.value.trim() || '',
      descricao: campoDescricao?.value.trim() || '',
      data: campoData?.value || '',
      horaInicio: campoHoraInicio?.value || '',
      horaFim: campoHoraFim?.value || '',
      categoria: campoCategoria?.value || '',
      categoriaId,
      status: campoStatus?.value || 'pendente',
      ativarLembrete: Boolean(campoAtivarLembrete?.checked),
      antecedencia: campoAntecedencia?.value || '15',
      canalAlerta: campoCanalAlerta?.value || 'navegador'
    };

    try {
      if (atividadeId) {
        await atualizarAtividade(atividadeId, payload);
      } else {
        await criarAtividade(payload);
      }
      window.location.href = 'principal.html';
    } catch (erro) {
      exibirMensagem(erro.message, 'erro');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarCategorias();
  await carregarDadosParaEdicao();
  alternarCamposLembrete();
});