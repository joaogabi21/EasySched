#### **1\. Nome da Aplicação**

EasySched

#### **2\. Descrição do Problema**

Estudantes e profissionais autônomos/freelancers frequentemente lidam com rotinas dinâmicas e fragmentadas. A falta de uma ferramenta simples para mapear e visualizar compromissos por blocos de tempo e a ausência de alertas prévios personalizados resultam em sobreposição de horários, perda de prazos acadêmicos/profissionais e má gestão da carga horária semanal.

#### **3\. Público-Alvo**

* **Estudantes** que precisam planejar grades de disciplinas, horários de estudo e entregas de trabalhos.  
* **Profissionais e Freelancers** que necessitam organizar atendimentos, reuniões e blocos de trabalho focado.  
* **Pessoas organizando rotinas pessoais** (treinos, hábitos e compromissos gerais).

#### **4\. Objetivo Principal** 

Prover uma plataforma web para criação, visualização e gerenciamento de cronogramas personalizados por blocos de tempo, permitindo categorizar atividades, detectar choque de horários e acompanhar a execução da rotina.

#### **5\. Funcionalidades** 

* **Cadastro e Gestão de Blocos de Tempo:** Criação de atividades definindo horário de início, término, título e descrição.  
* **Categorização e Identificação Visual:** Atribuição de cores e tags às atividades (ex: *Estudo*, *Trabalho*, *Lazer*, *Saúde*).  
* **Validação e Alerta de Conflitos:** Identificação automática no sistema quando duas atividades forem agendadas no mesmo intervalo de tempo.  
* **Controle de Status e Conclusão:** Marcação de atividades como *Pendente*, *Em Andamento* ou *Concluída* (estilo *check-in*).  
* **Sistema de Lembretes e Notificações Personalizadas:** Permite que o usuário opte por ser avisado sobre uma atividade específica com um tempo de antecedência configurável. 

#### **6\. Entidades / Conceitos Importantes** 

* **Usuário:** Dono da conta e do cronograma.  
* **Atividade / Compromisso:** Bloco de tempo contendo título, horário de início/fim, categoria, status e parâmetros do lembrete.  
* **Categoria:** Rótulo de classificação (nome, cor e descrição) usado para agrupar e filtrar os compromissos.  
  


#### **7\. Descrição das Telas / Interfaces**

* **Dashboard do Cronograma (Grade Semanal/Diária):** Interface principal com a grade de horários e um painel/toast visual de alertas pendentes ou disparados no momento.  
* **Formulário / Modal de Atividade:** Tela simples para criar/editar um compromisso (campos para data, hora início/fim, categoria e notas), incluindo opções para ativar os alertas e selecionar a antecedência do aviso.  
* **Painel de Categorias e Métricas:** Tela para gerenciar as categorias cadastradas e visualizar um resumo de tempo alocado por categoria (ex: quantas horas na semana foram dedicadas ao estudo).

#### **8\. Operações** 

* **Inserir Atividade (Create):** Registrar um bloco de tempo validando se não há choque com outro evento existente no mesmo intervalo.  
* **Listar Atividades por Período (Read/Query):** Recuperar todos os compromissos de um determinado dia ou semana.  
* **Atualizar Horário/Status (Update):** Alterar os detalhes de um compromisso ou marcá-lo como concluído.  
* **Remover Atividade (Delete):** Excluir um bloco de tempo da grade.  
* **Verificar e Disparar Lembretes Pendentes (Logic/Query):** Consulta no sistema quais compromissos do usuário possuem alerta ativo e estão na janela de tempo de antecedência, emitindo a notificação ao cliente. 

#### **9\. Tecnologias para cliente**

* HTML5, CSS3 e JavaScript 

#### **10\. Tecnologias para servidor**

* Python com FastAPI utilizando a biblioteca APScheduler.

#### **11\. Tecnologia de persistência**

* Banco de dados relacional PostgreSQL.

#### 

#### **12\. Um diagrama com a visão geral** 

\+-------------------------------------------------------+  
|                    CLIENTE (NAVEGADOR)                	     |  
|  \- HTML5 / CSS / JavaScript                           		     |  
|  \- Visões: Grade Semanal, Form de Atividade, Métricas |  
\+---------------------------+---------------------------+  
 |  
 Requisições HTTP / JSON (API REST)  
 |  
\+---------------------------v---------------------------+  
|                    SERVIDOR (BACKEND)                 |  
|  \- Python (FastAPI) 			                 |  
|  \- Lógica de Validação de Conflito de Horário         |  
|  \- Cálculo de Horas por Categoria                     |  
\+---------------------------+---------------------------+  
 |  
     Consultas SQL / ORM  
  |  
\+---------------------------v---------------------------+  
|               BANCO DE DADOS (PERSISTÊNCIA)           |  
|    \- PostgreSQL                               			|  
|  \- Tabelas: Usuarios, Atividades, Categorias          |  
\+-------------------------------------------------------+  
