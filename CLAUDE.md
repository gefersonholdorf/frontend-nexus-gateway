# Projeto

Sistema corporativo de intranet e gestão operacional chamado Nexus Gateway. O frontend concentra dashboards, gestão de usuários e permissões, governança documental, operações e integrações com sistemas internos e externos.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui-inspired components
- React Router
- TanStack Query
- Context API
- Zod + react-hook-form
- Lucide React
- Sonner
- Recharts, XYFlow, React PDF, Docx Preview

## Arquitetura

O app usa uma arquitetura híbrida com módulos funcionais em `src/modules` e páginas legado em `src/pages`. O shell principal é montado em `main.tsx`, com `ProtectedRoute`, `LayoutPages`, `Sidebar` e `MenuComponent`. A autenticação é baseada em token em `localStorage`, `UserProvider` e `PermissionProvider`. Os dados do servidor são gerenciados via `useQuery` e `useMutation` do TanStack Query. O cliente HTTP é centralizado em `ApiClient` e a autorização é injetada em todas as requisições.

## UI

A interface usa tema claro/escuro com design corporativo, cards, badges, tabelas paginadas e menus laterais. Há forte padronização em `HeaderPage`, `TableComponentV2`, `Button`, `Badge`, `Input`, `Select`, `Dialog`, `Drawer` e `Switch`. O visual segue tokens de cores em `src/index.css` e usa `lucide-react` para ícones.

## Rotas

Rotas públicas:
- `/` – login
- `/403` – acesso negado

Rotas protegidas:
- `/welcome`
- `/documents`, `/documents/profiles`, `/documents/create`, `/documents/configurations`, `/documents/reviews`, `/documents/reviews/:id`, `/documents/events`
- `/users`, `/users/:id`
- `/roles`, `/roles/:id`, `/permissions`
- `/modules`, `/modules/:id`
- `/integrations`
- `/audits`
- `/profiles`, `/profiles/:id`, `/profiles/create`
- `/organograma`
- `/masking`
- `/operations`
- `/tickets`
- `/campaigns`

## Regras de Negócio

- A autenticação exige usuário e senha.
- Zugang e permissões são baseados em RBAC.
- Perfis principais: Administrador, Suporte, Desenvolvedor, Infraestrutura.
- Módulos e ações são condicionados por permissões (`users.manage`, `rbac.manage`, `audit.read`, `modules.manage`, etc.).
- Rodas e telas sensíveis são protegidas por visibilidade do menu e por `Can` / `RouteGuard`.
- A sessão expira em `401`, disparando modal de redirecionamento.
- Há regras de status (`Ativo/Inativo`), filtros por data e visibilidade operacional por perfil.

## Integrações

O app integra APIs para:
- autenticação e usuário
- roles e permissões
- módulos do sistema
- integrações externas
- auditoria
- documentos
- tickets e GLPI
- Jira
- campanhas
- calendário
- backups e reports

A lógica de HTTP centraliza no `ApiClient`, com cache em TanStack Query e invalidation após mutações CRUD.

## Regras para futuros agentes

- Respeitar arquitetura existente.
- Não criar novas convenções sem seguir o padrão atual.
- Reutilizar componentes existentes.
- Utilizar o design system já identificado.
- Seguir tipagens já utilizadas.
- Seguir estratégia atual de gerenciamento de estado.
- Preferir consistência ao invés de criar novas abordagens.

Antes de gerar código:

1. Ler architecture.md
2. Ler ui-patterns.md
3. Ler business-rules.md

Prioridade:

1. Reutilizar componentes existentes
2. Seguir o Design System
3. Seguir padrões existentes
4. Não criar novas estruturas de pastas
5. Não criar novos componentes se houver equivalente
`