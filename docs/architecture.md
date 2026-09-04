# Arquitetura do Frontend

## Visão geral

Este frontend é uma Single Page Application (SPA) em React 19 + TypeScript, construída com Vite e organizada em camadas por domínio e por responsabilidade. O projeto combina uma base de páginas legado em `src/pages`, um conjunto de módulos mais modernos em `src/modules` e componentes reutilizáveis em `src/components`.

A arquitetura atual segue um modelo híbrido:

- Feature modules para regras de negócio e telas mais estruturadas.
- Páginas de alto nível para fluxos mais antigos ou específicos.
- Context API para estado global do usuário e tema.
- TanStack Query para cache e sincronização de dados do servidor.
- React Router para navegação, autenticação e organização de rotas.

## Estrutura de diretórios

```text
src/
├── api/                       # Funções de integração por domínio e hooks de dados
├── assets/                   # Arquivos estáticos e imagens
├── components/               # Componentes reutilizáveis e widgets de UI
│   ├── menu/
│   ├── forms/
│   ├── profiles/
│   ├── documents/
│   └── ui/
├── config/                   # Configuração e leitura de variáveis de ambiente
├── contexts/                 # Providers globais de autenticação, sessão e tema
├── data/                     # JSON estático usado como base para dados de exemplo
├── hooks/                    # Hooks utilitários gerais
├── layout.tsx                # Layout raiz do app
├── layout-pages.tsx          # Layout principal com sidebar e menu
├── lib/                      # Utilitários e abstrações compartilhadas
│   └── api/
├── modules/                  # Módulos funcionais do sistema
│   ├── audit/
│   ├── auth/
│   ├── integrations/
│   ├── modules/
│   ├── providers/
│   ├── rbac/
│   └── users/
├── pages/                    # Telas e páginas do sistema (estrutura mais legacy)
├── services/                 # Serviços auxiliares (ex.: websocket)
├── tours/                    # Componentes de onboarding guiado
├── types/                    # Tipagens globais e modelos compartilhados
├── index.css                 # Design tokens e tema visual
├── main.tsx                  # Bootstrap da aplicação
├── protected-router.tsx      # Guarda de rota autenticada
├── scroll-to-top.tsx         # Componente de rolagem ao trocar rota
└── vite-env.d.ts
```

## Responsabilidade por diretório

### `src/modules/`

Diretório principal de modularização por domínio. Exibe uma separação funcional em:

- `auth`: autenticação, `useMe`, `useLogin`, guardas e componentes de permissão.
- `users`: gerenciamento de usuários, detalhamento, reset de senha, edição.
- `rbac`: papéis, permissões, atribuição e remoção.
- `modules`: módulos do sistema e associação com permissões/integrations.
- `integrations`: integrações externas e gestão de conectores.
- `audit`: auditoria do sistema e filtros por ação/entidade/usuário.
- `providers`: `PermissionProvider`, principal fornecedor de permissões.

### `src/pages/`

Contém páginas de fluxo governança/operacional e telas que ainda não foram migradas para módulos. Inclui login, welcome, document management, operations center, security center, campaigns, tickets e outros painéis.

### `src/components/`

Base de UI compartilhada. Há componentes de:

- layout: sidebar, menu, header-page, back-component
- tabelas: `table-component`, `table-component-v2`
- formulários: modais e formulários de documentos/perfis/usuários
- dashboards: cards, gráficos, summaries
- UI base: `button`, `badge`, `select`, `switch`, `dialog`, `tooltip`, etc.

### `src/lib/`

Responsável por abstrações transversais:

- `api/` contém client HTTP, query keys e abstração de autenticação.
- `utils.ts` inclui helpers para combinar classes e manipulações utilitárias.

### `src/contexts/`

Armazena estado global do app:

- `user-context.tsx`: usuário autenticado e token.
- `theme-context.tsx`: tema `clean` / `dark`.
- `login-expired.tsx`: modal e flag de sessão expirada.
- `campaign-active.tsx`: controle de campanha ativa.

### `src/api/`

É um conjunto de hooks e funções por domínio que ainda seguem padrões mais legados de fetch direto. Há sobreposição com a abordagem moderna em `src/modules/*/hooks`. Esse diretório é usado para integração com endpoints específicos, como documentos, campanhas, backups, GLPI, Jira, calendário, máscaras e perfis.

