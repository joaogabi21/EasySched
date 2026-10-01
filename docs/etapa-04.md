# Documentação da Etapa 04 - Interatividade com JavaScript

## 1. Descrição das Funcionalidades Interativas Implementadas

Nesta etapa, o sistema **EasySched** recebeu uma arquitetura JavaScript modular e interativa, baseada em eventos, manipulação dinâmica do DOM, regras de validação rigorosas e persistência de dados no `localStorage`:

### Funcionalidade 1: Cadastro e Validação em Tempo Real de Atividades (`atividade.html`)
- **Como funciona:** O usuário preenche o formulário de agendamento de atividade. Ao submeter o formulário (`submit`), o script valida a presença de campos obrigatórios, aplica o atributo `min` no campo de data para proibir datas passadas no calendário e executa duas validações lógicas cruciais:
  1. **Proibição de Datas Anteriores:** Impede a criação de compromissos com data anterior à data de hoje.
  2. **Consistência de Horários:** Garante que o horário de término seja obrigatorio e posterior ao horário de início.
  - Em caso de erro, exibe um banner vermelho detalhado e aplica bordas vermelhas (`#ef4444`) nos campos com falha. Em caso de sucesso, salva o registro no `localStorage`, apresenta banner de confirmação verde e redireciona para o cronograma.
- **Arquivos envolvidos:** `atividade.html`, `js/storage.js`, `js/atividade.js`, `styles.css`.
- **Conceitos de programação:** Interceptação de eventos (`addEventListener`), manipulação do DOM (`createElement`, `innerHTML`, `style`), prevenção do envio padrão (`preventDefault`), manipulação de objetos `Date` e validação condicional.

### Funcionalidade 2: Dashboard Otimizado com Filtros por Data, Categoria e Status (`principal.html`)
- **Como funciona:** O painel inicial lê o `localStorage` e exibe o resumo numérico focado **exclusivamente na data de hoje**. O cronograma aplica uma filtragem temporal rigorosa: exibe apenas os compromissos agendados para **Hoje** e **Amanhã** (ocultando tarefas passadas ou com datas futuras distantes para manter o foco operacional do usuário).
  - Inclui barra de pesquisa por texto e filtros por Categoria e Status em tempo real.
  - As atividades de cada dia são ordenadas automaticamente em ordem crescente por horário de início.
  - Oferece botões dinâmicos ("Iniciar", "Concluir" e "Excluir") que alteram o estado da aplicação e re-renderizam a interface instantaneamente.
- **Arquivos envolvidos:** `principal.html`, `js/storage.js`, `js/principal.js`, `styles.css`.
- **Conceitos de programação:** Métodos de iteração de arrays (`filter`, `sort`, `forEach`), ordenação temporal (`localeCompare`), alteração dinâmica do DOM, gerenciamento de estado vazio (*empty state*) e persistência de dados.

### Funcionalidade 3: Relatórios com Filtro Temporal Dinâmico (`relatorio.html`)
- **Como funciona:** Oferece um seletor de período (**Hoje**, **Esta Semana**, **Este Mês**, **Este Ano** e **Todo o Período**). Ao alterar o seletor, o script recalcula dinamicamente em tempo real:
  1. A porcentagem de conclusão de compromissos no elemento gráfico `<progress>`.
  2. As horas totais alocadas por categoria (Trabalho, Estudos, Saúde e Lazer) com barras medidoras `<meter>`.
  3. O balanço numérico e percentual de atividades por status.
- **Arquivos envolvidos:** `relatorio.html`, `js/storage.js`, `js/relatorio.js`, `styles.css`.
- **Conceitos de programação:** Processamento e cálculo de intervalo de datas em JavaScript, métodos de acúmulo e iteração (`reduce`, `filter`, `forEach`), atualização dinâmica de tabelas e elementos gráficos do HTML.

---

## 2. Descrição das Validações e Situações Inválidas Tratadas

