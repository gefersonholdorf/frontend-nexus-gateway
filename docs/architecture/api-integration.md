# Integração com API

## Duas gerações de backend coexistindo

### V2 — `VITE_API_URL_V2` (padrão para código novo)

Lido em `src/config/env.ts` (`readRequired`, lança erro se ausente). Consumido **exclusivamente** através de `ApiClient` (`src/lib/api/api-client.ts`):

- Classe com `get/post/put/patch/delete`, monta querystring, injeta `Authorization: Bearer <token>`, trata `204` (retorna `undefined`), `401` (chama `onUnauthorized`) e erros não-`ok` (converte em `ApiError`, `src/lib/api/api-error.ts`).
- Instanciado via `useApiClient()` (`src/lib/api/use-api-client.ts`), que injeta `getToken` a partir de `useUser()` e `onUnauthorized` a partir de `useLoginExpired()`.
- Usado hoje por `src/modules/audit/hooks/use-fetch-audit.ts` (`GET /audit`) e `src/modules/auth/hooks/{use-login,use-me}.ts` (`POST /auth/login`, `GET /me`).

**Atenção**: `api-client.ts` atualmente envia um **JWT hardcoded** no header `Authorization` em vez do token retornado por `getToken()` (linha do `headers["Authorization"]`). Isso é um bug de segurança/correção — todo request autenticado usa o mesmo token fixo, não o do usuário logado. Corrija antes de expandir o uso do `ApiClient` para novos domínios.

Payloads V2 usam prefixos de campo estilo Hungarian notation herdados do banco: `cd_` (código/id), `ds_` (descrição/texto), `fl_` (flag booleana), `dt_` (data). Ex.: `MeUser.cd_id`, `MeUser.ds_email`, `MeUser.fl_active`, `AuditItem.dt_created_at`. Mantenha esse padrão em novos tipos que espelham resposta do backend V2 — não converta para camelCase.

### V1 legado — `VITE_API_URL`

Usado por **todo o restante do app**: `src/api/<dominio>/*`, `src/pages/*`, vários `src/components/*`. Padrão: `fetch` direto, header `Authorization: Bearer ${user?.token}` montado manualmente, tratamento de `401` chamando `handleSetLoginExpired(true)` do contexto `useLoginExpired`, erro genérico via `throw new Error(...)`. Sem `ApiClient`, sem `ApiError`, sem `queryKeys` centralizado (cada hook define seu próprio array de query key inline).

**A tela de login em produção usa o V1**: `src/pages/login.tsx` faz `POST {VITE_API_URL}/login` diretamente. O hook V2 `useLogin` (`POST /auth/login`) existe e está pronto, mas não está conectado a nenhuma tela — é peça do fluxo de auth novo, ainda não finalizado. Não assuma que `useLogin`/`useMe` refletem o comportamento real de login até que essa ligação seja feita.

### Regra prática para trabalho novo

- Domínio novo ou reescrita de domínio existente como módulo (`src/modules/<dominio>`) → sempre `ApiClient`/V2, hooks em `hooks/use-fetch-*.ts`, `hooks/use-create-*.ts` etc.
- Ajuste pontual em tela legado já existente → mantenha o padrão V1 já usado naquele arquivo; não migre a integração "de brinde" junto de uma correção pontual.

## `queryKeys` (`src/lib/api/query-keys.ts`)

Centraliza chaves de cache do TanStack Query **apenas para o padrão V2/módulos**:

```ts
queryKeys.me()
queryKeys.users.all() / .detail(id)
queryKeys.roles.all() / .detail(id)
queryKeys.permissions.all()
queryKeys.modules.all() / .detail(id)
queryKeys.integrations.all() / .detail(id)
queryKeys.audit.all() / .list(params)
```

Ao criar um hook novo em `src/modules/*`, adicione a entrada correspondente aqui em vez de inventar uma chave solta. Hooks legado em `src/api/*` não usam `queryKeys` — não é necessário migrá-los para isso ao fazer um ajuste pontual.

## Endpoints conhecidos

V2 (via `ApiClient`): `/auth/login`, `/me`, `/audit`.

V1 (via `fetch` direto, path relativo a `VITE_API_URL`): `/login`, `/documents`, `/documents/:id/event`, `/documents/:id/versions`, `/documents/revisions`, `/documents/revisions/:id`, `/documents/profiles`, `/documents/summary`, `/documents/metrics`, `/calendar`, `/calendar/confirm`, `/calendar/declined`, `/calendar/availability`, `/calendar/waiting-confirm`, `/calendar/nexts`, `/calendar/presence`, `/calendar/summary`, `/campaigns`, `/campaigns/active`, `/campaigns/summary`, `/campaigns/users/:id`, `/campaigns/:id/access/{seen,accessed,dismissed}`, `/tickets`, `/tickets/summary`, `/tickets/validation-pendings`, `/jira`, `/maskings`, `/maskings/summary`, `/data-masking/:executionId`, `/notifications/glpi/events/me`, `/profiles`, `/profiles/permissions`, `/profiles/select`, `/profiles/:id`, `/reports/backups`, `/backups`, `/change-password/me`, `/users/list`, `/users/summary/tickets`, `/users/vpn`, `/servers/:id`, `/servers/access`, `/servers/privileges`, `/problems`, `/problems/details`.

## Tratamento de erros

- V2: `ApiError` tipado, com `status`/`code`/`message`; `errorMessage` por chamada dá contexto amigável na UI.
- V1: `Error` genérico com mensagem fixa por hook; sem tipo de erro estruturado.
- Ambos disparam a mesma UX de sessão expirada em `401` (`LoginExpiredProvider` + `LoginExpiredModal`), mas por caminhos de código diferentes (`onUnauthorized` no `ApiClient` vs. chamada manual a `handleSetLoginExpired` em cada hook V1).

## Cache

TanStack Query em memória, sem persistência nem devtools instalados. `useMe()` usa `staleTime: 5min`. Mutações V2 seguem o padrão `useMutation` + `queryClient.invalidateQueries(queryKeys.<dominio>...)` no `onSuccess`.
