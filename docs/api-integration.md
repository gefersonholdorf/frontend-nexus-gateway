# Integrações com API e dados do frontend

## Visão geral

O frontend integra múltiplos serviços via HTTP REST e usa o TanStack Query para orquestrar consulta e mutação de dados. A abstração principal da comunicação é o `ApiClient`, localizado em `src/lib/api/api-client.ts`.

## Cliente HTTP utilizado

### `ApiClient`

A classe `ApiClient` encapsula:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- montagem de query strings
- injecção de `Authorization` do token atual
- tratamento de `401`
- parsing JSON e conversão de erros em `ApiError`

Ele usa a variável de ambiente:

- `VITE_API_URL_V2`

A leitura é feita em `src/config/env.ts`.

### `useApiClient`

O hook `useApiClient` coleta:

- token do contexto `useUser`
- callback `handleSetLoginExpired`
- instância memoizada do `ApiClient`

Isso centraliza o comportamento de autenticação para todas as ações do módulo.

## Autenticação

### Fluxo principal

- Login recebe `email` e `password`.
- O token é persistido em `localStorage`.
- `useMe()` chama `GET /me` para obter usuário, roles e permissões.
- Em todas as requisições subsequentes, o token é enviado no header `Authorization`.

### Tratamento de sessão expirada

No `ApiClient`:

- `response.status === 401` dispara `onUnauthorized()`
- `onUnauthorized` dispara `handleSetLoginExpired(true)`
- o app exibe `LoginExpiredModal` com contagem regressiva e redireciona para `/`

## Hooks de requisição

O frontend utiliza hooks em dois padrões:

### Padrão moderno (módulos)

Arquivos em `src/modules/*/hooks`:

- `use-login.ts`
- `use-me.ts`
- `use-fetch-roles.ts`
- `use-fetch-permissions.ts`
- `use-fetch-modules.ts`
- `use-fetch-integrations.ts`
- `use-fetch-users.ts`
- `use-fetch-audit.ts`

Esses hooks usam `useQuery` e `useMutation` do TanStack Query e constroem endpoints com `api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`.

### Padrão legado (api/)

Arquivos em `src/api/*` ainda realizam `fetch` diretamente e, em muitos casos, usam `import.meta.env.VITE_API_URL` sem a abstração do `ApiClient`.

Exemplos de domínios:

- `calendar/`
- `campaigns/`
- `documents/`
- `glpi/`
- `jira/`
- `maskings/`
- `profiles/`
- `reports/`
- `backups/`
- `notifications/`

## Endpoints principais observados

Alguns endpoints identificados no código e em hooks suportados por módulo:

- `/auth/login`
- `/me`
- `/users`
- `/users/list`
- `/roles`
- `/roles/:roleId/permissions`
- `/permissions`
- `/modules`
- `/modules/:moduleId/permissions`
- `/integrations`
- `/audit`
- `/documents`
- `/documents/reviews`
- `/calendar`
- `/jira`
- `/glpi/tickets`
- `/maskings`
- `/campaigns`
- `/backups`
- `/profiles`
- `/profiles/permissions`

## Tratamento de erros

A estratégia atual inclui:

- `ApiError` para erros tipados e centralizados em `src/lib/api/api-error.ts`
- `errorMessage` por chamada para mensagens contextualizadas
- `toast` em interação do usuário
- redirecionamento em falha de autenticação
- fallback de `response.json()` com bloqueio seguro em erros inválidos

Exemplo do padrão:

- `api.get("/roles", { errorMessage: "Erro ao listar roles" })`
- se a resposta falhar, a exceção é propagada para o componente e o UI responde com feedback

## Estratégias de cache

O projeto usa TanStack Query com caching por chave de query.

### Padrões observados

- `queryKeys` centraliza as chaves por domínio
- `useQuery` com `queryKey` estável
- `invalidateQueries` após mutações de create/update/delete
- `staleTime` de 5 minutos para `useMe()`

O cache é gerenciado em memória, sem camada extra de persistência ou React Query DevTools.

## Dados e sincronização

- listas e grupos usam `useQuery` para consultar e renderizar tabelas
- mutações usam `useMutation` e invalidam queries relevantes
- ações de criação, edição e exclusão são frequentemente seguidas por `refetch` ou invalidation

## Observações de integração

Há uma forte tendência de padronização para `ApiClient`, mas o código ainda apresenta mistura entre:

- fetch direto
- hooks do módulo
- `useApiClient`

Isso indica uma fase de migração da arquitetura de integração. O projeto já está em boa direção, mas ainda precisa de uma padronização final para remover chamadas diretas e uniformizar a API base.

## Resumo

A integração do frontend é de nível corporativo, com autenticação via token, cache via TanStack Query e camada HTTP centralizada em `ApiClient`. O sistema integra vários domínios operacionais (documentos, seguranças, tickets, campanhas, calendarização e usuários) e já está bem estruturado para evoluir para um padrão de integração totalmente uniforme.
