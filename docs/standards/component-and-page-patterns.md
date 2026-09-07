# Padrões de página e componente

## Anatomia de uma página de listagem

Observado de forma consistente em `src/modules/audit/pages/audit-page.tsx` e nas páginas legado equivalentes:

1. `HeaderPage` no topo — título, descrição, ícone, breadcrumb.
2. Cards quantitativos (resumo estatístico) logo abaixo do header.
3. Filtros acima da tabela (texto, status, data, seleção).
4. Tabela paginada (`TableComponentV2` no legado; a spec do Core define um `DataTable` reutilizável equivalente para `src/modules/core`) com ações por linha.
5. Ações primárias (criar, exportar) em botão no topo/direita da página.
6. Feedback via `Badge` (status), `Tooltip`, `Alert` e `toast` (`sonner`) — nunca `alert()`/`window.confirm()`.

Para telas de card-grid (não tabela) — como Módulos e Integrações na spec do Core — mantenha os mesmos blocos 1–3 e 5–6, trocando o bloco 4 por um grid de cards.

## Modais (criação/edição)

Um arquivo por modal, nomeado `create-<entidade>-modal.tsx` / `edit-<entidade>-modal.tsx`, usando `Dialog` (ação bloqueante) ou `Drawer` (`vaul`, painel lateral) conforme a densidade do formulário. Modais de módulo novo ficam em `src/modules/<dominio>/components/`; no legado aparecem tanto dentro do módulo quanto em `src/components/modals` ou `src/components/<dominio>`.

## Formulários

`react-hook-form` + `zod` (via `@hookform/resolvers`) para formulários com mais de 2-3 campos ou validação não trivial; para casos simples, estado local (`useState`) com validação manual é aceitável e aparece em várias telas legado (ex.: `login.tsx`). Ao adicionar um formulário novo em `src/modules/*`, prefira `react-hook-form` + `zod` — é o padrão que o projeto está migrando para consolidar.

Padrão de campos: `Input`/`Textarea` com label visível, `Select` para status/categoria fechada, `Switch` para toggles booleanos (ex.: ativo/inativo de módulo). Erros de validação aparecem inline no campo; erros de submissão (falha de rede/API) aparecem como `toast.error`; sucesso como `toast.success`.

## Controle de acesso dentro da página

Ações administrativas (criar, editar, excluir, alternar status) são condicionadas com `Can`/`useHasPermission` (ver [docs/architecture/auth-and-rbac.md](../architecture/auth-and-rbac.md)), não com checagem manual de `roles`/`profiles` dentro do componente.

## Reuso — antes de criar um componente novo

Verifique nesta ordem:

1. `src/components/ui` — componente base (Button, Badge, Input, Select, Dialog, Drawer, Switch, Tabs, Table, Pagination, Checkbox, RadioGroup, ScrollArea, Skeleton, Tooltip, DropdownMenu).
2. Componentes de domínio já existentes em `src/components/<dominio>` ou `src/modules/<dominio>/components` que resolvam o mesmo problema (ex.: `HeaderPage`, `TableComponentV2`).
3. Só então crie um componente novo — e coloque-o dentro do módulo que o usa (`src/modules/<dominio>/components`), não em `src/components`, a menos que seja genuinamente reutilizável entre domínios.

## Bibliotecas de apoio já disponíveis (não adicione alternativas)

Gráficos → `recharts`; diagramas de fluxo → `@xyflow/react`; PDF → `@react-pdf/renderer` (geração) / `react-pdf`+`pdfjs-dist` (visualização); Word → `docx-preview`; calendário/data → `react-day-picker` + `date-fns`/`date-fns-tz`; drag-and-drop → `@dnd-kit/*`; carrossel → `embla-carousel-react`; onboarding guiado → `react-joyride`; toasts → `sonner`.
