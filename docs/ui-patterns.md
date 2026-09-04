# Padrões de UI e Design System

## Sistema de design identificado

O frontend utiliza um design system híbrido, combinando:

- Tailwind CSS v4
- shadcn/ui-inspired component library em `src/components/ui`
- tokens visuais customizados em `src/index.css`
- ícones do `lucide-react`
- fontes do `@fontsource-variable/inter`

O sistema visual é centrado em um esquema corporativo de intranet com foco em produtividade e identificação visual empresarial.

## Paleta visual

Os tokens principais definidos em `src/index.css` são:

- Fundo principal: `#F5F7FA` (tema claro), `#111827` (tema escuro)
- Primária: `#0C86FA`
- Texto principal: `#0F172A` / `#F8FAFC`
- Bordas: `#E2E8F0`
- Muted: `#64748B`
- Semânticas: sucesso (`#22C55E`), warning (`#F59E0B`), destrutivo (`#EF4444`)

O projeto também fornece um tema alternativo por `ThemeProvider`:

- `clean`: visual claro
- `dark`: visual escuro

A classe `.dark` do Tailwind é habilitada pela troca de tema em `localStorage`.

## Bibliotecas UI utilizadas

- `@radix-ui` e `radix-ui` para componentes acessíveis e interações complexas
- `lucide-react` para ícones
- `sonner` para toasts
- `vaul` para drawers
- `@xyflow/react` para gráficos de fluxo / diagramas
- `recharts` para gráficos e resumo estatístico
- `react-day-picker` para calendários e seleção de data
- `@react-pdf/renderer` e `react-pdf` para geração e visualização de documentos em PDF
- `docx-preview` para preview de arquivos Word
- `react-joyride` para tour guiado

## Componentes reutilizáveis

A base reutilizável está em `src/components/ui` e inclui:

- `Button`
- `Input`
- `Select`
- `Switch`
- `Badge`
- `Card`
- `Dialog`
- `Drawer`
- `DropdownMenu`
- `Tooltip`
- `Tabs`
- `Table`
- `Pagination`
- `Checkbox`
- `RadioGroup`
- `ScrollArea`
- `Skeleton`

Além disso, há componentes de domínio compartilhados em `src/components`, como:

- `HeaderPage`
- `TableComponentV2`
- `Sidebar` e `MenuComponent`
- `SystemGrid`, `ServiceGrid`, `WelcomeCard`, `SecurityCard`
- `campaigns/*`, `documents/*`, `profiles/*`

## Padrões de páginas

As telas seguem um padrão recorrente:

- Cabeçalho com título, descrição, ícone e breadcrumb
- Resumo estatístico em cards (`summarys`)
- Filtros acima da tabela
- Tabela paginada com ações por linha
- Ações primárias em botão direito ou topo da página
- Feedback visual com `Badge`, `Alert`, `Tooltip` e `toasts`

Exemplo típico:

- `HeaderPage` para padronizar o topo da tela
- `TableComponentV2` para listagens de usuários, módulos, permissões, integração e auditoria
- `Breadcrumb` para navegação contextual
- `Can` ou `useHasPermission` para controlar ações administrativas

## Padrões de formulários

Os formulários usam padrões recorrentes:

- `Input` e `Textarea` com labels visuais e feedback de validação
- `react-hook-form` + `zod` em fluxos mais complexos
- `Select` para status e categorias
- `Switch` para ativação/desativação de módulos e itens configuráveis
- `Button` com ação primária e botões secundários para cancelar
- casos de erro com mensagens visuais e `toast.error`/`toast.success`

Esse padrão aparece em:

- criação de documentos
- criação de campanhas
- criação e edição de usuários
- criação de roles e permissões
- forms de revisão/documentação e perfis

## Padrões de tabelas

O padrão de tabela é bem consolidado:

- colunas definidas como `Column<T>[]`
- render functions para customização de valores
- paginação por offset local ou server-side
- filtros por texto, status e data
- cards de resumo no topo da tabela
- layout consistente com hover, borda, alternância de linhas e ações no menu dropdown

A implementação padrão mais comum está em `TableComponentV2`.

## Padrões de modais

Há uso de modais para ações administrativas:

- criar e editar usuários
- alterar senha
- criar e editar integrações
- criar e editar módulos
- criar/editar documentos e revisões
- criar campanhas e atualizar detalhes

O projeto usa `Dialog`, `Drawer` e componentes dedicados em `src/modules/*/components` ou `src/components/*/modals`.

## Padrões de navegação e menu

- Sidebar lateral com agrupamento por áreas: Geral, Governança, Infraestrutura, Operações, Administração
- Menu horizontal/header para ações rápidas e navegação
- `LayoutPages` encapsula todo o shell principal
- `ProtectedRoute` exige token do usuário para acesso à área protegida

## Observações de UX

- Há forte uso de estados visuais para status `Ativo/Inativo`, `Aprovado/pendente`, `Create/Update/Delete`
- A interface prioriza leitura em dashboards de gestão e visão operacional
- A app usa vários gráficos e cards para sumarizar dados do negócio
- Há suporte a onboarding guiado (`react-joyride`) em alguns fluxos específicos

## Resumo de design

O projeto adota uma interface corporativa moderna, de alta densidade informacional, com foco em:

- administração operacional
- gestão de usuários e permissões
- governança documental
- segurança e operações de TI
- dashboards visuais e informações resumidas

A UI é consistente no uso de cards, badges, variação de status e tabelas com filtros. Apesar da consistência visual, o código ainda mistura padrões clássicos e modernos, especialmente pelo uso de `src/pages` e `src/modules` em paralelo.
