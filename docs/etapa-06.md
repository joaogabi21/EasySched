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
```

---

## 2. Modelo de Dados do Recurso (`/api/atividades`)

Todas as requisições e respostas trafegam no formato **JSON** (`Content-Type: application/json`). Cada atividade manipulada pela API segue a estrutura abaixo:

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Automático | Identificador único gerado pelo servidor (`Date.now().toString()`). |
| `titulo` | `string` | Sim | Título resumido da atividade ou compromisso. |
| `descricao` | `string` | Não | Detalhamento opcional da tarefa. |
| `data` | `string` | Sim | Data agendada no formato ISO (`YYYY-MM-DD`). |
| `horaInicio` | `string` | Sim | Horário de início no formato `HH:MM`. |
| `horaFim` | `string` | Sim | Horário de término no formato `HH:MM` (deve ser maior que `horaInicio`). |
| `categoria` | `string` | Sim | Identificador da categoria (`estudos`, `trabalho`, `saude`, `lazer`). |
| `categoriaRotulo` | `string` | Não | Rótulo legível exibido na interface (ex: `"Estudos"`). |
| `status` | `string` | Não | Estado atual (`pendente`, `em_andamento`, `concluido`). Padrão: `"pendente"`. |
| `statusRotulo` | `string` | Não | Rótulo legível do status (ex: `"Pendente"`). |
| `ativarLembrete` | `boolean` | Não | Indica se o alerta está ativo (`true` ou `false`). |
| `antecedencia` | `string` | Não | Minutos de antecedência do alerta (ex: `"15"`, `"30"`). |
| `canalAlerta` | `string` | Não | Meio de notificação configurado (ex: `"navegador"`). |

---

## 3. Especificação dos Endpoints REST

**Base URL:** `http://localhost:3000`

| Método HTTP | Endpoint | Operação | Códigos HTTP Possíveis |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/atividades` | Consulta geral: lista todas as atividades cadastradas. | `200 OK` |
| `GET` | `/api/atividades/:id` | Consulta individual: retorna uma atividade específica pelo `id`. | `200 OK`, `404 Not Found` |
| `POST` | `/api/atividades` | Criação: valida os dados e cadastra uma nova atividade. | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/atividades/:id` | Alteração: valida e atualiza os dados de uma atividade existente. | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/atividades/:id` | Exclusão: remove uma atividade existente pelo `id`. | `200 OK`, `404 Not Found` |

---

## 4. Validação de Entradas e Tratamento Consistente de Erros

A API aplica validação explícita antes de persistir ou alterar registros e utiliza middlewares globais no `server.js` para padronizar qualquer falha em JSON:

* **`200 OK`:** Requisição processada com sucesso (`GET`, `PUT`, `DELETE`).
* **`201 Created`:** Novo recurso criado com sucesso (`POST`).
* **`400 Bad Request`:** Retornado quando algum campo obrigatório está ausente/vazio (`titulo`, `data`, `horaInicio`, `horaFim`, `categoria`), quando `horaFim <= horaInicio` ou quando o corpo JSON enviado é sintaticamente inválido.
* **`404 Not Found`:** Retornado ao buscar, atualizar ou excluir um `:id` inexistente, ou ao acessar uma rota não mapeada no servidor.
* **`500 Internal Server Error`:** Retornado pelo middleware global em caso de exceção inesperada no servidor.

---

## 5. Exemplos de Requisições e Respostas

### 5.1. Consulta Geral (`GET /api/atividades`)

**Requisição:**
```bash
curl -X GET http://localhost:3000/api/atividades
```

**Resposta (`200 OK`):**
```json
[
  {
    "id": "1",
    "titulo": "Revisão de Desenvolvimento Web",
    "descricao": "Testar API REST da Etapa 06",
    "data": "2026-11-20",
    "horaInicio": "14:00",
    "horaFim": "16:00",
    "categoria": "estudos",
    "categoriaRotulo": "Estudos",
    "status": "pendente",
    "statusRotulo": "Pendente",
    "ativarLembrete": true,
    "antecedencia": "30",
    "canalAlerta": "navegador"
  }
]
```

---

### 5.2. Consulta Individual (`GET /api/atividades/:id`)

**Requisição:**
```bash
curl -X GET http://localhost:3000/api/atividades/1
```

**Resposta (`200 OK`):**
```json
{
  "id": "1",
  "titulo": "Revisão de Desenvolvimento Web",
  "descricao": "Testar API REST da Etapa 06",
  "data": "2026-11-20",
  "horaInicio": "14:00",
  "horaFim": "16:00",
  "categoria": "estudos",
  "categoriaRotulo": "Estudos",
  "status": "pendente",
  "statusRotulo": "Pendente",
  "ativarLembrete": true,
  "antecedencia": "30",
  "canalAlerta": "navegador"
}
```

---

### 5.3. Criação de Atividade (`POST /api/atividades`)

**Requisição:**
```bash
curl -X POST http://localhost:3000/api/atividades \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Estudar API REST",
    "descricao": "Testar endpoints da Etapa 06",
    "data": "2026-11-20",
    "horaInicio": "09:00",
    "horaFim": "11:00",
    "categoria": "estudos",
    "status": "pendente",
    "ativarLembrete": true,
    "antecedencia": "30",
    "canalAlerta": "navegador"
  }'
