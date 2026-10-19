/**
 * atividade.js - Lógica de Cadastro e Validação de Formulário (atividade.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const dataInput = document.getElementById('data');
  const statusSelect = document.getElementById('status');
  const ativarLembreteCheckbox = document.getElementById('ativar-lembrete');

  const hojeDataStr = getHojeDataStr();

  /**
   * Ajusta dinamicamente as restrições de data e lembrete de acordo com o status selecionado.
   */
  function atualizarRegrasPorStatus() {
    if (!statusSelect) return;

    if (statusSelect.value === 'concluido') {
      // Tarefas concluídas: permite hoje ou datas passadas (proíbe futuro)
      if (dataInput) {
        dataInput.removeAttribute('min');
        dataInput.max = hojeDataStr;
      }
      if (ativarLembreteCheckbox) {
        ativarLembreteCheckbox.checked = false;
        ativarLembreteCheckbox.disabled = true;
      }
    } else {
      // Tarefas pendentes/em andamento: permite hoje ou datas futuras (proíbe passado)
      if (dataInput) {
        dataInput.min = hojeDataStr;
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

  // Container dinâmico de feedback
  const feedbackContainer = document.createElement('div');
  feedbackContainer.id = 'feedback-mensagem';
  feedbackContainer.setAttribute('aria-live', 'polite');
  form.parentNode.insertBefore(feedbackContainer, form);

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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    limparErros(form, feedbackContainer);

    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const horaInicioInput = document.getElementById('hora-inicio');
    const horaFimInput = document.getElementById('hora-fim');
    const categoriaSelect = document.getElementById('categoria');
    const antecedenciaSelect = document.getElementById('antecedencia');
    const canalAlertaSelect = document.getElementById('canal-alerta');

    const erros = [];

    // 1. Validação de Título
    if (!tituloInput.value.trim()) {
      erros.push({ campo: tituloInput, mensagem: 'O título da atividade é obrigatório.' });
    }

    // 2. Validação Condicional de Data
    if (!dataInput.value) {
      erros.push({ campo: dataInput, mensagem: 'Informe a data do compromisso.' });
    } else {
      if (statusSelect.value === 'concluido' && dataInput.value > hojeDataStr) {
        erros.push({
          campo: dataInput,
          mensagem: 'Atividades com status "Concluído" devem ter data de hoje ou anterior (não podem ser no futuro).'
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

    const novaAtividade = {
      id: Date.now().toString(),
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
      antecedencia: antecedenciaSelect.value,
      canalAlerta: canalAlertaSelect.value
    };

    addAtividade(novaAtividade);

    exibirSucesso('Atividade cadastrada com sucesso! Redirecionando para o cronograma...', feedbackContainer);
    form.reset();

    atualizarRegrasPorStatus();

    setTimeout(() => {
      window.location.href = 'principal.html';
    }, 1500);
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
  container.innerHTML = '';
  container.className = '';
  const campos = form.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.style.borderColor = '';
  });
}

function exibirErros(erros, container) {
  container.className = 'mensagem-banner mensagem-erro';
  
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
  container.className = 'mensagem-banner mensagem-sucesso';
  container.innerHTML = `<strong>Sucesso!</strong> <p>${mensagem}</p>`;
}