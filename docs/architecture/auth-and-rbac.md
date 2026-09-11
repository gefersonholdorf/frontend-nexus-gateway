# Autenticação e RBAC

## Sessão

`UserProvider` (`src/contexts/user-context.tsx`) guarda o `User` (email, name, roleDescription, logo, roles, permissions, token) em `localStorage` (`key: "user"`) e deriva `isAuthenticated = Boolean(user?.token)`. `ProtectedRoute` (`src/protected-router.tsx`) redireciona para `/` com toast se `isAuthenticated` for falso; senão renderiza `<Outlet />`.

**Fluxo de login em produção**: `src/pages/login.tsx` faz `POST {VITE_API_URL}/login` (V1) e chama `setUser` com a resposta. O hook V2 `useLogin` (`src/modules/auth/hooks/use-login.ts`, `POST /auth/login`) não está conectado a essa tela — existe para o fluxo novo, ainda pendente de integração. Não presuma que ambos os fluxos coexistem funcionalmente hoje.

## RBAC

`useMe()` (`src/modules/auth/hooks/use-me.ts`, V2, `GET /me`) retorna `{ user, roles, permissions }`, com `permissions: string[]` no formato `dominio.acao` (ex.: `users.manage`, `rbac.manage`, `rbac.assign`, `modules.manage`, `integrations.manage`, `audit.read`, e as do módulo Gestão de Documentos: `documento.criar`, `documento.editar`, `documento.arquivar`, `documento.publicar`, `revisao.solicitar`, `revisao.aprovar`, `versao.criar`, `aprovacao.avaliar`, `configuracoes.gerenciar`).

`PermissionProvider` consome `useMe()`, monta um `Set<string>` de permissões e expõe:

- `usePermissions()` → `string[]`
- `useHasPermission(key)` → `boolean`
- `usePermissionsLoading()` → `boolean`

`src/modules/providers/permission-provider.tsx` está implementado e no disco — infraestrutura real de autorização, não mock (ver [core-module-roadmap.md](core-module-roadmap.md) para o histórico da reconstrução do módulo Core, que consumiu esse provider).

## Componentes de autorização (`src/modules/auth/components`)

```tsx
<Can permission="users.manage" fallback={null}>
  <BotaoDeAcao />
</Can>

<RouteGuard permission="audit.read" redirectTo="/403" loadingFallback={<Spinner />}>
  <AuditPage />
</RouteGuard>
```

- `Can`: esconde/mostra `children` sem redirecionar; não trata loading (mostra `fallback` mesmo enquanto `useMe()` carrega — atenção a flicker).
- `RouteGuard`: trata `isLoading` (usa `loadingFallback`) e redireciona (`Navigate`) quando a permissão falta.

Na maioria das rotas, a proteção por permissão ainda é aplicada manualmente dentro de cada página/ação, não centralizada em `main.tsx`. **Exceção**: as rotas `/gestao-documentos/configuracoes/*` e `/gestao-documentos/aprovacoes-pendentes` (módulo "Gestão de Documentos") são as primeiras a envolver o `element` da rota diretamente com `<RouteGuard permission="...">` em `main.tsx` — ver [routing.md](routing.md).

## Visibilidade por linha (distinta de RBAC) — módulo Gestão de Documentos

O módulo `src/modules/documentos` introduz um terceiro eixo de controle, além de RBAC (permissões) e perfis (menu): quais documentos/revisões/versões aparecem para o usuário é decidido pelo **backend**, comparando as roles do usuário com as roles vinculadas ao documento (RF004) — não é uma checagem de permissão nem uma escolha do frontend. Por isso as telas de listagem/detalhe do módulo (`/gestao-documentos`, `/revisoes`, `/versoes`, `/:id`) usam só `ProtectedRoute` (autenticação), sem `RouteGuard`; a filtragem de quais linhas voltam já vem pronta de `GET /documentos`. Ações administrativas dentro dessas telas (editar, arquivar, solicitar revisão etc.) continuam atrás de `<Can permission="...">`, normalmente.

## Perfis (visibilidade de menu, distinto de permissão)

Além de permissões, há um segundo eixo de controle mais simples e estático: perfil do usuário, usado para decidir visibilidade de item de menu em `src/components/menu/sidebar-module.tsx` (array `profiles: string[]` por item). Perfis observados: `Administrador`, `Suporte`, `Desenvolvedor`, `Infraestrutura`. Isso é uma lista de strings hardcoded por item de menu — não vem de `useHasPermission`.

Um item de menu também pode declarar `permission?: string` opcional, que soma um segundo filtro via `useHasPermission(permission)` (o item só aparece se passar em `profiles` **e** em `permission`, quando ambos estiverem presentes) — usado hoje nos itens de "Administração" (módulo Core), em "Painel de Sistemas" (`hub_services_manage`) e nos itens de "Gestão de Documentos" que exigem `aprovacao.avaliar`/`configuracoes.gerenciar`. Ao adicionar um item de menu, siga o mesmo padrão (`profiles` sempre; `permission` quando o item corresponder a uma ação/tela já protegida por permissão no backend), não introduza uma terceira forma de checar visibilidade.

## Sessão expirada

`LoginExpiredProvider` (`src/contexts/login-expired.tsx`) expõe `handleSetLoginExpired(boolean)`. Tanto o `ApiClient` (V2, via `onUnauthorized`) quanto os hooks V1 (chamando `handleSetLoginExpired(true)` manualmente ao ver `response.status === 401`) disparam o mesmo modal (`LoginExpiredModal`, montado em `src/main.tsx` dentro de `PermissionProvider`).