```

**Resposta (`201 Created`):**
```json
{
  "titulo": "Estudar API REST",
  "descricao": "Testar endpoints da Etapa 06",
  "data": "2026-11-20",
  "horaInicio": "09:00",
  "horaFim": "11:00",
  "categoria": "estudos",
  "status": "pendente",
  "ativarLembrete": true,
  "antecedencia": "30",
  "canalAlerta": "navegador",
  "id": "1732060800123"
}
```

---

### 5.4. Atualização de Atividade (`PUT /api/atividades/:id`)

**Requisição:**
```bash
curl -X PUT http://localhost:3000/api/atividades/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Revisão de Desenvolvimento Web (Concluída)",
    "descricao": "API REST validada com sucesso",
    "data": "2026-11-20",
    "horaInicio": "14:00",
    "horaFim": "16:00",
    "categoria": "estudos",
    "status": "concluido",
    "ativarLembrete": false,
    "antecedencia": "15",
    "canalAlerta": "navegador"
  }'
```

**Resposta (`200 OK`):**
```json
{
  "id": "1",
  "titulo": "Revisão de Desenvolvimento Web (Concluída)",
  "descricao": "API REST validada com sucesso",
  "data": "2026-11-20",
  "horaInicio": "14:00",
  "horaFim": "16:00",
  "categoria": "estudos",
  "categoriaRotulo": "Estudos",
  "status": "concluido",
  "statusRotulo": "Concluído",
  "ativarLembrete": false,
  "antecedencia": "15",
  "canalAlerta": "navegador"
}
```

---

### 5.5. Exclusão de Atividade (`DELETE /api/atividades/:id`)

**Requisição:**
```bash
curl -X DELETE http://localhost:3000/api/atividades/1
```

**Resposta (`200 OK`):**
```json
{
  "mensagem": "Atividade excluída com sucesso.",
  "atividade": {
    "id": "1",
    "titulo": "Revisão de Desenvolvimento Web (Concluída)",
    "descricao": "API REST validada com sucesso",
    "data": "2026-11-20",
    "horaInicio": "14:00",
    "horaFim": "16:00",
    "categoria": "estudos",
    "categoriaRotulo": "Estudos",
    "status": "concluido",
    "statusRotulo": "Concluído",
    "ativarLembrete": false,
    "antecedencia": "15",
    "canalAlerta": "navegador"
  }
}
```

---

### 5.6. Exemplos de Respostas de Erro Padronizadas

**Erro de Validação (`400 Bad Request`) — envio de corpo vazio `{}` ou horário inválido:**
```json
{
  "erro": "Dados inválidos.",
  "detalhes": [
    "O título é obrigatório.",
    "A data é obrigatória.",
    "Os horários de início e fim são obrigatórios.",
    "A categoria é obrigatória."
  ]
}
```

**Erro de Sintaxe JSON (`400 Bad Request`) — corpo da requisição malformado:**
```json
{
  "erro": "JSON inválido no corpo da requisição."
}
```

**Recurso Não Encontrado (`404 Not Found`) — consulta, edição ou exclusão de ID inexistente:**
```json
{
  "erro": "Atividade não encontrada."
}
```

**Rota Inexistente (`404 Not Found`):**
```json
{
  "erro": "Rota não encontrada."
}
```

---

## 6. Testes Automatizados / Coleção de Requisições

Para testar os endpoints sem depender da interface web, utilize um dos artefatos disponíveis na pasta `docs/`:

1. **Via VS Code (Extensão REST Client):**
   * Abra o arquivo `docs/requisicoes.http` no VS Code (com a extensão **REST Client** instalada) e clique em **`Send Request`** acima de cada bloco HTTP (`GET`, `POST`, `PUT`, `DELETE` e teste de erro `400`).
2. **Via Postman ou Insomnia:**
   * Importe o arquivo `docs/EasySched.postman_collection.json` e execute as requisições configuradas para `http://localhost:3000/api/atividades`.

---

## 7. Instruções para Execução Local

1. **Pré-requisito:** Ter o **Node.js (v18+ ou LTS)** instalado.
2. **Iniciar o servidor back-end:**
   ```bash
   cd server
   npm install
   npm start
   ```
   O console exibirá: `API rodando em http://localhost:3000/api/atividades`.
3. **Abrir o front-end:**
   * Com o servidor ativo na porta `3000`, abra `client/principal.html` através da extensão **Live Server** no VS Code ou execute `npx serve client -l 5500` na raiz do projeto e acesse `http://localhost:5500/principal.html`.