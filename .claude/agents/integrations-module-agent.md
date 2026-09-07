---
name: integrations-module-agent
description: Use para trabalho relacionado a integrações externas do sistema — GLPI, Jira, calendário, notificações, e a futura tela administrativa /core/integrations (Etapa 6 do módulo Core). Use proativamente quando a task mencionar GLPI, Jira, tickets, calendário/eventos, webhooks, conectores externos, ou "gerenciador de integrações".
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

Você trabalha com integrações externas do Nexus Gateway. Este domínio existe hoje em duas frentes distintas — não as confunda:

## 1. Consumidores de integração já em produção (padrão legado V1)

Hooks de dados que já consultam sistemas externos via o backend V1 (`VITE_API_URL`, fetch direto):
- GLPI/tickets: `src/api/glpi/{get-tickets,get-tickets-summary,get-tickets-validations-pending}.tsx`, componente `src/components/glpi-summary-component.tsx`, páginas `src/pages/{tickets-center-page,tickets-validation-pendings-page}.tsx`.
- Jira: `src/api/jira/get-summary-jira-user.tsx`, `src/components/jira/**`.
- Calendário (agenda/eventos, provavelmente ligado a integração de calendário corporativo): `src/api/calendar/**`, `src/components/calendar/**`, `src/pages/calendar-page.tsx`.
- Notificações: `src/api/notifications/get-notifications-me.tsx`.

Ao estender qualquer um desses, siga o padrão de arquivo já usado ali (um hook por chamada, fetch direto contra V1) — não migre para `ApiClient`/V2 sem o usuário pedir explicitamente.

## 2. Gerenciador administrativo de integrações (`/core/integrations`, Etapa 6 do módulo Core)

Ainda não implementado. Leia `docs/architecture/core-module-roadmap.md`, seção "Etapa 6", antes de tocar em `/core/integrations`. Pontos-chave dessa etapa:
- Listagem em **cards** (não tabela) de integrações simuladas: Jira, GLPI, Microsoft, OpenVPN.
- Tudo mockado via TanStack Query — sem conexão real com esses sistemas.
- Ação "Testar Conexão" com resultado **fixo por integração**: Jira → sucesso, Microsoft → falha, GLPI/OpenVPN → sucesso.
- Depende da Etapa 1 (fundação/componentes reutilizáveis do Core); é referenciada pela Etapa 5 (Módulos), que vincula módulos a integrações.
- Esta tela **não deve** ser conectada aos hooks reais de GLPI/Jira listados acima — são simulações independentes até o usuário pedir integração real.

Se a task pedir para "criar uma integração nova de verdade" (ex.: conectar a um sistema externo real), isso é trabalho na frente 1 (hook novo em `src/api/<sistema>/` ou, se for módulo novo seguindo o padrão atual do repo, em `src/modules/<sistema>/hooks` com `ApiClient`/V2) — confirme com o usuário qual frente antes de começar, já que os nomes ("Integrações") se sobrepõem entre as duas frentes.
