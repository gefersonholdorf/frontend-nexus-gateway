---
name: new-module
description: Cria a estrutura inicial de um módulo novo em src/modules/<dominio> (hooks/components/pages) seguindo o padrão já usado por src/modules/audit e src/modules/auth neste frontend Nexus Gateway. Use quando o usuário pedir para "criar o módulo X", "iniciar o domínio X" ou equivalente, e não houver ainda pasta src/modules/<dominio>.
---

# Criar um módulo novo

Este skill cria o esqueleto de um domínio novo em `src/modules/<dominio>`, seguindo a arquitetura documentada em `docs/architecture/overview.md` e `docs/standards/`.

## Passos

1. Confirme o nome do domínio (kebab-case, ex.: `inovacao`, `integrations`) e quais telas/entidades ele terá — não adivinhe se não estiver claro no pedido.
2. Crie a estrutura de diretórios:
   ```
   src/modules/<dominio>/
   ├── hooks/
   ├── components/
   └── pages/
   ```
   Só crie `components/` se o domínio realmente precisar de componente próprio (modais, forms) além das páginas — não crie pasta vazia por convenção.
3. Para cada entidade consumida, crie o hook de leitura em `hooks/use-fetch-<entidade>.ts` seguindo exatamente o padrão de `src/modules/audit/hooks/use-fetch-audit.ts`: interfaces `Fetch<Entidade>Request`/`<Entidade>Item`/`Fetch<Entidade>Response`, `useApiClient()`, `queryKeys.<entidade>.list(params)`. Ver `docs/standards/data-fetching.md` para o template completo.
4. Adicione a entrada correspondente em `src/lib/api/query-keys.ts` (`queryKeys.<entidade> = { all: () => [...], list: (params) => [...] }`).
5. Crie a(s) página(s) em `pages/<algo>-page.tsx`, seguindo `docs/standards/component-and-page-patterns.md` (HeaderPage → cards quantitativos → filtros → tabela/grid → ações condicionadas por `Can`).
6. Se o módulo expõe rota nova, use o skill `add-route-and-menu-entry` em seguida — não edite `main.tsx`/`sidebar-module.tsx` manualmente aqui para manter os dois passos separados e revisáveis.
7. Rode `npm run lint` e `tsc -b` ao final.

## Não fazer

- Não crie `src/modules/<dominio>/api` ou `services` — chamadas HTTP ficam em `hooks/`, usando `ApiClient` (nunca `fetch` direto — isso é padrão legado, ver `docs/architecture/api-integration.md`).
- Não copie o padrão de `src/pages`/`src/api` (fetch direto, query key inline) para um módulo novo.
- Se o domínio for o módulo Core (`src/modules/core`), não use este skill isoladamente — siga a ordem de etapas em `docs/architecture/core-module-roadmap.md`, que já define a estrutura interna esperada (Etapa 1 cria os componentes reutilizáveis que as demais etapas consomem).
