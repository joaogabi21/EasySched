# **EasySched**

**Gestão Integrada de Cronogramas e Lembretes**

Aplicação Web para gerenciamento e análise de rotinas pessoais e profissionais organizadas por blocos de tempo.

**Status:** Projeto em desenvolvimento

## **Sobre o projeto**

O **EasySched** tem como objetivo auxiliar estudantes, profissionais autônomos e freelancers a organizar e acompanhar suas atividades diárias e semanais.

A aplicação permitirá registrar compromissos em blocos de tempo, categorizar tarefas e configurar alertas ativos para evitar esquecimentos e conflitos de agenda.

A partir das informações registradas, o sistema deverá apresentar:

* visualização da rotina em grade diária e semanal;  
* validação e alertas de choques de horário;  
* sistema de notificações prévias para compromissos prioritários;  
* status de execução das atividades (*Pendente*, *Em Andamento*, *Concluído*);  
* relatórios sobre a distribuição do tempo por categoria.

O projeto será desenvolvido de forma incremental ao longo da disciplina.

## **Problema**

À medida que a rotina de um estudante ou profissional autônomo se torna mais dinâmica, torna-se difícil manter o controle sobre prazos, reuniões e horários de estudo.

A ausência de alertas ativos e a gestão descentralizada provocam sobreposição acidental de compromissos no mesmo horário, esquecimento de tarefas importantes e falta de clareza sobre quantas horas são dedicadas a cada área da vida.

O EasySched pretende centralizar essas informações e transformá-las em uma visão organizada do tempo do usuário.

## **Objetivo**

Permitir que o usuário planeje seus compromissos em blocos de tempo, configure lembretes personalizados e acompanhe a execução de sua rotina sem sobreposição de agenda.

O sistema também deverá disponibilizar relatórios simples que auxiliem o usuário na análise da sua produtividade e distribuição de tempo.

O EasySched é uma ferramenta de apoio à organização pessoal. O cumprimento de prazos e compromissos depende do acompanhamento do próprio usuário.

## **Principais funcionalidades**

### **Atividades e Compromissos**

* Cadastro de compromissos com data e horários de início/fim;  
* Consulta e filtragem de tarefas;  
* Edição de compromissos;  
* Exclusão de atividades;  
* Marcação de status (*Pendente*, *Em Andamento*, *Concluído*).

### **Cronograma**

* Visualização em grade diária (linha do tempo) e semanal;  
* Categorização visual por cores e tags (*Estudos*, *Trabalho*, *Saúde*, *Lazer*);  
* Detecção e alerta visual de conflito de horários.

### **Lembretes e Notificações**

* Configuração de avisos prévios por compromisso;  
* Seleção de tempo de antecedência;  
* Disparo de alertas nativos via *Web Notifications API* ou avisos na interface.

### **Relatórios**

* Soma de horas alocadas por categoria;  
* Percentual de tempo dedicado a cada área na semana;  
* Resumo de atividades concluídas versus pendentes.

## **Domínio**

Os principais conceitos do sistema são:

Usuário  
   │  
   └── possui  
          │  
          ▼  
      Cronograma  
          │  
          ├── contém ──► Categorias  
          │  
          └── contém  
                 │  
                 ▼  
              Atividades  
                 │  
                 └── gera  
                        │  
                        ▼  
                     Lembretes

### **Entidades principais**

* **Usuário** — pessoa que utiliza o sistema e gerencia sua agenda.  
* **Atividade / Compromisso** — bloco de tempo com horário de início, fim, data e status.  
* **Categoria** — rótulo temático (com nome e cor) para agrupar e filtrar atividades.  
* **Lembrete** — configuração de alerta associado a uma atividade específica.  
* **Cronograma** — visão consolidada dos blocos de tempo do usuário.

## **Tecnologias**

### **Front-end**

Tecnologias inicialmente previstas:

* HTML5;  
* CSS3;  
* JavaScript;  
* Web Notifications API.

### **Back-end**

Tecnologias inicialmente previstas:

* Python (FastAPI);  
* Módulo de agendamento de tarefas (APScheduler);  
* API REST;  
* JSON.

### **Banco de dados**

Será utilizado um banco de dados relacional.

Será utilizado **SQLite** em ambiente de desenvolvimento local e **PostgreSQL** para ambiente de produção.

## **Arquitetura inicial**

A visão inicial da aplicação é:
  