1. **Tentativa de Criar Atividades com Datas Passadas:** O sistema bloqueia a escolha de datas anteriores no calendário do navegador (`input.min`) e gera alerta de erro no envio caso seja digitado manualmente uma data anterior a hoje.
2. **Inconsistência de Horários (Término <= Início):** Trata a tentativa de inserir um horário de término menor ou igual ao de início (ex.: Início 14:00, Término 13:00).
3. **Tratamento de Estado Vazio no Cronograma:** Quando o usuário escolhe um filtro sem resultados ou não há tarefas para Hoje/Amanhã, a página exibe uma mensagem fluida (`.aviso-vazio`) evitando quebras de layout.
4. **Resiliência do LocalStorage:** Trata arrays vazios (`[]`) ou dados corrompidos sem gerar exceções de `null` ou `undefined`.

---

## 3. Matriz de Evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
| :--- | :--- | :--- | :--- |
| **Manipulação do DOM** | Renderização dinâmica de cards, avisos e barras | `js/principal.js`, `js/atividade.js`, `js/relatorio.js` | `document.createElement('article')`, `appendChild()`, inserção de `.mensagem-erro` e `.painel-filtros` |
| **Tratamento de eventos** | Submissão de formulário, buscas e filtro temporal | `js/atividade.js`, `js/principal.js`, `js/relatorio.js` | `form.addEventListener('submit')`, `inputBusca.addEventListener('input')`, `selectPeriodo.addEventListener('change')` |
| **Validação de formulários** | Checagem de obrigatoriedade, datas passadas e horários | `js/atividade.js` | Verificação de campos, `dataInput.value < hojeDataStr` e `horaFimInput.value <= horaInicioInput.value` |
| **Alteração dinâmica da interface** | Atualização do resumo, cronograma, barras e tabelas | `js/principal.js`, `js/relatorio.js` | Re-renderização dos contadores do dia, re-cálculo dos elementos `<progress>` e `<meter>` e remoção de cards em tempo real |
| **Uso de funções** | Estruturação modular da aplicação | `js/storage.js`, `js/principal.js`, `js/relatorio.js` | Funções modulares: `getAtividades()`, `getHojeDataStr()`, `filtrarPorPeriodo()`, `renderizarCronograma()` |
| **Uso de arrays** | Gerenciamento de estado de tarefas | `js/storage.js` | Array de objetos salvos e recuperados do `localStorage` com `JSON.parse()` e `JSON.stringify()` |
| **Métodos de iteração** | Filtragem, ordenação e cálculo | `js/principal.js`, `js/relatorio.js` | Uso sistemático de `.filter()`, `.sort()`, `.forEach()` e `.reduce()` no processamento de dados |
| **Tratamento de situações inválidas** | Banners de erro, destaque de campos e avisos vazios | `js/atividade.js`, `js/principal.js` | Borda vermelha (`#ef4444`) em campos com erro, exibição de `.mensagem-erro` e mensagem `.aviso-vazio` |

---

## 4. Instruções de Execução e Teste

### Como Executar a Aplicação:
1. Abra qualquer um dos arquivos HTML (`principal.html`, `atividade.html` ou `relatorio.html`) no navegador.

### Roteiro para Testar as Funcionalidades:
1. **Validação de Data Passada e Horário (`atividade.html`):**
   - Tente submeter o formulário em branco.
   - Digite uma data anterior a hoje no campo de data e tente salvar. Verifique a mensagem de bloqueio.
   - Coloque a data de hoje, ajuste o Horário de Início para 15:00 e Término para 14:00. Verifique o aviso de inconsistência de horário.
   - Corrija para Término 16:00, selecione uma Categoria e salve.
2. **Cronograma Restrito e Ordenação (`principal.html`):**
   - Verifique que a nova atividade aparece no bloco de **Hoje** e que o painel de resumo conta estritamente as tarefas do dia.
   - Adicione uma atividade para **Amanhã** e observe-a aparecer no grupo separado `📅 Para Amanhã`.
   - Teste a barra de busca e os seletores de Categoria e Status.
   - Clique em "Iniciar" e "Concluir" nos cards e observe a mudança de estado e a atualização dos contadores.
3. **Relatórios Temporais (`relatorio.html`):**
   - Altere o filtro no topo da página de "Esta Semana" para "Hoje", "Este Mês" ou "Todo o Período".
   - Observe os gráficos `<progress>`, `<meter>` e as tabelas recalculando as horas e porcentagens instantaneamente.
