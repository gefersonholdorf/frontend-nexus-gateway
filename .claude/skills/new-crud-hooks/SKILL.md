---
name: new-crud-hooks
description: Gera o conjunto de hooks de fetch + create/update/delete para uma entidade dentro de um módulo já existente em src/modules/<dominio>/hooks, seguindo o padrão de ApiClient + TanStack Query + query-keys deste repositório. Use quando o usuário pedir CRUD completo para uma entidade dentro de um módulo (não para criar o módulo em si — para isso use o skill new-module).
---

# Gerar hooks de CRUD para uma entidade

Pré-requisito: o módulo `src/modules/<dominio>` já existe (se não, use o skill `new-module` primeiro).

## Passos

1. Defina o shape da entidade (`<Entidade>Item`) e confirme com o código/backend real quais campos existem — para entidades V2 (backend novo), mantenha os prefixos `cd_`/`ds_`/`fl_`/`dt_` (ver `docs/standards/naming-conventions.md`); não invente campos.
2. Adicione em `src/lib/api/query-keys.ts`:
   ```ts
   <entidade>: {
     all: () => ["<entidade>"] as const,
     detail: (id: number) => ["<entidade>", id] as const,
   },
   ```
3. Crie `hooks/use-fetch-<entidade>.ts` (leitura, lista) e, se aplicável, `hooks/use-fetch-<entidade>-by-id.ts` (detalhe) — modelo em `src/modules/audit/hooks/use-fetch-audit.ts` e `docs/standards/data-fetching.md`.
4. Crie `hooks/use-create-<entidade>.ts`, `hooks/use-update-<entidade>.ts`, `hooks/use-delete-<entidade>.ts`, cada um com `useMutation` chamando `api.post`/`api.put`/`api.delete` via `useApiClient()`, e `onSuccess` invalidando `queryKeys.<entidade>.all()` (e `.detail(id)` quando for update/delete de um item específico).
5. Para relações N:N (ex.: vincular permissão a role, módulo a integração), siga o padrão de nome verbo+entidades: `use-assign-<x>-to-<y>.ts` / `use-remove-<x>-from-<y>.ts` ou `use-link-<x>-<y>.ts` / `use-unlink-<x>-<y>.ts`, cada um invalidando a query key do lado "dono" da relação.
6. Rode `npm run lint` e `tsc -b`.

## Não fazer

- Não junte fetch e mutation no mesmo arquivo — um hook por arquivo.
- Não use `fetch` direto nem crie query key fora de `query-keys.ts`.
- Não adicione `try/catch` manual em volta da chamada — deixe `ApiClient` converter o erro em `ApiError` e o `errorMessage` da chamada dar o contexto; trate o erro na UI via o `error`/`isError` do `useQuery`/`useMutation`.
