# Documentação Técnica — Etapa 06: API REST da Aplicação

**Projeto:** EasySched — Gestão Integrada de Cronogramas e Lembretes  
**Objetivo:** Implementar o servidor da aplicação em Node.js/Express e disponibilizar o recurso principal de atividades por meio de uma API RESTful integrada ao front-end.

---

## 1. Arquitetura e Organização do Servidor

Na Etapa 06, o front-end (`client/`) deixou de consumir o serviço externo de mock (MockAPI.io) e passou a se comunicar diretamente com um back-end próprio (`server/`) desenvolvido em **Node.js** e **Express**, estruturado com separação de responsabilidades entre a configuração do servidor e o roteamento do recurso principal:

```text
EasySched/
├── client/                               # Interface Web (HTML5, CSS3, JS ES6+)
│   └── js/
│       └── api.js                        # Camada de serviço integrada a http://localhost:3000/api/atividades
├── server/                               # Servidor API REST
│   ├── routes/
│   │   └── atividades.js                 # Rotas CRUD (/api/atividades), validação de entrada e dados em memória
│   ├── package.json                      # Dependências (express, cors) e script de inicialização
│   └── server.js                         # Inicialização do Express, CORS, JSON parser e tratamento global de erros
└── docs/
    ├── etapa-06.md                       # Documentação dos endpoints, códigos HTTP e exemplos
    ├── requisicoes.http                  # Coleção de requisições executáveis via extensão REST Client (VS Code)
    └── EasySched.postman_collection.json # Coleção compatível com Postman / Insomnia