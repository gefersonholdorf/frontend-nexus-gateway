# Rotas e navegação

Tudo é declarado em um único arquivo, `src/main.tsx`, com `BrowserRouter`/`Routes` do `react-router` v7. Não há roteamento aninhado por módulo nem lazy loading de rotas.

## Rotas públicas

- `/` → `LoginPage` (`src/pages/login.tsx`)
- `/403` → `ForbiddenPage`

## Rotas protegidas (dentro de `ProtectedRoute` → `LayoutPages`)

```
/welcome
/ipmap
/security-center
/hub-services
/calendar
/servers
/comunications
/documents
/documents/profiles
/documents/create
/documents/configurations
/documents/reviews
/documents/reviews/:id
/documents/events
/core                    → CoreHomePage
/core/users              → CoreUsersPage
/core/roles              → CoreRolesPage
/core/permissions        → CorePermissionsPage
/core/modules            → CoreModulesPage
/core/modules/:id        → CoreModuleDetailPage
/core/integrations       → CoreIntegrationsPage
/core/audit              → CoreAuditPage
/gestao-documentos                                  → DocumentosPage
/gestao-documentos/revisoes                         → RevisoesPage
/gestao-documentos/versoes                          → VersoesPage
/gestao-documentos/:id                              → DocumentoDetailPage
/gestao-documentos/aprovacoes-pendentes             → AprovacoesPendentesPage (RouteGuard: aprovacao.avaliar)
/gestao-documentos/configuracoes/categorias         → CategoriasPage (RouteGuard: configuracoes.gerenciar)
/gestao-documentos/configuracoes/areas              → AreasPage (RouteGuard: configuracoes.gerenciar)
/gestao-documentos/configuracoes/fluxos             → FluxosPage (RouteGuard: configuracoes.gerenciar)
/gestao-documentos/configuracoes/periodo-revisao    → PeriodoRevisaoPage (RouteGuard: configuracoes.gerenciar)
/profiles
/profiles/:id
/profiles/create
/organograma
/masking
/tickets-validations-pendings
/operations
/tickets
/campaigns
```

Não existiam rotas `/systems`/`/services` no código real no momento desta revisão — a antiga entrada de menu equivalente é hoje `/hub-services` ("Painel de Sistemas", `src/modules/hub-services`).

Todas as páginas `/core/*` são importadas de `src/modules/core/pages/*.tsx`, que está implementado e em produção — ver [core-module-roadmap.md](core-module-roadmap.md). O antigo conjunto de rotas top-level `/users`, `/roles`, `/permissions`, `/modules`, `/modules/:id`, `/integrations`, `/audits` (implementado em `src/modules/{users,rbac,modules,integrations}`, commit `863b840`) foi substituído por esse namespace `/core/*` único.

`/gestao-documentos/*` é o módulo "Gestão de Documentos" (`src/modules/documentos`), independente do legado "Documentos ISO" em `/documents` (intocado). Visibilidade de documento/revisão/versão é resolvida pelo backend por role do usuário (RF004), não por permission — por isso as telas de navegação/leitura (`/gestao-documentos`, `/revisoes`, `/versoes`, `/:id`) usam só `ProtectedRoute` (autenticação), sem `RouteGuard`; as ações administrativas e a fila de aprovação (config e aprovações pendentes) ficam atrás de `RouteGuard`, e ações pontuais dentro das telas de leitura usam `<Can permission="...">` (ver [auth-and-rbac.md](auth-and-rbac.md)).

## Layouts

- `RootLayout` (`src/layout.tsx`): topo da árvore, só aplica `TooltipProvider`.
- `LayoutPages` (`src/layout-pages.tsx`): shell interno — sidebar + área principal com `<Outlet />`. Usado por toda rota protegida.

## Guards

- `ProtectedRoute` (`src/protected-router.tsx`): guarda de autenticação de toda a árvore protegida (`useUser().isAuthenticated`). Ver [auth-and-rbac.md](auth-and-rbac.md).
- `RouteGuard` (`src/modules/auth/components/route-guard.tsx`): guarda por permissão. Na maioria das rotas ainda é aplicada manualmente dentro de uma página/seção — não há mapeamento centralizado rota → permissão. **Exceção**: as rotas `/gestao-documentos/configuracoes/*` e `/gestao-documentos/aprovacoes-pendentes` são as primeiras a envolver o `element` da rota diretamente com `<RouteGuard permission="...">` em `main.tsx` (ver bloco `Route` correspondente) — primeiro caso de guarda centralizada por rota no projeto.

## Menu lateral

Definido em `src/components/menu/sidebar-module.tsx` como array de grupos (`sidebarModules: SidebarModule[]`), cada item com `label`, `path`, `icon` (lucide), `profiles: string[]` (controla visibilidade) e `isBlocked?: boolean`. Um item também pode ter `permission?: string` opcional, que soma um filtro de visibilidade via `useHasPermission(permission)` (permissões reais de `/me`) além de `profiles` — os dois se combinam (o item só aparece se passar em ambos). Já usado pelo grupo "Administração" (Core) e por "Painel de Sistemas"; o módulo "Gestão de Documentos" estende esse uso para além da Administração (itens de configuração e aprovações pendentes).

Grupos atuais: **Geral** (Página Inicial, Campanhas), **Governança** (Organograma, Documentos ISO — legado, `/documents`), **Gestão de Documentos** (Documentos, Revisões, Versões, Aprovações Pendentes, Categorias, Áreas, Fluxos de Aprovação, Período de Revisão — módulo novo `/gestao-documentos/*`, grupo próprio e independente de "Governança"), **Infraestrutura** (Painel de Sistemas → `/hub-services`, restrito por `permission: 'hub_services_manage'` — Servidores/IP Map comentados), **Operações** (Central de Operações, Central de Segurança, Mascaramento — Backups/Restores comentado), **Administração** (Usuários, Perfis, Módulos, Integrações, Auditoria — todos apontando para `/core/*`, restritos a `Administrador` e a uma `permission` própria por item).

Ao adicionar uma rota nova que deve aparecer no menu, edite este arquivo seguindo o mesmo formato (não crie um segundo arquivo de configuração de menu).

## Observações

- Rotas comentadas em `main.tsx`/`sidebar-module.tsx` (`/backups`, `/servers` parcial, `/ipmap` bloqueado) indicam funcionalidade parcialmente implementada — confirme com o usuário antes de reativá-las ou apagá-las.
- Autorização por rota não é centralizada, exceto nas rotas `/gestao-documentos/configuracoes/*` e `/gestao-documentos/aprovacoes-pendentes` (ver seção "Guards" acima); nas demais, cada página decide internamente com `Can`/`RouteGuard` o que exibir.
