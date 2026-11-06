/**
 * atividade.js - Lógica de Cadastro e Edição Assíncrona de Atividades
 */

import { createAtividadeAPI, updateAtividadeAPI, fetchAtividadeByIdAPI } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('form');
  if (!form) return;

  const dataInput = document.getElementById('data');
  const statusSelect = document.getElementById('status');
  const ativarLembreteCheckbox = document.getElementById('ativar-lembrete');
  const categoriaSelect = document.getElementById('categoria');
  const antecedenciaSelect = document.getElementById('antecedencia');
  const tituloPagina = document.getElementById('titulo-formulario');
  const btnSubmit = form.querySelector('button[type="submit"]');

  const hojeDataStr = getHojeDataStr();

  // Container dinâmico de feedback (Mensagens de Erro / Sucesso / Carregamento)
  const feedbackContainer = document.createElement('div');
  feedbackContainer.id = 'feedback-mensagem';
  feedbackContainer.setAttribute('aria-live', 'polite');
  form.parentNode.insertBefore(feedbackContainer, form);

  // 1. Detectar Modo de Edição via parâmetro na URL (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const idEdicao = urlParams.get('id');
  let atividadeEdicao = null;

  if (idEdicao) {
    try {
      exibirLoading('Carregando dados da atividade...', feedbackContainer);
      atividadeEdicao = await fetchAtividadeByIdAPI(idEdicao);
      limparFeedback(feedbackContainer);

      if (atividadeEdicao) {
        if (tituloPagina) tituloPagina.textContent = 'Editar Atividade';
        if (btnSubmit) btnSubmit.textContent = 'Salvar Alterações';

        // Preenche todos os campos com os dados existentes
        document.getElementById('titulo').value = atividadeEdicao.titulo || '';
        document.getElementById('descricao').value = atividadeEdicao.descricao === 'Sem descrição cadastrada.' ? '' : (atividadeEdicao.descricao || '');
        document.getElementById('data').value = atividadeEdicao.data || '';
        document.getElementById('hora-inicio').value = atividadeEdicao.horaInicio || '';
        document.getElementById('hora-fim').value = atividadeEdicao.horaFim || '';
        if (categoriaSelect) categoriaSelect.value = atividadeEdicao.categoria || '';
        if (statusSelect) statusSelect.value = atividadeEdicao.status || 'pendente';
        if (ativarLembreteCheckbox) ativarLembreteCheckbox.checked = !!atividadeEdicao.ativarLembrete;
        if (antecedenciaSelect) antecedenciaSelect.value = atividadeEdicao.antecedencia || '15';
        
        const canalAlertaSelect = document.getElementById('canal-alerta');
        if (canalAlertaSelect) canalAlertaSelect.value = atividadeEdicao.canalAlerta || 'navegador';
      }
    } catch (erro) {
      limparFeedback(feedbackContainer);
      exibirErros([{ mensagem: 'Não foi possível carregar a atividade para edição. Verifique a conexão com o servidor.' }], feedbackContainer);
      console.error('Erro ao procurar atividade:', erro);
    }
  }

  /**
   * Automação de Antecedência por Categoria:
   * Estudos define antecedência para 30 minutos por padrão; outras categorias definem para 15 minutos.
   */
  if (categoriaSelect && antecedenciaSelect) {
    categoriaSelect.addEventListener('change', () => {
      if (categoriaSelect.value === 'estudos') {
        antecedenciaSelect.value = '30';
      } else {
        antecedenciaSelect.value = '15';
      }
    });
  }

  /**
   * Ajusta dinamicamente as restrições de data e lembrete de acordo com o status selecionado.
   */
  function atualizarRegrasPorStatus() {
    if (!statusSelect) return;

    if (statusSelect.value === 'concluido') {
      if (dataInput) {
        dataInput.removeAttribute('min');
        if (!idEdicao) dataInput.max = hojeDataStr;
      }
      if (ativarLembreteCheckbox) {
        ativarLembreteCheckbox.checked = false;
        ativarLembreteCheckbox.disabled = true;
      }
    } else {
      if (dataInput) {
        if (!idEdicao) dataInput.min = hojeDataStr;
        dataInput.removeAttribute('max');
      }
      if (ativarLembreteCheckbox) {
        ativarLembreteCheckbox.disabled = false;
      }
    }
  }

  // Aplica as regras na carga inicial e ao alterar o select de status
  atualizarRegrasPorStatus();
  if (statusSelect) {
    statusSelect.addEventListener('change', atualizarRegrasPorStatus);
  }

  const mapCategorias = {
    'estudos': 'Estudos',
    'trabalho': 'Trabalho / Projetos',
    'saude': 'Saúde / Esportes',
    'lazer': 'Lazer'
  };

  const mapStatus = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído'
  };

  // Submissão do formulário
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    limparErros(form, feedbackContainer);

    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const horaInicioInput = document.getElementById('hora-inicio');
    const horaFimInput = document.getElementById('hora-fim');
    const canalAlertaSelect = document.getElementById('canal-alerta');

    const erros = [];

    // 1. Validação de Título
    if (!tituloInput.value.trim()) {
      erros.push({ campo: tituloInput, mensagem: 'O título da atividade é obrigatório.' });
    }

    // 2. Validação Condicional de Data
    if (!dataInput.value) {
      erros.push({ campo: dataInput, mensagem: 'Informe a data do compromisso.' });
    } else if (!idEdicao) {
      if (statusSelect.value === 'concluido' && dataInput.value > hojeDataStr) {
        erros.push({
          campo: dataInput,
          mensagem: 'Atividades com status "Concluído" devem ter data de hoje ou anterior.'
        });
      } else if (statusSelect.value !== 'concluido' && dataInput.value < hojeDataStr) {
        erros.push({
          campo: dataInput,
          mensagem: 'Atividades pendentes ou em andamento não podem ter data anterior a hoje.'
        });
      }
    }

    // 3. Validação de Horários
    if (!horaInicioInput.value) {
      erros.push({ campo: horaInicioInput, mensagem: 'Informe o horário de início.' });
    }

    if (!horaFimInput.value) {
      erros.push({ campo: horaFimInput, mensagem: 'Informe o horário de término.' });
    }

    if (horaInicioInput.value && horaFimInput.value) {
      if (horaFimInput.value <= horaInicioInput.value) {
        erros.push({
          campo: horaFimInput,
          mensagem: 'O horário de término deve ser posterior ao horário de início.'
        });
      }
    }

    // 4. Validação de Categoria
    if (!categoriaSelect.value) {
      erros.push({ campo: categoriaSelect, mensagem: 'Selecione uma categoria válida.' });
    }

    if (erros.length > 0) {
      exibirErros(erros, feedbackContainer);
      return;
    }

    // Objeto com a estrutura de dados da atividade
    const atividadeSalvar = {
      id: idEdicao ? idEdicao : Date.now().toString(),
      titulo: tituloInput.value.trim(),
      descricao: descricaoInput.value.trim() || 'Sem descrição cadastrada.',
      data: dataInput.value,
      horaInicio: horaInicioInput.value,
      horaFim: horaFimInput.value,
      categoria: categoriaSelect.value,
      categoriaRotulo: mapCategorias[categoriaSelect.value] || categoriaSelect.value,
      status: statusSelect.value,
      statusRotulo: mapStatus[statusSelect.value] || statusSelect.value,
      ativarLembrete: ativarLembreteCheckbox.checked,
      antecedencia: antecedenciaSelect ? antecedenciaSelect.value : '15',
      canalAlerta: canalAlertaSelect ? canalAlertaSelect.value : 'navegador'
    };

    // Submissão assíncrona com tratamento dos 3 estados (Carregamento, Sucesso e Erro)
    try {
      btnSubmit.disabled = true;
      exibirLoading(idEdicao ? 'Enviando alterações para o servidor...' : 'Cadastrando atividade no servidor...', feedbackContainer);

      if (idEdicao) {
        await updateAtividadeAPI(idEdicao, atividadeSalvar);
        exibirSucesso('Atividade atualizada com sucesso! Redirecionando...', feedbackContainer);
      } else {
        await createAtividadeAPI(atividadeSalvar);
        exibirSucesso('Atividade cadastrada com sucesso! Redirecionando...', feedbackContainer);
      }

      form.reset();
      atualizarRegrasPorStatus();

      setTimeout(() => {
        window.location.href = 'principal.html';
      }, 1500);

    } catch (erro) {
      btnSubmit.disabled = false;
      limparFeedback(feedbackContainer);
      exibirErros([{ mensagem: `Erro de Comunicação: ${erro.message || 'Falha ao conectar com o serviço.'}` }], feedbackContainer);
      console.error('Erro na submissão:', erro);
    }
  });

  form.addEventListener('input', (e) => {
    e.target.style.borderColor = '';
  });
});

