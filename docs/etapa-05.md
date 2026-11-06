# **RELATÓRIO TÉCNICO DE VALIDAÇÃO – ETAPA 05**

## **Modularização e Comunicação Assíncrona**

**Instituição:** Pontifícia Universidade Católica de Goiás 

**Curso:** Engenharia da Computação

**Aluno:** João Gabriel Santos e Silva

**Projeto:** EasySched

**Repositório GitHub:** `joaogabi21/EasySched`

**Serviço Mock de API:** MockAPI.io (`/api/v1/atividades`)

### **1\. Visão Geral e Objetivos**

Este documento apresenta a comprovação técnica dos requisitos atendidos na **Etapa 05** do projeto **EasySched**. A aplicação evoluiu de um modelo de persistência síncrono local (`localStorage`) para uma arquitetura moderna baseada em **Módulos ES6** e **comunicação HTTP assíncrona** com serviço remoto via **Fetch API** e tratamento de estados de interface.

### **2\. Arquitetura Modular** 

O código-fonte foi modularizado para desacoplar a camada de comunicação com o servidor da camada de apresentação e manipulação do DOM.

* **`js/api.js`**: Módulo centralizador de serviços assíncronos. Exporta funções isoladas para operações HTTP.  
* **`js/atividade.js`**: Módulo responsável pela captura, validação condicional e submissão assíncrona do formulário de cadastro e edição.  
* **`js/principal.js`**: Módulo de renderização dinâmica do cronograma e tratamento dos eventos dos cards.  
* **`js/relatorio.js`**: Módulo de análise e cálculo de métricas temporais e por categoria.  
* **Inclusão no HTML**: Utilização do atributo `type="module"` nas tags `<script>` dos arquivos HTML (`atividade.html`, `principal.html`, `relatorio.html`).

### **3\. Serviço Assíncrono e Integração com API** 

A comunicação HTTP utiliza a **Fetch API** nativa com padrão **`async/await`** e consumo de **Promises**. Os dados são persistidos no serviço MockAPI.io (`[https://6aed1e42fc3b911e6fd5f00e.mockapi.io/api/v1/atividades](https://6aed1e42fc3b911e6fd5f00e.mockapi.io/api/v1/atividades)`).

JavaScript

```
// Exemplo da camada de serviço assíncrono (js/api.js)
const API_BASE_URL = 'https://6aed1e42fc3b911e6fd5f00e.mockapi.io/api/v1/atividades';

export async function createAtividadeAPI(novaAtividade) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaAtividade)
  });
  if (!response.ok) {
    throw new Error(`Erro ao cadastrar atividade (${response.status})`);
  }
  return await response.json();
}
```

### **4\. Demonstração das Operações CRUD**

A aplicação suporta as operações assíncronas do ciclo de vida das tarefas:

1. **Consulta (GET):** A função `fetchAtividadesAPI()` obtém a lista de tarefas cadastradas no servidor para alimentar o cronograma e os relatórios.  
2. **Inclusão (POST):** A função `createAtividadeAPI()` envia objetos JSON gerados no formulário de cadastro, retornando status `201 Created`.  
3. **Edição (PUT):** A função `updateAtividadeAPI()` detecta o parâmetro `?id=` na URL e envia as alterações do formulário para o registro correspondente no servidor.  
4. **Exclusão (DELETE):** A função `deleteAtividadeAPI()` remove o registro remoto ao acionar o botão de exclusão no card.

### **5\. Tratamento de Estados da Interface** 

Para garantir usabilidade e resiliência, a interface reage a três estados distintos:

#### **A. Estado de Carregamento (*Loading*)**

Durante a execução de operações assíncronas, o botão de submissão é temporariamente desabilitado e um banner informativo azul é injetado no DOM via `exibirLoading()`:

> `⏳ Aguarde: Enviando alterações para o servidor...`

#### **B. Estado de Sucesso**

Após a resolução da Promise sem exceções, a interface exibe um banner de confirmação verde via `exibirSucesso()`, limpa os campos com `form.reset()` e redireciona o usuário:

> `Sucesso! Atividade cadastrada com sucesso! Redirecionando...`

#### **C. Estado de Erro**

Caso ocorra uma falha de conexão (ex: modo offline ou indisponibilidade do servidor), o bloco `try...catch` captura a exceção e invoca `exibirErros()`, apresentando um banner vermelho com mensagem descritiva sem interromper o script:

> `Por favor, corrija os erros abaixo: Erro de Comunicação: Falha ao conectar com o serviço.`