## Arquitetura adotada

A arquitetura em uso é uma mistura de:

1. SPA modular por domínio (`src/modules`)
2. Arquitetura orientada a recursos (cada módulo tem `hooks`, `components`, `pages`)
3. Componentização de UI por features e widgets
4. Data fetching via React Query
5. Estado global por contextos de React
6. Autenticação e autorização baseadas em token e permissões

O fluxo geral de renderização é:

- `main.tsx` monta `QueryClientProvider` e `BrowserRouter`
- `RootLayout` aplica `TooltipProvider`
- `UserProvider` habilita o estado do usuário
- `PermissionProvider` carrega permissões do usuário autenticado
- `ProtectedRoute` bloqueia acesso público sem autenticação
- `LayoutPages` renderiza sidebar + menu + área principal
- cada rota monta um componente de page ou module page

## Separação por módulos

Os módulos são separados por objetivo funcional e possuem estrutura semântica consistente:

```text
modules/<dominio>/
├── components/
├── hooks/
├── pages/
└── ...
```

Isso permite:

- manutenção por responsabilidade de negócio
- hooks específicos de consulta e mutação por módulo
- reutilização de componentes sem espalhar lógica nos componentes de tela
- melhor aderência ao padrão de features que a aplicação já adota

## Fluxo de dados

### Autenticação

1. Usuário acessa `/` e preenche email/senha.
2. O login pode ser feito por `fetch` direto em `LoginPage` ou por `useLogin` do módulo auth.
3. O token recebido é armazenado em `localStorage` pelo `UserProvider`.
4. O `PermissionProvider` dispara `useMe()` para buscar usuário, roles e permissões.
5. Cada tela usa `useHasPermission` / `Can` para esconder ou exibir ações.

### Requisições HTTP

- `ApiClient` centraliza `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.
- Ele injeta `Authorization` com o token atual.
- Em caso de `401`, dispara `handleSetLoginExpired(true)` e exibe mensagem de sessão expirada.
- Em caso de erro, converte resposta em `ApiError` com mensagem amigável.

### Estado do servidor

- TanStack Query gerencia resposta de listas e detalhes.
- `queryKeys` centraliza chaves de cache para múltiplos domínios.
- Há invalidação de queries após mutações de criação/edição/exclusão.

## Gerenciamento de estado

### Estado global

- `UserProvider`: usuário autenticado, token, flag de autenticação
- `ThemeProvider`: tema claro/escuro persistido em localStorage
- `LoginExpiredProvider`: controle de sessão expirada e redirecionamento
- `CampaignActiveProvider`: contexto para campanha ativa, usado em workflows de marketing

### Estado de servidor

- `useQuery` e `useMutation` do TanStack Query
- Cache por keys e invalidation por domínio
- `staleTime` usado para `useMe()` (`5 minutos`)

## Convenções utilizadas

- Nomes em inglês para utilitários e alguns módulos, mas labels e entidades em português
- Estrutura de arquivos por domínio e por tipo (`hooks`, `pages`, `components`)
- Componentes de página com sufixo `-page.tsx`
- Hooks começando com `use-...`
- Providers com nome `*Provider`
- Permissões mapeadas por strings como `users.manage`, `rbac.manage`, `audit.read`, etc.
- Tabelas com padrão de resumo + paginação + filtros
- Uso consistente de `HeaderPage`, `Breadcrumb`, `Badge`, `Button`, `TableComponentV2`
- UI com tokens de cor e classes do Tailwind via `src/index.css`

## Observações de arquitetura

A arquitetura é funcional e escalável para um sistema interno, porém ainda apresenta mistura de padrões antigos e novos. A coexistência entre `src/pages`, `src/modules`, `src/api` e `fetch` direto exige disciplina para evitar duplicação de lógica e inconsistência na autenticação.

A organização atual já oferece base para evolução para uma arquitetura mais padronizada, principalmente com:

- centralização de rotas em um arquivo dedicado
- padronização do uso do client HTTP
- unificação da autenticação em um único fluxo
- padronização de nomes de permissões em enum/constante
- redução de código legado em `src/pages`
