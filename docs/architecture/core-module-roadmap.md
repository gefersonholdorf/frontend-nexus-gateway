# Roadmap do módulo Core

## Status atual

`src/modules/core` está implementado e em produção sob `/core/*`, com todas as 7 etapas da spec original construídas (ver seções abaixo) e, na sequência, migradas de dados mockados para a API real V2. `src/main.tsx` referencia `src/modules/core/pages/{core-home-page, core-users-page, core-roles-page, core-permissions-page, core-modules-page, core-module-detail-page, core-integrations-page, core-audit-page}.tsx` e `src/components/menu/sidebar-module.tsx` aponta os itens de "Administração" para `/core/*` — ambos refletem o estado atual do disco.

A migração de mock para API real (login, `/me`, e as seis entidades do Core: usuários, roles, permissões, módulos, integrações e auditoria) foi conduzida pela spec em [`docs/tasks/refatoracao-frontend-core-integracao-api.md`](../tasks/refatoracao-frontend-core-integracao-api.md), que é a fonte de verdade para o que foi de fato integrado, os critérios de aceite verificados e as pendências conhecidas (ex.: módulos sem edição de nome/descrição por falta de endpoint, auditoria sem contagem total de páginas). A spec de 7 etapas abaixo permanece como registro histórico de como a UI foi originalmente construída (sobre mocks); use o documento de migração para entender o estado real de integração com o backend.

## Restrição transversal

O módulo Core consome a API real V2 exclusivamente via `ApiClient` (`src/lib/api/api-client.ts`), entidade por entidade, através de `useQuery`/`useMutation` do TanStack Query — não há mais dados mockados nem `queryFn`/`mutationFn` em memória. Cada entidade (usuários, roles, permissões, módulos, integrações) tem hooks próprios em `src/modules/core/hooks/use-fetch-*.ts` / `use-create-*.ts` / `use-update-*.ts` / `use-toggle-*.ts`, que definem seus próprios tipos (`CoreUser`, `CoreRole`, `CorePermission`, `CoreModule`, `CoreIntegration`) e invalidam as queries afetadas após mutations bem-sucedidas. A tela de Auditoria (`/core/audit`) foi consolidada para usar o hook real já existente em `src/modules/audit/hooks/use-fetch-audit.ts` (`GET /audit`), eliminando a distinção histórica entre "auditoria de produção" e "auditoria mockada do Core" mencionada na Etapa 7. O controle de acesso por permissão (Etapa 4) segue aplicado, mas agora a partir das `permissions` retornadas por `GET /me`, via `src/modules/providers/permission-provider.tsx`, e não mais de um perfil mockado local.

## Etapa 1 — Fundação

Reconstrói a base de `src/modules/core`: navegação interna do módulo (Usuários, Roles, Permissões, Módulos, Integrações, Auditoria), camada de dados mockada via React Query, e três componentes reutilizáveis para as etapas seguintes: `DataTable` com paginação, cards quantitativos e componente de filtros — todos com shadcn/ui. **O módulo Core não pode ser desativável** (deve estar sempre disponível, sem opção de desligar).

## Etapa 2 — Usuários

Tela `/core/users`: `DataTable` paginada + filtros + cards quantitativos + CRUD visual (sobre mock, sem persistência real). Usuário tem nome, e-mail, cargo, status (`Ativo`/`Inativo`/`Bloqueado`), data de criação, e 1+ roles vinculadas (vínculo/desvínculo). Validação: nome/e-mail/cargo/status obrigatórios, e-mail válido.

## Etapa 3 — Roles e Permissões

Tela `/core/roles`: `DataTable` + CRUD visual de roles (nome, descrição, status, permissões vinculadas). Permissões (`/core/permissions`) são um **catálogo fixo sem CRUD** (nome, descrição, status, key) — a tela só permite atribuir/remover permissões existentes a uma role, nunca criar/editar/excluir permissão.

## Etapa 4 — Bloqueio por permissões (simulado)

Aplica controle de acesso simulado nas telas das etapas 2, 5, 6, 7: ações/botões/telas sem a permissão do perfil mockado atual ficam ocultos ou desabilitados. É a aplicação prática de `Can`/`useHasPermission` dentro do módulo Core, ainda sobre dados mockados (não é a mesma coisa que autenticação real).

## Etapa 5 — Módulos (`/core/modules`, `/core/modules/:id`)

Listagem em **cards** (não tabela) + cards quantitativos + filtros. Módulo tem nome, descrição, status (`Ativo`/`Inativo`) e contagem de integrações vinculadas. Na criação, permite selecionar integrações; na tela de detalhe (`/core/modules/:id`), permite conectar/desconectar integrações. Módulo ativo aparece no menu e libera acesso; inativo não. **O próprio módulo Core não aparece como desativável nesta listagem** (reforça a regra da Etapa 1).

## Etapa 6 — Integrações (`/core/integrations`)

Listagem em cards das integrações externas simuladas: Jira, GLPI, Microsoft, OpenVPN. Cada uma tem nome, descrição, status, formulário de configuração mockado (URL, chave/token, usuário — campos visuais) e ação "Testar Conexão" com **resultado fixo por integração**: Jira → sucesso, Microsoft → falha, GLPI e OpenVPN → sucesso (premissa ajustável; confirmar permanência do OpenVPN com o usuário).

## Etapa 7 — Auditoria (`/core/audit`)

Tela **somente leitura**: `DataTable` paginada + filtros (usuário, ação, módulo, período) + cards quantitativos. Cada registro tem usuário responsável, ação, mensagem, IP, horário, módulo. Dados mockados estáticos — nenhuma ação do sistema gera novo registro automaticamente.

> Nota: o hook V2 real `src/modules/audit/hooks/use-fetch-audit.ts` (`GET /audit` via `ApiClient`) já existe e funciona contra o backend V2 — ele é uma peça separada do módulo `audit` "de produção", distinta da tela mockada `/core/audit` da Etapa 7. Não os confunda nem tente unificá-los sem confirmar com o usuário.

## Ordem de dependência

Etapa 1 é pré-requisito de todas. Etapa 4 depende da 3 e deve ser aplicada nas telas das etapas 2, 5, 6, 7 (idealmente incrementalmente, conforme cada uma for concluída). Etapa 5 referencia integrações da Etapa 6 (usar mock de integrações se a 6 ainda não existir). Fora de escopo em todas as etapas: API real, persistência, autenticação/autorização de verdade.
