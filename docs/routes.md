# Rotas e Navegação

## Visão geral

A navegação do frontend é montada em `src/main.tsx` com `BrowserRouter` e `Routes` da biblioteca `react-router`.

A organização hierárquica da aplicação é:

- rota pública de autenticação em `/`
- rota pública de acesso negado em `/403`
- grupo protegido `ProtectedRoute`
- shell principal `LayoutPages`
- páginas internas do produto

## Estrutura hierárquica

```text
/
├── / (LoginPage)
├── /403 (ForbiddenPage)
└── ProtectedRoute
    └── LayoutPages
        ├── /welcome
        ├── /ipmap
        ├── /security-center
        ├── /systems
        ├── /services
        ├── /calendar
        ├── /servers
        ├── /comunications
        ├── /documents
        ├── /documents/profiles
        ├── /documents/create
        ├── /documents/configurations
        ├── /documents/reviews
        ├── /documents/reviews/:id
        ├── /documents/events
        ├── /users
        ├── /users/:id
        ├── /roles
        ├── /permissions
        ├── /roles/:id
        ├── /modules
        ├── /modules/:id
        ├── /integrations
        ├── /audits
        ├── /profiles
        ├── /profiles/:id
        ├── /profiles/create
        ├── /organograma
        ├── /masking
        ├── /tickets-validations-pendings
        ├── /operations
        ├── /tickets
        └── /campaigns
```

## Rotas públicas

### `/`

Tela de login. Exige autenticação para entrar no sistema. Usa formulário de email/senha e chama o backend para emissão do token.

### `/403`

Página de acesso proibido. Indicada para quando o usuário tenta acessar um recurso sem permissão.

## Rotas protegidas

Toda a área abaixo de `ProtectedRoute` exige que `isAuthenticated` seja verdadeiro. Caso contrário, o componente redireciona para `/` e exibe toast de autenticação necessária.

Exemplos de páginas protegidas:

- `/welcome`: dashboard inicial
- `/documents`: governança documental
- `/users`: gestão de usuários
- `/roles`: administração de papéis
- `/modules`: configuração de módulos
- `/integrations`: integrações com sistemas externos
- `/audits`: auditoria do sistema
- `/campaigns`: gestão de campanhas
- `/operations`, `/tickets`, `/security-center`: operações e suporte

## Layouts utilizados

### `RootLayout`

Layout raiz da aplicação. Envolve todo o app e aplica `TooltipProvider`.

### `LayoutPages`

Layout interno do sistema, que monta:

- sidebar lateral
- menu horizontal
- área principal com `Outlet`
- fundo e comportamento de responsividade

### `Sidebar`

Estrutura principal de navegação horizontal/vertical. Agrupa módulos por área:

- Geral
- Governança
- Infraestrutura
- Operações
- Administração

## Guardas de autenticação

### `ProtectedRoute`

Arquivo principal do guard de autenticação.

Comportamento:

- lê `const { isAuthenticated } = useUser()`
- em caso de falha, exibe toast e redireciona para `/`
- caso autenticado, renderiza `<Outlet />`

### `RouteGuard`

Componente disponível em `src/modules/auth/components/route-guard.tsx` para proteger trechos e ações por permissão específica:

- recebe `permission`, `children`, `redirectTo` e `loadingFallback`
- usa `usePermissionsLoading` e `useHasPermission`
- redireciona para rota configurada quando o usuário não tem permissão

## Observações de roteamento

- A rota de login e as rotas internas estão em um único arquivo `main.tsx`, o que reduz modularização.
- Há rotas comentadas como `/documents/:id`, `/backups` e `/servers`, indicando funcionalidade parcialmente implementada ou removida.
- O padrão é de roteamento declarativo e estático, sem rotas aninhadas por módulo.
- A navegação por perfil é reforçada pelo `Sidebar` (lista de perfis autorizados), mas ainda não existe uma centralização completa de autorização por rota.

## Resumo

A navegação é típica de portal corporativo com shell fixo e múltiplas áreas operacionais. A camada de proteção está presente, mas a arquitetura da rota é relativamente centralizada em um único ponto (`main.tsx`), o que funciona para o estágio atual, mas dificulta manutenção em crescimento.
