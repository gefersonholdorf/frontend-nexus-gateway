# Padrão de data-fetching (TanStack Query)

Este documento cobre o padrão a seguir em **código novo** (`src/modules/*`, sempre via `ApiClient`/V2 — ver [docs/architecture/api-integration.md](../architecture/api-integration.md)). Código legado em `src/api/*` segue um padrão mais antigo (fetch direto, query key inline) que não deve ser copiado para trabalho novo.

## Query (leitura)

```ts
// src/modules/<dominio>/hooks/use-fetch-<entidade>.ts
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";

export interface Fetch<Entidade>Request { page?: number; pageSize?: number; /* filtros */ }
export interface <Entidade>Item { cd_id: number; /* ...campos ds_/fl_/dt_ */ }
export interface Fetch<Entidade>Response { page: number; pageSize: number; items: <Entidade>Item[]; }

export function useFetch<Entidade>({ page = 1, pageSize = 20, ...filtros }: Fetch<Entidade>Request = {}) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.<entidade>.list({ page, pageSize, ...filtros }),
    queryFn: () =>
      api.get<Fetch<Entidade>Response>("/<entidade>", {
        query: { page, pageSize, ...filtros },
        errorMessage: "Erro ao consultar <entidade>",
      }),
  });
}
```

Referência real: `src/modules/audit/hooks/use-fetch-audit.ts`.

## Mutation (create/update/delete)

Padrão observado no módulo `auth` (`use-login.ts`) e na spec do módulo Core: `useMutation` com `mutationFn` chamando `api.post/put/patch/delete`, e `onSuccess` invalidando a(s) query key(s) afetada(s) via `queryClient.invalidateQueries(queryKeys.<dominio>.all())` (ou `.detail(id)` quando aplicável). Sempre passe `errorMessage` contextual.

## Regras

- Uma responsabilidade por hook/arquivo — não junte fetch de lista e mutação de create no mesmo arquivo.
- Toda query key nova entra em `src/lib/api/query-keys.ts`, nunca como array solto dentro do hook (isso só é aceitável em código legado V1 já existente).
- `errorMessage` da chamada deve ser uma frase em português, curta e específica ao domínio (ex.: `"Erro ao consultar auditoria"`), não uma mensagem genérica.
- Loading/erro na UI: use os campos padrão do `useQuery`/`useMutation` (`isLoading`, `isPending`, `error`) — não crie estado local paralelo para isso.
- `staleTime` só quando houver razão explícita (ex.: `useMe()` usa 5 minutos porque dados de sessão mudam pouco); por padrão, não defina.
