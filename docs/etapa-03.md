# Documentação da Etapa 03 - Interface Responsiva com CSS

## 1. Interfaces Apresentadas
A presente etapa refere-se à estilização e à implementação de responsividade para as três interfaces do sistema **EasySched**:
1. **Página Principal / Cronograma (`principal.html`):** Apresenta o resumo numérico das atividades do dia, a listagem em cards do cronograma diário com ações e a seção lateral/inferior de próximos lembretes.
2. **Cadastro de Atividade (`atividade.html`):** Formulação visualmente organizada com dois blocos principal e secundário (dados do compromisso e configurações de notificação).
3. **Relatórios e Distribuição (`relatorio.html`):** Exibição de estatísticas semanais utilizando barras de progresso (`<progress>`) e tabelas responsivas com medidores gráficos (`<meter>`).

---

## 2. Viewports Utilizados nas Evidências

Em conformidade com os requisitos da **Etapa 03**, o comportamento visual de cada interface foi homologado nos três *viewports* padronizados:

| Dispositivo | Largura (px) | Altura (px) | Convenção do Arquivo de Evidência |
| :--- | :--- | :--- | :--- |
| **Desktop** | 1440 px | 900 px | `desktop-tela-01.png`, `desktop-tela-02.png`, `desktop-tela-03.png` |
| **Tablet** | 768 px | 1024 px | `tablet-tela-01.png`, `tablet-tela-02.png`, `tablet-tela-03.png` |
| **Smartphone** | 390 px | 844 px | `smartphone-tela-01.png`, `smartphone-tela-02.png`, `smartphone-tela-03.png` |

---

## 3. Breakpoints Utilizados

A estratégia adotada seguiu a abordagem *Mobile-First*, garantindo layout fluido por padrão e refinando a disposição visual através de dois *breakpoints* principais:

1. **`@media (min-width: 768px)` — Breakpoint Intermediário (Tablets e telas médias):**
   - Transiciona a navegação do cabeçalho de empilhamento vertical para linha horizontal (*Flexbox*).
   - Transforma o resumo numérico e a lista de cards de 1 coluna para 2 colunas (*CSS Grid*).
   - Reorganiza o formulário de cadastro em 2 colunas para melhor aproveitamento da largura disponível.
2. **`@media (min-width: 1024px)` — Breakpoint Superior (Desktops e notebooks):**
   - Expande o resumo numérico para 4 colunas em linha.
   - Aplica um layout assimétrico no Dashboard (`principal.html`), posicionando a seção "Próximos Lembretes" em uma coluna lateral fixa à direita do cronograma.
   - Centraliza e limita a largura máxima do formulário para manter o conforto visual e o ritmo de leitura.

---

## 4. Principais Decisões de Responsividade

* **Uso de Flexbox:**
  - Aplicado no cabeçalho (`<header>`) e no menu de navegação (`<nav>`), permitindo alinhamento automático de links e adequação flexível no mobile.
  - Utilizado nos rodapés dos cards de atividade (`<footer>`) para manter os botões de ação organizados e ajustáveis.
  - Aplicado na barra de botões do formulário (`Salvar`, `Limpar`, `Cancelar`), garantindo que ocupem 100% de largura em smartphones e se alinhem à direita em telas maiores.

* **Uso de CSS Grid:**
  - Empregado no Grid de Resumo de Hoje (`1 col` no mobile, `2 cols` no tablet, `4 cols` no desktop).
  - Empregado na listagem de cards do Cronograma Diário.
  - Empregado na estruturação dos campos dentro do `<fieldset>` do formulário.

* **Tratamento de Tabelas Responsivas:**
  - As tabelas de relatórios foram dispostas dentro de um container com `overflow-x: auto`, garantindo que não ocorra quebra de layout (*overflow*) em telas de smartphones de 390px.

* **Espaçamento e Tipografia:**
  - Utilização de variáveis CSS (`:root`) para padronizar margens, *paddings*, sombras e raios de borda, garantindo consistência visual em todas as telas.

---

## 5. Localização dos Arquivos CSS e Evidências

* **Arquivo CSS Responsivo:** `/styles.css` (ou unificado na raiz do projeto e referenciado via `<link rel="stylesheet" href="styles.css">`).
* **Diretório de Evidências Visuais:** `/docs/evidencias/etapa-03/`
