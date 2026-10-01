# **EasySched**

**Gestão Integrada de Cronogramas e Lembretes**

Aplicação Web para gerenciamento e análise de rotinas pessoais e profissionais organizadas por blocos de tempo.

**Status do Projeto:** Etapa 04 Concluída — Interatividade Front-end com JavaScript e Persistência Local.

---

## **Sobre o Projeto**

O **EasySched** é uma aplicação web desenvolvida para auxiliar estudantes, profissionais autônomos e freelancers a organizar e acompanhar suas atividades diárias e semanais com clareza.

A aplicação permite registrar compromissos em blocos de tempo, categorizar tarefas, acompanhar o progresso em um cronograma dinâmico e analisar a distribuição do tempo por meio de relatórios interativos.

---

## **Estrutura de Arquivos do Projeto**

```text
EasySched/
├── principal.html        # Dashboard principal (Resumo de Hoje e Cronograma)
├── atividade.html        # Formulário de cadastro de novas atividades com validação
├── relatorio.html        # Relatórios dinâmicos de progresso e distribuição de tempo
├── styles.css            # Estilização global, responsiva (Breakpoints 768px/1024px) e componentes
├── js/
│   ├── storage.js        # Camada de persistência e gerenciamento do LocalStorage
│   ├── principal.js      # Lógica do cronograma, filtros, ordenação e contadores do dia
│   ├── atividade.js      # Lógica de validação em tempo real e submissão do formulário
│   └── relatorio.js      # Lógica dos relatórios temporais e recálculo de métricas
└── docs/
    ├── etapa-02.md       # Documentação do HTML   
    ├── etapa-03.md       # Documentação do layout responsivo (CSS Grid / Flexbox)
    ├── etapa-04.md       # Documentação da interatividade JS e Matriz de Evidências
    ├── proposta.md       # Documentação da proposta inicial do projeto
    └── evidencias/
        └── etapa-03/     # Capturas de tela comprovando o funcionamento em diferentes viewports 
        └── etapa-04/     # Capturas de tela comprovando o funcionamento das interações
```

---

## **Funcionalidades Implementadas (Etapa 04)**

### 1. **Cadastro e Validação de Atividades (`atividade.html`)**
- **Bloqueio de Datas Anteriores:** Restrição no calendário nativo (`input.min`) e validação lógica no envio para impedir compromissos em datas passadas.
- **Validação Temporal de Horários:** Garantia de que o horário de término é estritamente posterior ao horário de início.
- **Regras de Usabilidade:** Desativação automática de lembretes caso a atividade seja cadastrada diretamente como "Concluída".
- **Feedback Visual:** Banners coloridos de erro (`.mensagem-erro`) e sucesso (`.mensagem-sucesso`) com destaque em borda vermelha para campos inválidos.

### 2. **Dashboard e Cronograma Inteligente (`principal.html`)**
- **Resumo Numérico Estrito:** Contadores do topo ("Total", "Concluídas", "Em Andamento", "Pendentes") focados exclusivamente nas atividades do **dia atual**.
- **Separação por Blocos de Foco:** Exibição direcionada apenas para as atividades de **Hoje** e **Amanhã**, mantendo o foco operacional do usuário e ordenadas cronologicamente por horário de início.
- **Busca e Filtros em Tempo Real:** Filtragem dinâmica por termo de busca (título/descrição), Categoria (*Estudos*, *Trabalho*, *Saúde*, *Lazer*) e Status (*Pendente*, *Em Andamento*, *Concluído*).
- **Ações Dinâmicas:** Alteração de status com um clique ("Iniciar", "Concluir") e exclusão de tarefas com re-renderização instantânea sem recarregar a página.

### 3. **Relatórios e Análise Temporais (`relatorio.html`)**
- **Filtro por Período:** Seletor temporal para alternar os dados entre **Hoje**, **Esta Semana**, **Este Mês**, **Este Ano** e **Todo o Período**.
- **Indicadores Gráficos Dinâmicos:**
  - Barra de progresso de conclusão (`<progress>`).
  - Distribuição de tempo alocado em horas e porcentagem por categoria (`<meter>`).
  - Balanço de tarefas por status em tabela formatada.

---

## **Tecnologias Utilizadas**

- **Front-end:** HTML5 Semântico, CSS3 (Variáveis/Tokens, Flexbox, CSS Grid e Media Queries responsivas para 768px e 1024px) e JavaScript (ES6+ Vanilla).
- **Manipulação do DOM e Eventos:** `addEventListener`, `createElement`, `appendChild`, atualização dinâmica de classes e atributos.
- **Persistência de Dados:** `localStorage` do navegador com serialização e desserialização via JSON.
- **Processamento de Datas:** Objetos nativos `Date` e manipulação de strings de data ISO (`YYYY-MM-DD`).

---

## **Como Executar a Aplicação**

A aplicação é **100% Client-Side** e não requer a instalação de compiladores ou servidores back-end adicionais nesta etapa.

### **Passo a Passo:**

1. **Clonar ou Baixar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/EasySched.git
   cd EasySched
   ```

2. **Abrir no Navegador:**
   - Abra o arquivo `principal.html` diretamente no seu navegador de preferência (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.) clicando duas vezes sobre o arquivo.
   - Alternativamente, utilize a extensão **Live Server** no VS Code para executar a aplicação em um servidor local (`http://127.0.0.1:5500`).

---

## **Roteiro de Testes das Funcionalidades Interativas**

Para reproduzir e verificar o funcionamento de todas as regras interativas implementadas:

1. **Testar Validações no Formulário (`atividade.html`):**
   - Tente submeter o formulário sem preencher os campos para observar o banner de erro.
   - Tente selecionar/digitar uma data passada. O sistema exibirá o alerta de bloqueio.
   - Coloque a data de hoje, selecione Horário de Início às `14:00` e Término às `13:00`. Observe o aviso de inconsistência de horários.
   - Preencha corretamente (Início `14:00`, Término `16:00`) e clique em "Salvar Atividade". Observe o redirecionamento.

2. **Testar Dashboard e Filtros (`principal.html`):**
   - Verifique que a nova atividade aparece no cronograma sob o dia de **Hoje** e altera os contadores do topo.
   - Cadastre uma nova atividade com a data de **Amanhã**. Observe que ela é exibida no bloco separado `📅 Para Amanhã`.
   - Digite no campo "Pesquisar" ou mude o seletor de Categoria/Status para ver a filtragem instantânea dos cards.
   - Clique em "Iniciar" ou "Concluir" no card para verificar a mudança do badge de cor e a atualização do resumo.

3. **Testar Relatórios e Filtro Temporal (`relatorio.html`):**
   - Acesse a aba de Relatórios na navegação do cabeçalho.
   - Altere o seletor "Filtrar Relatórios por Período" entre **Hoje**, **Esta Semana**, **Este Mês** e **Todo o Período**.
   - Observe que as porcentagens da barra `<progress>` e dos medidores `<meter>` recalculam em tempo real.

---

## **Versionamento e Documentação**

- **Tag da Entrega:** `etapa-04`
- **Documentação Detalhada e Matriz de Evidências:** `/docs/etapa-04.md`
- **Evidências Visuais (Screenshots):** `/docs/evidencias/etapa-04/`

---

## **Licença e Isenção de Responsabilidade**

O **EasySched** é um projeto de caráter educacional e de apoio à organização pessoal. O cumprimento dos prazos e compromissos é de responsabilidade exclusiva do usuário.