function getHojeDataStr() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function limparErros(form, container) {
  limparFeedback(container);
  const campos = form.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.style.borderColor = '';
  });
}

function limparFeedback(container) {
  if (container) {
    container.innerHTML = '';
    container.className = '';
  }
}

function exibirLoading(mensagem, container) {
  if (!container) return;
  container.className = 'mensagem-banner';
  container.style.backgroundColor = '#e0f2fe';
  container.style.color = '#0369a1';
  container.style.border = '1px solid #bae6fd';
  container.innerHTML = `<strong>⏳ Aguarde:</strong> <p>${mensagem}</p>`;
}

function exibirErros(erros, container) {
  if (!container) return;
  container.className = 'mensagem-banner mensagem-erro';
  container.style.backgroundColor = '#fef2f2';
  container.style.color = '#991b1b';
  container.style.border = '1px solid #fecaca';
  
  let html = '<strong>Por favor, corrija os erros abaixo:</strong><ul>';
  erros.forEach(item => {
    html += `<li>${item.mensagem}</li>`;
    if (item.campo) {
      item.campo.style.borderColor = '#ef4444';
    }
  });
  html += '</ul>';

  container.innerHTML = html;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function exibirSucesso(mensagem, container) {
  if (!container) return;
  container.className = 'mensagem-banner mensagem-sucesso';
  container.style.backgroundColor = '#f0fdf4';
  container.style.color = '#166534';
  container.style.border = '1px solid #bbf7d0';
  container.innerHTML = `<strong>Sucesso!</strong> <p>${mensagem}</p>`;
}