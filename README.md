# **EasySched**

**Gestão Integrada de Cronogramas e Lembretes**

Aplicação Web para gerenciamento e análise de rotinas pessoais e profissionais organizadas por blocos de tempo.

**Status do Projeto:** Etapa 05 Concluída — Modularização com Módulos ES6 e Comunicação Assíncrona via API REST (MockAPI.io).

---

## **Sobre o Projeto**

O **EasySched** é uma aplicação web desenvolvida para auxiliar estudantes, profissionais autônomos e freelancers a organizar e acompanhar suas atividades diárias e semanais com clareza.

Nesta quinta etapa, a aplicação evoluiu de um modelo de persistência síncrono local (`localStorage`) para uma **arquitetura assíncrona baseada em micro-serviços mock (REST API)**, utilizando Módulos ES6 (`import`/`export`), a **Fetch API** nativa do JavaScript e tratamento completo dos 3 estados de interface (Carregamento, Sucesso e Erro).

---

## **Estrutura de Arquivos do Projeto**

```text
EasySched/
├── principal.html        # Dashboard principal (Resumo de Hoje, Cronograma e Lembretes)
├── atividade.html        # Formulário de cadastro e edição de atividades com validação
├── relatorio.html        # Relatórios dinâmicos de progresso e distribuição de tempo
├── style.css             # Estilização global, responsiva (Breakpoints 640px/1024px) e componentes
├── js/
│   ├── api.js            # Módulo centralizador de requisições HTTP assíncronas (Fetch API)
│   ├── principal.js      # Lógica assíncrona do dashboard, cronograma e contadores de hoje
│   ├── atividade.js      # Lógica de validação em tempo real, edição e submissão (POST/PUT)
│   └── relatorio.js      # Lógica de consumo da API e recálculo de métricas temporais
└── docs/
    ├── etapa-02.md       # Documentação do HTML Semântico
    ├── etapa-03.md       # Documentação do layout responsivo (CSS Grid / Flexbox)
    ├── etapa-04.md       # Documentação da interatividade JS e Persistência Local
    ├── etapa-05.md       # Documentação da Comunicação Assíncrona e Módulos ES6
    ├── proposta.md       # Documentação da proposta inicial do projeto
    └── evidencias/
        ├── etapa-03/     # Capturas de tela do funcionamento em diferentes viewports
        ├── etapa-04/     # Capturas de tela da interatividade e validações
        └── etapa-05/     # Capturas de tela das requisições HTTP (DevTools) e estados da UI
