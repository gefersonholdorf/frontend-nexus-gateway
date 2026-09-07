# Visão geral da arquitetura

## Modelo

SPA em React 19 + TypeScript, construída com Vite, em arquitetura **híbrida em migração**:

1. `src/modules/<dominio>/{hooks,components,pages}` — padrão novo, orientado a feature. Hoje existem apenas `audit` e `auth`. É o padrão a seguir para qualquer trabalho novo.
2. `src/pages/` + `src/api/<dominio>/` — padrão legado (páginas monolíticas + hooks com `fetch` direto). Cobre a maior parte das telas hoje em produção (documentos, campanhas, calendário, GLPI, Jira, mascaramento, perfis, backups, reports, servidores).
3. `src/components/` — biblioteca de UI compartilhada, dividida entre `src/components/ui` (base shadcn-like) e componentes de domínio (`src/components/documents`, `src/components/campaigns`, `src/components/tickets`, etc.), muitos ainda acoplados a um domínio legado específico.

Não existe uma migração automática entre os dois padrões: cada domínio é migrado quando alguém decide reescrevê-lo como módulo (é o que está acontecendo agora com o domínio "Core" — ver [core-module-roadmap.md](core-module-roadmap.md)).

## Estrutura de diretórios (estado atual)

```text
src/
├── api/                # hooks de dados legado, fetch direto, por domínio
│   ├── backups/ calendar/ campaigns/ documents/ glpi/ jira/
│   └── maskings/ notifications/ profiles/ reports/ users/
├── assets/
├── components/
│   ├── ui/              # base shadcn-like (Button, Input, Dialog, Table, ...)
│   ├── menu/             # sidebar-module.tsx (definição do menu lateral)
│   ├── documents/ campaigns/ tickets/ jira/ maskings/ ipmap/
│   ├── forms/ modals/ profiles/ reports/ examples/ reui/
│   └── nexus-operations/  users-privileges-servers/
├── config/               # env.ts (leitura de variáveis de ambiente)
├── contexts/             # user-context, theme-context, login-expired, campaign-active
├── data/                 # JSON estático
├── hooks/                # hooks utilitários genéricos (ex.: use-debounce)
├── lib/
│   ├── api/               # api-client.ts, use-api-client.ts, api-error.ts, query-keys.ts
│   └── utils.ts, format-*.ts
├── modules/              # padrão novo — só existem hoje:
│   ├── audit/{hooks,pages}
│   └── auth/{components,hooks}
├── pages/                # telas legado (welcome, systems, services, security-center, ...)
│   └── documents/         # subconjunto de páginas de documentos
├── services/             # websocket.ts
├── tours/                # onboarding guiado (react-joyride)
├── types/
├── index.css             # design tokens (cores, radius, tema claro/escuro)
├── main.tsx              # bootstrap + definição de rotas
├── layout.tsx             # RootLayout (TooltipProvider)
├── layout-pages.tsx        # shell interno (sidebar + Outlet)
├── protected-router.tsx    # guarda de autenticação por rota
└── scroll-to-top.tsx
```

> `src/modules/{users,rbac,modules,integrations,providers}` existiram até o commit `863b840` e foram removidos do disco para reconstrução como `src/modules/core`. Não recrie esses diretórios com o nome antigo — a spec vigente usa `core` como domínio único guarda-chuva (ver [core-module-roadmap.md](core-module-roadmap.md)).

## Fluxo de montagem (`src/main.tsx`)

```
QueryClientProvider
 └─ BrowserRouter
     └─ ThemeProvider
         └─ UserProvider
             └─ LoginExpiredProvider
                 └─ PermissionProvider        (hoje ausente do disco, ver nota abaixo)
                     └─ CampaignActiveProvider
                         └─ RootLayout (TooltipProvider)
                             └─ <Routes>
                                 ├─ "/"    → LoginPage (pública)
                                 ├─ "/403" → ForbiddenPage (pública)
                                 └─ ProtectedRoute
                                     └─ LayoutPages (sidebar + Outlet)
                                         └─ páginas internas
```

`PermissionProvider` (`src/modules/providers/permission-provider.tsx`) também foi removido junto com o módulo Core antigo, mas `src/main.tsx`, `Can` e `RouteGuard` ainda importam dele — build está quebrado até ele (ou um equivalente) ser recriado. Ver [core-module-roadmap.md](core-module-roadmap.md).

## Gerenciamento de estado

| Camada | Mecanismo | Onde |
|---|---|---|
| Sessão do usuário (token, dados básicos) | Context API + `localStorage` | `src/contexts/user-context.tsx` |
| Tema claro/escuro | Context API + `localStorage` | `src/contexts/theme-context.tsx` |
| Sessão expirada (modal 401) | Context API | `src/contexts/login-expired.tsx` |
| Campanha ativa | Context API | `src/contexts/campaign-active.tsx` |
| Permissões RBAC | Context API, alimentado por `useMe()` | `src/modules/providers/permission-provider.tsx` (ausente no momento) |
| Dados de servidor (listas, detalhes, mutações) | TanStack Query | hooks `use-fetch-*`/`use-create-*`/etc. por domínio |

Não há Redux, Zustand ou outra lib de estado global — não introduza uma.

## Design tokens e tema

Definidos em `src/index.css` (Tailwind v4 `@theme`), com paleta clara e escura (`--background`, `--primary: #0C86FA`, `--radius`, etc.) e `components.json` configurando shadcn (`style: radix-vega`, `baseColor: neutral`). `ThemeProvider` alterna a classe `.dark` conforme preferência salva em `localStorage`.