┌──────────────────────────────────────┐  
│              Front-end               │  
│                                      │  
│   HTML5 / CSS / JavaScript (ES6+)    │  
│       Web Notifications API          │  
└──────────────────┬───────────────────┘  
                   │  
                   │ HTTP / JSON  
                   ▼  
┌──────────────────────────────────────┐  
│               API REST               │  
│                                      │  
│    Python (Flask) / Node.js          │  
└──────────────────┬───────────────────┘  
                   │  
                   ▼  
┌──────────────────────────────────────┐  
│          Regras de negócio           │  
│                                      │  
│  Validação de Choque de Horários     │  
│  Gerenciador de Lembretes (Cron)     │  
│  Cálculo de Horas por Categoria      │  
└──────────────────┬───────────────────┘  
                   │  
                   ▼  
┌──────────────────────────────────────┐  
│            Banco de dados            │  
└──────────────────────────────────────┘

A arquitetura será refinada conforme o projeto evoluir.

## **Estrutura prevista do projeto**

A estrutura poderá evoluir ao longo das etapas. Inicialmente, será adotada uma organização semelhante a:

EasySched/  
│  
├── docs/  
│   ├── proposta.md  
│  
├── client/  
│  
├── server/  
│  
├── README.md  
│  
└── .gitignore

A estrutura definitiva será definida conforme as tecnologias e decisões arquitetônicas adotadas durante o desenvolvimento.

## **Escopo inicial**

### **Incluído**

* cadastro e gestão de atividades;  
* categorização com cores personalizadas;  
* validação automática de choques de horário;  
* configuração de lembretes com antecedência;  
* exibição em linha do tempo diária e grade semanal;  
* alteração do status de conclusão das tarefas;  
* relatório de distribuição de tempo por categoria.

### **Não incluído inicialmente**

* integração com calendários externos (Google Calendar, Outlook);  
* envio de notificações por SMS ou WhatsApp;  
* sincronização push mobile em segundo plano sem o navegador aberto;  
* inteligência artificial para montagem automática de rotinas;  
* compartilhamento de agendas entre múltiplos usuários em tempo real.

## **Versionamento**

O projeto utilizará o Git durante todo o desenvolvimento.

As versões das etapas serão identificadas preferencialmente por tags:

Plaintext  
etapa-01  
etapa-02  
etapa-03  
etapa-04  
etapa-05  
etapa-06  
etapa-07  
etapa-08  
etapa-09  
etapa-10  
final

## **Documentação**

A documentação do projeto será mantida no diretório:

Plaintext  
/docs

A documentação inicial inclui:

Plaintext  
/docs/proposta.md

Novos documentos serão adicionados conforme as etapas do projeto forem concluídas.

## **Execução**

As instruções de instalação e execução serão adicionadas e atualizadas conforme as tecnologias forem implementadas.

A versão inicial do projeto ainda não possui uma aplicação executável completa.

Quando o front-end e o back-end forem implementados, esta seção deverá conter:

1. pré-requisitos;  
2. instalação das dependências;  
3. configuração das variáveis de ambiente;  
4. configuração do banco de dados;  
5. inicialização do servidor;  
6. inicialização do cliente;  
7. instruções para utilização da aplicação.

## **Testes**

Os procedimentos e evidências de testes serão documentados conforme as funcionalidades forem implementadas.

A aplicação deverá evoluir para possuir mecanismos que permitam verificar principalmente:

* validação de conflitos de horários na agenda;  
* disparo correto das notificações nos prazos configurados;  
* cálculo de relatórios e agregação de tempo por categoria;  
* operações da API;  
* persistência dos dados no banco;  
* integração entre front-end e back-end.

## **Decisões e limitações**

Algumas decisões ainda serão tomadas durante o desenvolvimento, incluindo:

* estratégia final para checagem contínua de lembretes no servidor;  
* mecanismo definitivo de permissões no navegador para a *Web Notifications API*;  
* biblioteca de renderização da grade temporal no front-end;  
* mecanismo de autenticação de usuários;  
* arquitetura definitiva do servidor.

Essas decisões deverão ser registradas na documentação do projeto conforme forem tomadas.

## **Responsabilidade sobre as informações**

O EasySched tem finalidade exclusivamente educacional e de suporte à organização pessoal do tempo do usuário.

A aplicação fornece alertas e relatórios com base nas informações cadastradas pelo próprio usuário, não se responsabilizando por eventuais imprevistos, perdas de prazos ou compromissos não realizados.

## **Licença**

A licença do projeto será definida posteriormente.

