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

## Paginação

Nenhum endpoint V2 paginado retorna `totalPages` pronto — cada tela precisa calculá-lo no client, e a forma varia conforme o que o backend efetivamente devolve. Três situações já observadas no código real:

1. **Envelope `{page, pageSize, total, items}`, sem `totalPages`** — `GET /documentos` (`src/modules/documentos/hooks/use-fetch-documentos.ts`), `GET /aprovacoes/pendentes` (`use-fetch-aprovacoes-pendentes.ts`). A página calcula `totalPages = Math.max(1, Math.ceil(total / pageSize))` (ver `src/modules/documentos/pages/documentos-page.tsx`, `aprovacoes-pendentes-page.tsx`).
2. **Envelope sem `total` nem `totalPages`, só `{page, pageSize, items}`** — `GET /audit` (`src/modules/audit/hooks/use-fetch-audit.ts`, consumido também por `src/modules/core/pages/core-audit-page.tsx`). Sem `total` não dá para usar `Math.ceil`; o padrão observado é uma heurística baseada em página cheia: `totalPages = page + (items.length === pageSize ? 1 : 0)`.
3. **Sem paginação no servidor — o endpoint devolve o array completo** — `GET /users`, `GET /roles` (`src/modules/core/hooks/use-fetch-users.ts`, `use-fetch-roles.ts`) e `GET /hub-services` (`src/modules/hub-services/hooks/use-fetch-hub-services.ts`). Filtro, ordenação e paginação são inteiramente client-side (ver `core-users-page.tsx`, `core-roles-page.tsx`, `hub-services-page.tsx`), com o mesmo cálculo `Math.ceil` aplicado sobre o total já filtrado no client, não sobre um `total` vindo da API.

Ao consumir um endpoint paginado novo, confirme no contrato real do backend (schema da rota, não suposição) qual dos três casos se aplica antes de escrever o cálculo de `totalPages` — não assuma que o backend vai passar a devolver esse campo.

## Regras

- Uma responsabilidade por hook/arquivo — não junte fetch de lista e mutação de create no mesmo arquivo.
- Toda query key nova entra em `src/lib/api/query-keys.ts`, nunca como array solto dentro do hook (isso só é aceitável em código legado V1 já existente).
- `errorMessage` da chamada deve ser uma frase em português, curta e específica ao domínio (ex.: `"Erro ao consultar auditoria"`), não uma mensagem genérica.
- Loading/erro na UI: use os campos padrão do `useQuery`/`useMutation` (`isLoading`, `isPending`, `error`) — não crie estado local paralelo para isso.
- `staleTime` só quando houver razão explícita (ex.: `useMe()` usa 5 minutos porque dados de sessão mudam pouco); por padrão, não defina.
