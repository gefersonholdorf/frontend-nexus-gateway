# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Projeto

Sistema corporativo de intranet e gestão operacional chamado Nexus Gateway. O frontend concentra dashboards, gestão de usuários e permissões, governança documental, operações e integrações com sistemas internos e externos.

## Stack

- React 19 + TypeScript, Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui-inspired components (`src/components/ui`, `components.json`)
- React Router v7 (`react-router`, `<Routes>` declarativo em `src/main.tsx`)
- TanStack Query v5 para estado de servidor, Context API para estado de sessão/UI
- Zod + react-hook-form para formulários
- Lucide React (ícones), Sonner (toasts)
- Recharts, XYFlow, React PDF / `pdfjs-dist`, `docx-preview`

## Comandos

```bash
npm run dev       # Vite em modo dev
npm run build     # tsc -b (type-check) seguido de vite build
npm run lint      # eslint .
npm run preview   # serve o build de produção localmente
```

Não há suíte de testes configurada (sem script `test`, sem Jest/Vitest).

## Duas gerações de backend — leia antes de integrar dados

O projeto está em transição entre dois backends, ambos ativos ao mesmo tempo:

- **Legado (`VITE_API_URL`)**: consumido via `fetch` direto, espalhado em `src/api/<dominio>`, `src/pages`, `src/components`. Cobre documentos, campanhas, calendário, GLPI/Jira, mascaramento, perfis, backups, reports. **A tela de login atual (`/`, `src/pages/login.tsx`) ainda usa este backend** (`POST {VITE_API_URL}/login`).
- **Novo (`VITE_API_URL_V2`)**: consumido exclusivamente via `ApiClient` (`src/lib/api/api-client.ts`) + `useApiClient()`. É o padrão para tudo em `src/modules/*`. Já existem hooks V2 prontos (`useLogin` → `POST /auth/login`, `useMe` → `GET /me`) mas **`useLogin` não está conectado à tela de login em uso** — é código para o novo fluxo de auth ainda não finalizado.

Não misture os dois em uma mesma feature nova. Módulos novos usam `ApiClient`/V2. Ver [docs/architecture/api-integration.md](docs/architecture/api-integration.md).

## Arquitetura (resumo — detalhes em docs/architecture/)

Híbrida em migração ativa: módulos novos em `src/modules/<dominio>/{hooks,components,pages}` (hoje só `audit` e `auth` existem) convivem com páginas legado em `src/pages` e chamadas antigas em `src/api/<dominio>`. Código novo segue o padrão de `src/modules`.

Shell em [src/main.tsx](src/main.tsx): `QueryClientProvider` → `BrowserRouter` → `ThemeProvider` → `UserProvider` → `LoginExpiredProvider` → `PermissionProvider` → `CampaignActiveProvider` → `RootLayout` → `<Routes>`. Alias `@/*` → `src/*`.

**Estado atual do módulo Core**: `src/main.tsx` já importa páginas de `src/modules/core/*`, mas esse diretório **não existe no disco** — a implementação antiga (`src/modules/{users,rbac,modules,integrations,providers}`) foi removida para reconstrução seguindo a spec de 7 etapas mockadas. Ver [docs/architecture/core-module-roadmap.md](docs/architecture/core-module-roadmap.md) antes de tocar em qualquer rota `/core/*`. Build está quebrado até essas páginas serem recriadas.

Documentação completa:
- [docs/architecture/overview.md](docs/architecture/overview.md) — estrutura de diretórios, fluxo de providers
- [docs/architecture/api-integration.md](docs/architecture/api-integration.md) — ApiClient, endpoints, query keys
- [docs/architecture/auth-and-rbac.md](docs/architecture/auth-and-rbac.md) — sessão, permissões, `Can`/`RouteGuard`
- [docs/architecture/routing.md](docs/architecture/routing.md) — rotas, guards, layouts, menu
- [docs/architecture/core-module-roadmap.md](docs/architecture/core-module-roadmap.md) — spec das 7 etapas do módulo Core
- [docs/standards/](docs/standards/) — convenções de código, formulários, data-fetching, nomenclatura

## Regras para futuros agentes

- Antes de gerar código, ler os docs relevantes em `docs/architecture/` e `docs/standards/`.
- Respeitar arquitetura existente; seguir o padrão de `src/modules` para código novo, não o de `src/pages`/`src/api` legado.
- Não criar novas convenções sem seguir o padrão atual.
- Reutilizar componentes existentes em `src/components/ui`; não criar novos se houver equivalente.
- Seguir tipagens já utilizadas (inclusive o prefixo `cd_`/`ds_`/`fl_` dos payloads vindos do backend V2 — ver [docs/standards/naming-conventions.md](docs/standards/naming-conventions.md)).
- Seguir estratégia atual de gerenciamento de estado (Context API + TanStack Query; sem Redux/Zustand).
- Preferir consistência ao invés de criar novas abordagens.
- Antes de migrar uma área legado (`src/pages`/`src/api`) para `src/modules`, confirme com o usuário — não é automático.
- Para tasks de domínio (Core, Documentos, Integrações, Inovação), consulte os subagentes em `.claude/agents/` e os skills em `.claude/skills/` antes de improvisar um scaffold novo.
