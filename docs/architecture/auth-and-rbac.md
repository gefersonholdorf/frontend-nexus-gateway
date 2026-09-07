# Autenticação e RBAC

## Sessão

`UserProvider` (`src/contexts/user-context.tsx`) guarda o `User` (email, name, roleDescription, logo, roles, permissions, token) em `localStorage` (`key: "user"`) e deriva `isAuthenticated = Boolean(user?.token)`. `ProtectedRoute` (`src/protected-router.tsx`) redireciona para `/` com toast se `isAuthenticated` for falso; senão renderiza `<Outlet />`.

**Fluxo de login em produção**: `src/pages/login.tsx` faz `POST {VITE_API_URL}/login` (V1) e chama `setUser` com a resposta. O hook V2 `useLogin` (`src/modules/auth/hooks/use-login.ts`, `POST /auth/login`) não está conectado a essa tela — existe para o fluxo novo, ainda pendente de integração. Não presuma que ambos os fluxos coexistem funcionalmente hoje.

## RBAC

`useMe()` (`src/modules/auth/hooks/use-me.ts`, V2, `GET /me`) retorna `{ user, roles, permissions }`, com `permissions: string[]` no formato `dominio.acao` (ex.: `users.manage`, `rbac.manage`, `rbac.assign`, `modules.manage`, `integrations.manage`, `audit.read`).

`PermissionProvider` consome `useMe()`, monta um `Set<string>` de permissões e expõe:

- `usePermissions()` → `string[]`
- `useHasPermission(key)` → `boolean`
- `usePermissionsLoading()` → `boolean`

**Estado atual**: `src/modules/providers/permission-provider.tsx` foi removido do disco junto com a reconstrução do módulo Core (ver [core-module-roadmap.md](core-module-roadmap.md)), mas `src/main.tsx`, `Can` e `RouteGuard` ainda importam de `@/modules/providers/permission-provider`. Recriar esse provider (ou seu equivalente dentro de `src/modules/core`) é pré-requisito para o build funcionar.

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

Nenhum dos dois hoje protege a rota inteira automaticamente a partir de `main.tsx` — a proteção por permissão é aplicada manualmente dentro de cada página/ação, não centralizada por rota.

## Perfis (visibilidade de menu, distinto de permissão)

Além de permissões, há um segundo eixo de controle mais simples e estático: perfil do usuário, usado só para decidir visibilidade de item de menu em `src/components/menu/sidebar-module.tsx` (array `profiles: string[]` por item). Perfis observados: `Administrador`, `Suporte`, `Desenvolvedor`, `Infraestrutura`. Isso é uma lista de strings hardcoded por item de menu — não vem de `useHasPermission`. Ao adicionar um item de menu, siga o mesmo padrão (array de perfis), não introduza uma segunda forma de checar visibilidade.

## Sessão expirada

`LoginExpiredProvider` (`src/contexts/login-expired.tsx`) expõe `handleSetLoginExpired(boolean)`. Tanto o `ApiClient` (V2, via `onUnauthorized`) quanto os hooks V1 (chamando `handleSetLoginExpired(true)` manualmente ao ver `response.status === 401`) disparam o mesmo modal (`LoginExpiredModal`, montado em `src/main.tsx` dentro de `PermissionProvider`).
