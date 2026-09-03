# **Documentação do Projeto — Etapa 02: Protótipo Estrutural com HTML Semântico**

* **Projeto:** EasySched \- Gestão Integrada de Cronogramas e Lembretes  
* **Etapa:** 02 \- Protótipo Estrutural da Interface  
* **Tag do Git:** `etapa-02`  
* **Status:** Concluído

## **1\. Visão Geral da Etapa**

O objetivo principal desta etapa foi transformar a proposta conceitual formulada na etapa 01 em um protótipo navegável de interface Web utilizando exclusivamente HTML5 semântico.

Nesta fase, o foco esteve voltado para a estruturação lógica do conteúdo, acessibilidade nativa, hierarquia de informações e organização do código-fonte, sem a inclusão de estilos CSS avançados, manipulação dinâmica via JavaScript, integração com banco de dados ou comunicação com APIs.

## **2\. Estrutura de Arquivos do Projeto**

Os arquivos de interface foram organizados dentro do diretório `client/`, enquanto a documentação da etapa foi alocada na pasta `docs/`, mantendo a coerência com a estrutura arquitetural prevista na Etapa 01:

EasySched/  
├── docs/  
│   ├── proposta.md  
│   └── etapa-02.md                    
├── client/  
│   ├── index.html                   	\< Página 1: Visão Geral e Cronograma  
│   ├── cadastro-atividade.html      	\< Página 2: Formulário de Atividades e Lembretes  
│   └── relatorios.html              	\< Página 3: Métricas e Distribuição de Tempo  
├── README.md  
└── .gitignore

## **3\. Páginas Criadas e Funcionalidades Representadas**

Foram desenvolvidas três páginas funcionais e representativas das principais necessidades do domínio de gestão de tempo do EasySched:

### **3.1. Visão Geral do Cronograma (`client/index.html`)**

* **Objetivo:** Atuar como a página principal (*dashboard*), oferecendo uma visão rápida dos compromissos diários e lembretes ativos.  
* **Funcionalidades Representadas:**  
  * Painel de resumo sintético do dia (total de atividades e distribuição por status: *Concluído*, *Em Andamento*, *Pendente*).  
  * Exibição do cronograma em blocos temporais com horários de início e término.  
  * Classificação temática das tarefas por categorias (*Estudos*, *Trabalho/Projetos*, *Saúde/Esportes*, *Lazer*).  
  * Botões de ação rápida por tarefa (*Iniciar*, *Concluir*, *Editar*, *Excluir*).  
  * Painel informativo de próximos lembretes e notificações ativas.

### **3.2. Cadastro de Atividades e Lembretes (`client/cadastro-atividade.html`)**

* **Objetivo:** Fornecer a interface de entrada de dados para que o usuário crie ou edite compromissos e configure alertas de antecedência.  
* **Funcionalidades Representadas:**  
  * Formulário completo de cadastro de atividades com título, descrição, data, horário de início e término.  
  * Seleção padronizada de categorias e definição do status inicial da tarefa.  
  * Configuração de notificações prévias (opção de ativação, seleção de tempo de antecedência e canal de alerta via *Web Notifications API* ou interface).  
  * Ações de envio (*Salvar Atividade*), redefinição (*Limpar Campos*) e cancelamento.

### **3.3. Relatórios e Distribuição de Tempo (`client/relatorios.html`)**

* **Objetivo:** Exibir dados agregados e métricas para que o usuário analise a alocação do seu tempo e sua produtividade.  
* **Funcionalidades Representadas:**  
  * Indicador geral de progresso e taxa de conclusão das metas semanais.  
  * Tabela estruturada com a soma de horas e percentual de tempo dedicado a cada categoria.  
  * Tabela de distribuição quantitativa de tarefas agrupadas por status de execução.  
  * Indicadores visuais nativos de porcentagem e progresso.

## **4\. Decisões de Estrutura HTML e Acessibilidade**

A modelagem do código seguiu rigorosamente os padrões do W3C para HTML5 semântico, priorizando a acessibilidade e a navegação por leitores de tela:

### **4.1. Hierarquia e Regiões Principais (`<header>`, `<nav>`, `<main>`, `<footer>`)**

* **`<header>`:** Presente em todas as páginas para manter a identidade do sistema (título `<h1>` e subtítulo `<p>`) e abrigar o menu principal.  
* **`<nav>`:** Delimita a navegação global. O atributo `aria-label="Navegação principal"` foi adicionado para distinguir a barra de navegação, enquanto `aria-current="page"` sinaliza a página em exibição ativa.  
* **`<main>`:** Utilizado exatamente uma vez por página para englobar o conteúdo exclusivo e central.  
* **`<footer>`:** Centraliza as informações institucionais, copyright e escopo educacional.

### **4.2. Agrupamento de Conteúdo e Modularidade (`<section>`, `<article>`)**

* **`<section>`:** Utilizado para criar blocos temáticos lógicos nas páginas (ex.: *Cronograma Diário*, *Dados da Atividade*, *Distribuição de Tempo*). Cada seção foi vinculada ao seu respectivo título (`<h2>`) através do atributo `aria-labelledby`.  
* **`<article>`:** Aplicado para representar conteúdos autônomos que mantêm significado individual caso sejam isolados, como cada card de compromisso individual na agenda, cada card de lembrete e o card de resumo de progresso.

### **4.3. Acessibilidade Restrita em Formulários (`<form>`, `<fieldset>`, `<legend>`, `<label>`)**

* **Associação Explícita `for` / `id`:** Em cumprimento integral aos critérios da etapa, 100% dos campos de entrada (`<input>`, `<select>`, `<textarea>`) possuem elementos `<label>` vinculados de forma unívoca através dos atributos `for="ID"` e `id="ID"`.  
* **Agrupamento Semântico:** O formulário foi dividido em dois blocos lógicos usando `<fieldset>` e `<legend>`: um para os *Dados da Atividade* e outro para a *Configuração de Lembrete e Notificação*.  
* **Validação Nativa:** Uso dos tipos nativos `type="date"`, `type="time"` e do atributo `required` para assegurar o preenchimento correto sem dependência de scripts externos.

### **4.4. Estruturação Semântica de Tabelas e Indicadores (`<table>`, `<meter>`, `<progress>`)**

* **Tabelas de Relatório:** Construídas utilizando a estrutura semântica completa: `<caption>` para descrição legível por leitores de tela, `<thead>` para o cabeçalho, `<tbody>` para dados, `<tfoot>` para somatórios totais, e o atributo `scope="col"` ou `scope="row"` nas células `<th>` para definir o contexto ordinal das informações.  
* **Elementos Nativos de Medição:**  
  * **`<meter>`:** Utilizado para representar métricas estáticas e frações conhecidas do tempo alocado por categoria.  
  * **`<progress>`:** Utilizado para sinalizar o avanço dinâmico em direção ao cumprimento da meta semanal de tarefas.

## **5\. Limitações e Escopo desta Etapa**

Em conformidade com as orientações do projeto:

* **Não inclusos nesta etapa:** Banco de dados, endpoints de API REST, estilos CSS avançados/responsividade visual customizada, manipuladores de evento JavaScript complexos e persistência de dados no navegador.  
* **Comportamento atual:** O envio de formulários e os botões de ação simulam interações de interface estáticas que serão dinamizadas nas etapas futuras.