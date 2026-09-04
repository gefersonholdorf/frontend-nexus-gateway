# Regras de Negócio identificadas no Frontend

## Visão geral

O frontend do Nexus Gateway encapsula um conjunto de regras de negócio de um portal corporativo para gestão de infraestrutura, governança documental, segurança, operações e governança de acessos. A maior parte das regras está expressa em:

- permissões e papéis
- visibilidade de módulos e menu
- validação de acesso por perfil
- regras de status e atividade
- filtro e paginação de dados
- ações administrativas condicionadas a `Can` / `useHasPermission`

## Perfis de usuário

Os perfis aparecem explicitamente em `src/components/menu/sidebar-module.tsx`:

- Administrador
- Suporte
- Desenvolvedor
- Infraestrutura

Esses perfis são usados para decidir se um item do menu é exibido para o usuário. A lógica ainda é parcialmente estática e definida por array de strings em cada item do sidebar.

## Permissões e RBAC

O sistema usa acesso baseado em permissões verdadeiramente estruturado com `PermissionProvider` e `useHasPermission`.

Exemplos de chaves de permissão observadas no código:

- `users.manage`
- `rbac.manage`
- `rbac.assign`
- `modules.manage`
- `integrations.manage`
- `audit.read`

A estrutura principal é:

- `useMe()` busca `user`, `roles`, `permissions`
- `PermissionProvider` monta um `Set` para verificação rápida
- `Can` renderiza condicionalmente ações
- `RouteGuard` protege componentes por permissão

## Regras de visibilidade do sistema

### Menu

O menu lateral restringe módulos por perfil em `sidebarModules`:

- Página Inicial: `Administrador`, `Suporte`, `Desenvolvedor`, `Infraestrutura`
- Campanhas: `Administrador`
- Organograma: todos os perfis listados
- Documentos ISO: todos os perfis listados
- Central de Operações: `Administrador`, `Suporte`
- Central de Segurança: `Administrador`
- Mascaramento: todos os perfis listados
- Administração (usuários, módulos, integrações, auditoria, roles, permissões): `Administrador`

## Fluxos operacionais observados

### Login e sessão

- Login exige email e senha.
- Usuário autenticado recebe token e é persistido em `localStorage`.
- Em `401`, a sessão é tratada como expirada e abre modal de redirecionamento.
- A sessão expira automaticamente e redireciona para `/`.

### Gestão de usuários

- Usuários podem ser listados, detalhados e editados.
- Alteração de senha e atribuição de papéis são ações controladas por permissões.
- A atribuição de papéis deve estar ligada a `rbac.assign`.

### Gestão de papéis e permissões

- Roles podem ser ativadas/inativadas conforme status.
- Permissões podem ser vinculadas a módulos e papéis.
- O sistema realiza associação e remoção entre entidades via `useAssignPermissionToRole`, `useRemovePermissionFromRole`, etc.

### Gestão de módulos

- Módulos possuem identificador, chave, nome, descrição e status `fl_active`.
- Mudanças de status são feitas por `Switch` e controladas por `modules.manage`.
- Há associação de permissões e integrações ao módulo.

### Auditoria

- A página de auditoria exige `audit.read`.
- É possível filtrar por:
  - ação (`CREATE`, `UPDATE`, `DELETE`)
  - entidade
  - usuário
  - faixa de datas
- `cd_user` nulo indica ação do sistema.

### Documentos

- Há fluxo de configuração, criação, revisão e visualização de documentos.
- Há também perfis de documentos e configurações de entidade.
- O sistema considera revisões e eventos de documentos como parte governança documental.

### Operações e suporte

- Há central de operações, central de segurança, tickets, pendências de validação, campanhas e mascaramento.
- Algumas áreas são restritas a administrador ou suporte, conforme menu.

## Restrições e limites encontrados

- Há implementação de autorização por menu e por componente, mas a rota não é totalmente centralizada em um único guard de permissão por rota.
- A lista de perfis e permissões está em strings e arrays hard-coded, o que facilita a manutenção, mas aumenta o risco de inconsistência.
- O login ainda mistura duas formas de autenticação: `fetch` direto em `LoginPage` e client HTTP centralizado em `ApiClient`/`useLogin`.
- Há rotas comentadas e módulos parcialmente implementados (`/servers`, `/backups`, `/documents/:id`), o que sinaliza funcionalidade ainda não concluída ou em transição.
- O `ThemeProvider` e `UserProvider` usam `localStorage`, sem mecanismo avançado de segurança para tokens sensíveis.

## Regras de negócio implícitas na UI

- Usuários administrativos têm acesso à gestão de permissões e módulos.
- Subordinados e perfis menos privilegiados podem consumir dados operacionais e visuais, mas não alterar configurações críticas.
- Status ativo/inativo é tratado de forma explícita em módulos e roles.
- O sistema prioriza controle de acesso por colaboração entre perfil + permissão.
- A interface reforça auditoria e rastreabilidade como obrigação operacional.

## Conclusão

A camada de regras de negócio do frontend é centrada em RBAC, status de entidade e visibilidade por perfil. O projeto prioriza segurança e governança de acesso no front, mesmo que a modelagem ainda possa ser melhor estruturada para reduzir acoplamento entre menu, permissão e rota.
