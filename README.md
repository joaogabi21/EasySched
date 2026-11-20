# **EasySched**

**Gestão Integrada de Cronogramas e Lembretes**

Aplicação Web Full-Stack para gerenciamento e análise de rotinas pessoais e profissionais organizadas por blocos de tempo.

**Status do Projeto:** Etapa 06 Concluída — API REST da Aplicação com Node.js e Express integrada ao Front-end.

---

## **Sobre o Projeto**

O **EasySched** é uma aplicação web desenvolvida para auxiliar estudantes, profissionais autônomos e freelancers a organizar e acompanhar suas atividades diárias e semanais com clareza.

Nesta sexta etapa, o sistema deixou de depender de serviços externos de mock e passou a contar com um **servidor próprio orientado a serviços (API REST)** construído em **Node.js** e **Express**, disponibilizando operações CRUD completas, validação de dados de entrada, códigos de status HTTP coerentes e tratamento padronizado de erros.

---

## **Estrutura de Arquivos do Projeto**

```text
EasySched/
├── client/                               # Front-end da aplicação
│   ├── principal.html                    # Dashboard principal (Resumo de Hoje, Cronograma e Lembretes)
│   ├── atividade.html                    # Formulário de cadastro e edição de atividades com validação
│   ├── relatorio.html                    # Relatórios dinâmicos de progresso e distribuição de tempo
│   ├── style.css                         # Estilização global responsiva (Breakpoints 640px/1024px)
│   └── js/
│       ├── api.js                        # Comunicação assíncrona com a API local (localhost:3000)
│       ├── principal.js                  # Lógica assíncrona do dashboard, cronograma e contadores
│       ├── atividade.js                  # Lógica de validação, edição e submissão (POST/PUT)
│       └── relatorio.js                  # Lógica de consumo da API e recálculo de métricas temporais
├── server/                               # Back-end API REST (Etapa 06)
│   ├── routes/
│   │   └── atividades.js                 # Rotas REST (/api/atividades), validação e dados em memória
│   ├── package.json                      # Dependências (express, cors) e scripts de execução
│   └── server.js                         # Configuração do servidor Express e tratamento de erros
├── docs/
│   ├── etapa-02.md                       # Documentação do HTML Semântico
│   ├── etapa-03.md                       # Documentação do layout responsivo (CSS Grid / Flexbox)
│   ├── etapa-04.md                       # Documentação da interatividade JS e Persistência Local
│   ├── etapa-05.md                       # Documentação da Comunicação Assíncrona e Módulos ES6
│   ├── etapa-06.md                       # Documentação dos Endpoints REST, Requisições e Respostas
│   ├── proposta.md                       # Documentação da proposta inicial do projeto
│   ├── requisicoes.http                  # Coleção de testes
│   └── evidencias/
│       ├── etapa-03/                     # Capturas de tela do funcionamento em diferentes viewports
│       ├── etapa-04/                     # Capturas de tela da interatividade e validações
│       └── etapa-05/                     # Capturas de tela das requisições HTTP e estados da UI
├── .gitignore                            # Exclusão de node_modules/ e arquivos temporários
└── README.md