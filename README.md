# EasySched — Gestão Integrada de Cronogramas e Lembretes

Aplicação web full-stack para organização de rotina, agendamento de atividades, configuração de lembretes e acompanhamento de métricas de produtividade por categoria e status.

Na **Etapa 07**, o projeto passou a contar com **persistência real em banco de dados relacional (SQLite)**, modelagem de entidades relacionadas (`1:N`), camada de repositórios desacoplada da API REST, validação de integridade referencial e tratamento padronizado de erros de persistência.

---

## Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3 e JavaScript (ES6+ Modules com `Fetch API`).
* **Back-end:** Node.js, Express e CORS.
* **Banco de Dados:** SQLite (`sqlite3` + interface assíncrona `sqlite`).
* **Testes e Documentação:** REST Client (`docs/requisicoes.http`) e especificações técnicas em Markdown (`docs/`).

---

## Estrutura do Projeto

```text
EasySched/
├── client/                               # Interface Web
│   ├── principal.html                    # Dashboard, resumo diário e cronograma
│   ├── atividade.html                    # Formulário de criação e edição de atividades
│   ├── relatorio.html                    # Relatórios de horas por categoria e status
│   ├── style.css                         # Estilização global da aplicação
│   └── js/
│       ├── api.js                        # Camada de comunicação HTTP com a API REST
│       ├── principal.js                  # Lógica e renderização da tela principal
│       ├── atividade.js                  # Carga dinâmica de categorias e envio do formulário
│       └── relatorio.js                  # Filtros de período e consolidação de indicadores
├── server/                               # Servidor API REST + Persistência
│   ├── database/
│   │   ├── schema.sql                    # Script DDL de criação das tabelas e carga inicial
│   │   ├── connection.js                 # Gerenciamento da conexão SQLite e ativação de FKs
│   │   └── easysched.db                  # Arquivo do banco gerado em runtime (ignorado no Git)
│   ├── repositories/
│   │   ├── categoriaRepository.js        # Consultas SQL da entidade Categorias
│   │   └── atividadeRepository.js        # Consultas SQL (CRUD com INNER JOIN) de Atividades
│   ├── routes/
│   │   ├── categorias.js                 # Endpoints REST /api/categorias
│   │   └── atividades.js                 # Endpoints REST /api/atividades
│   ├── package.json                      # Dependências e scripts do servidor
│   └── server.js                         # Inicialização do Express e tratamento global de erros
└── docs/
    ├── etapa-06.md                       # Documentação da Etapa 06 (API REST)
    ├── etapa-07.md                       # Documentação da Etapa 07 (Persistência e Modelo Relacional)
    └── requisicoes.http                  # Coleção de requisições de teste (REST Client)
```

---

## Modelo de Dados e Persistência

O banco de dados relacional SQLite estrutura duas entidades relacionadas em cardinalidade **1:N**:

* **`categorias` (1):** Armazena as áreas de classificação (`id`, `slug`, `nome`, `cor`), inicializadas automaticamente com *Estudos*, *Trabalho*, *Saúde* e *Lazer*.
* **`atividades` (N):** Armazena os compromissos e lembretes (`id`, `titulo`, `descricao`, `data`, `hora_inicio`, `hora_fim`, `status`, `ativar_lembrete`, `antecedencia`, `canal_alerta`, `categoria_id`, `criado_em`).
* **Integridade Referencial:** A coluna `categoria_id` referencia `categorias(id)` com `FOREIGN KEY ... ON DELETE RESTRICT`, impedindo vínculos com categorias inexistentes ou a remoção de categorias em uso.

---

## Endpoints da API REST

**Base URL:** `http://localhost:3000/api`

| Método | Endpoint | Descrição | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/categorias` | Lista todas as categorias cadastradas no banco. | `200` |
| `POST` | `/categorias` | Cadastra uma nova categoria. | `201`, `400` |
| `GET` | `/atividades` | Lista todas as atividades com dados da categoria (`JOIN`). | `200` |
| `GET` | `/atividades/:id` | Consulta uma atividade específica pelo `id`. | `200`, `404` |
| `POST` | `/atividades` | Valida e persiste uma nova atividade. | `201`, `400` |
| `PUT` | `/atividades/:id` | Valida e atualiza uma atividade existente. | `200`, `400`, `404` |
| `DELETE` | `/atividades/:id` | Exclui uma atividade do banco pelo `id`. | `200`, `404` |

---

## Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (v18 ou superior) instalado.

### 1. Clonar o repositório
```bash
git clone https://github.com/joaogabi21/EasySched.git
cd EasySched
```

### 2. Iniciar o servidor Back-end e o Banco SQLite
```bash
cd server
npm install
npm start
```
Na primeira execução, o servidor cria automaticamente o arquivo `server/database/easysched.db`, executa o script `server/database/schema.sql` e inicia a API em `http://localhost:3000/api/atividades`.

### 3. Executar o Front-end
Em um segundo terminal (na raiz do projeto), sirva a pasta `client/` ou utilize a extensão **Live Server** no VS Code:
```bash
npx serve client -l 5500
```
Acesse `http://localhost:5500/principal.html` no navegador.

---

## Documentação e Testes

* **Modelo do Banco, Entidades e Exemplos CRUD:** Consulte [`docs/etapa-07.md`](docs/etapa-07.md).
* **Especificação da API REST:** Consulte [`docs/etapa-06.md`](docs/etapa-06.md).
* **Testes de Endpoints:** Abra [`docs/requisicoes.http`](docs/requisicoes.http) no VS Code com a extensão **REST Client** instalada para executar as requisições de consulta, criação, atualização, exclusão e validação de erros.