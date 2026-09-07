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
/systems
/services
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

Todas as páginas `/core/*` são importadas de `src/modules/core/pages/*.tsx`, diretório que **não existe hoje no disco** — ver [core-module-roadmap.md](core-module-roadmap.md). O antigo conjunto de rotas top-level `/users`, `/roles`, `/permissions`, `/modules`, `/modules/:id`, `/integrations`, `/audits` (implementado em `src/modules/{users,rbac,modules,integrations}`, commit `863b840`) foi substituído por esse namespace `/core/*` único.

## Layouts

- `RootLayout` (`src/layout.tsx`): topo da árvore, só aplica `TooltipProvider`.
- `LayoutPages` (`src/layout-pages.tsx`): shell interno — sidebar + área principal com `<Outlet />`. Usado por toda rota protegida.

## Guards

- `ProtectedRoute` (`src/protected-router.tsx`): guarda de autenticação de toda a árvore protegida (`useUser().isAuthenticated`). Ver [auth-and-rbac.md](auth-and-rbac.md).
- `RouteGuard` (`src/modules/auth/components/route-guard.tsx`): guarda por permissão, aplicada manualmente dentro de uma página/seção — não há um mapeamento centralizado rota → permissão em `main.tsx`.

## Menu lateral

Definido em `src/components/menu/sidebar-module.tsx` como array de grupos (`sidebarModules: SidebarModule[]`), cada item com `label`, `path`, `icon` (lucide), `profiles: string[]` (controla visibilidade) e `isBlocked?: boolean`. Grupos atuais: **Geral** (Página Inicial, Campanhas), **Governança** (Organograma, Documentos ISO), **Infraestrutura** (Sistemas, Serviços — Servidores/IP Map comentados), **Operações** (Central de Operações, Central de Segurança, Mascaramento — Backups/Restores comentado), **Administração** (Usuários, Módulos, Integrações, Auditoria, Perfis, Permissões — todos apontando para `/core/*`, restritos a `Administrador`).

Ao adicionar uma rota nova que deve aparecer no menu, edite este arquivo seguindo o mesmo formato (não crie um segundo arquivo de configuração de menu).

## Observações

- Rotas comentadas em `main.tsx`/`sidebar-module.tsx` (`/backups`, `/servers` parcial, `/ipmap` bloqueado) indicam funcionalidade parcialmente implementada — confirme com o usuário antes de reativá-las ou apagá-las.
- Autorização por rota não é centralizada; cada página decide internamente com `Can`/`RouteGuard` o que exibir.
