# Convenções de nomenclatura

## Arquivos

- `kebab-case.tsx` / `kebab-case.ts` para todo arquivo.
- Páginas: sufixo `-page.tsx` (ex.: `audit-page.tsx`, `users-list-page.tsx`).
- Hooks: prefixo `use-` (ex.: `use-fetch-audit.ts`, `use-create-user.ts`, `use-me.ts`).
- Providers: `*-context.tsx` (contexto genérico) ou `*-provider.tsx` (provider de domínio, ex.: `permission-provider.tsx`).
- Modais: `create-<entidade>-modal.tsx`, `edit-<entidade>-modal.tsx`.

## Hooks de dados (padrão módulo/V2)

Um hook por arquivo, dentro de `src/modules/<dominio>/hooks/`:

- `use-fetch-<entidade>.ts` — `useQuery`
- `use-create-<entidade>.ts`, `use-update-<entidade>.ts`, `use-delete-<entidade>.ts` — `useMutation`
- Ações específicas de domínio seguem verbo + entidade: `use-assign-role-to-user.ts`, `use-toggle-module-active.ts`, `use-link-module-integration.ts`.
- `use-get-<entidade>-select.ts` — variante de `useQuery` usada especificamente para popular um select de referência (ver [component-and-page-patterns.md](component-and-page-patterns.md), seção "Select de referência"), distinguindo do `use-fetch-<entidade>.ts` de listagem paginada da mesma entidade. Ex.: `src/modules/documentos/hooks/{use-get-roles-select,use-get-usuarios-select}.ts`.

## Permissões (RBAC)

Chaves sempre no formato `dominio.acao`, minúsculo, sem espaços: `users.manage`, `rbac.manage`, `rbac.assign`, `modules.manage`, `integrations.manage`, `audit.read`, `documento.criar`, `documento.editar`, `documento.arquivar`, `documento.publicar`, `revisao.solicitar`, `revisao.aprovar`, `versao.criar`, `aprovacao.avaliar`, `configuracoes.gerenciar`. Ao adicionar uma permissão nova, siga o mesmo padrão — não use camelCase nem hierarquias com mais de dois níveis.

## Campos de payload vindos do backend V2

Prefixos herdados do banco, preservados nos tipos TypeScript que espelham resposta de API V2 (não converta para camelCase):

| Prefixo | Significado | Exemplo |
|---|---|---|
| `cd_` | código / id | `cd_id`, `cd_user` |
| `ds_` | descrição / texto | `ds_name`, `ds_email`, `ds_action` |
| `fl_` | flag booleana | `fl_active` |
| `dt_` | data | `dt_created_at` |

Isso vale apenas para tipos espelhando resposta do backend V2 (`src/modules/*`). Endpoints V1 legado (`src/api/*`) já retornam campos em camelCase (`id`, `title`, `createdAt`, etc.) — mantenha o padrão que o endpoint específico já usa, não normalize entre os dois.

## Query keys

Centralizadas em `src/lib/api/query-keys.ts` como objeto `queryKeys.<dominio>.{all,detail,list}(...)`, usando `as const`. Toda entidade nova consumida via `ApiClient` deve ganhar uma entrada aqui. Hooks V1 legado usam array de query key inline no próprio arquivo — não é necessário migrar isso ao tocar em um hook legado pontualmente.

## Componentes

- `PascalCase` para nomes de componente/função exportada.
- Props tipadas com `interface <Componente>Props`.
- Componentes de UI base ficam em `src/components/ui`; nunca duplique um componente existente lá (`Button`, `Badge`, `Input`, `Select`, `Dialog`, `Drawer`, `Switch`, `Table`, etc.) — importe e componha.
