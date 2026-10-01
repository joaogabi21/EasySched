/**
 * atividade.js - Lógica de Cadastro e Validação de Formulário (atividade.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const dataInput = document.getElementById('data');
  const statusSelect = document.getElementById('status');
  const ativarLembreteCheckbox = document.getElementById('ativar-lembrete');

  // Bloqueia datas passadas no calendário
  const hojeDataStr = getHojeDataStr();
  if (dataInput) {
    dataInput.min = hojeDataStr;
  }

  // REGRA DE USABILIDADE: Desativa o lembrete se a atividade for "Concluída"
  if (statusSelect && ativarLembreteCheckbox) {
    statusSelect.addEventListener('change', (e) => {
      if (e.target.value === 'concluido') {
        ativarLembreteCheckbox.checked = false;
        ativarLembreteCheckbox.disabled = true;
      } else {
        ativarLembreteCheckbox.disabled = false;
      }
    });
  }

  // Criar container dinâmico de feedback de erros e alertas
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

  // Escutar evento de submissão do formulário
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    limparErros(form, feedbackContainer);

    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const horaInicioInput = document.getElementById('hora-inicio');
    const horaFimInput = document.getElementById('hora-fim');
    const categoriaSelect = document.getElementById('categoria');
    const statusSelect = document.getElementById('status');
    const ativarLembreteCheckbox = document.getElementById('ativar-lembrete');
    const antecedenciaSelect = document.getElementById('antecedencia');
    const canalAlertaSelect = document.getElementById('canal-alerta');

    const erros = [];

    // 1. Validação de Título
    if (!tituloInput.value.trim()) {
      erros.push({ campo: tituloInput, mensagem: 'O título da atividade é obrigatório.' });
    }

    // 2. Validação de Data (Campos em branco ou datas anteriores a hoje)
    if (!dataInput.value) {
      erros.push({ campo: dataInput, mensagem: 'Informe a data do compromisso.' });
    } else if (dataInput.value < hojeDataStr) {
      erros.push({
        campo: dataInput,
        mensagem: 'A data da atividade não pode ser anterior à data de hoje.'
      });
    }

    // 3. Validação de Horários
    if (!horaInicioInput.value) {
      erros.push({ campo: horaInicioInput, mensagem: 'Informe o horário de início.' });
    }

    if (!horaFimInput.value) {
      erros.push({ campo: horaFimInput, mensagem: 'Informe o horário de término.' });
    }

    // Validação Lógica de Tempo: Hora Término > Hora Início
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

    // TRATAMENTO DE SITUAÇÕES INVÁLIDAS
    if (erros.length > 0) {
      exibirErros(erros, feedbackContainer);
      return;
    }

    // MONTAGEM DO OBJETO DE ATIVIDADE
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

    // Reitera o atributo 'min' após resetar o formulário
    dataInput.min = hojeDataStr;

    setTimeout(() => {
      window.location.href = 'principal.html';
    }, 1500);
  });

  form.addEventListener('input', (e) => {
    e.target.style.borderColor = '';
  });
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
 * Remove classes e mensagens de erro visuais.
 */
function limparErros(form, container) {
  container.innerHTML = '';
  container.className = '';
  const campos = form.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.style.borderColor = '';
  });
}

/**
 * Exibe a lista de erros e destaca os campos inválidos.
 */
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

/**
 * Exibe banner visual de sucesso.
 */
function exibirSucesso(mensagem, container) {
  container.className = 'mensagem-banner mensagem-sucesso';
  container.innerHTML = `<strong>Sucesso!</strong> <p>${mensagem}</p>`;

  // Exemplo: se o status for 'concluido', desmarca o lembrete
const statusSelect = document.getElementById('status');
const ativarLembreteCheckbox = document.getElementById('ativar-lembrete');
}