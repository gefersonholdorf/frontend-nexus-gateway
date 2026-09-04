Etapa 3 — Roles e Permissões
Contexto
Terceira etapa do módulo core. Implementa a gestão de roles e a atribuição de permissões. Permissões são fixas (sem CRUD). Dados mockados via React Query.
Resumo
Tela de Roles com DataTable paginada, filtros, cards quantitativos e CRUD visual; atribuição/remoção de permissões (fixas) em cada role.
Objetivo
Permitir gerenciar roles e vincular/desvincular permissões, mantendo permissões apenas como catálogo fixo.
Requisitos Funcionais
RF001
Exibir Roles em DataTable com paginação, com filtros e cards quantitativos.
RF002
Permitir criar, editar e excluir roles (efeito visual sobre mocks).
RF003
Role possui: nome, descrição, status e permissões vinculadas.
RF004
Permitir atribuir e remover permissões em uma role.
RF005
Permissões são fixas (sem CRUD) e possuem: nome, descrição, status e key.
Regras de Negócio
RN001
Uma role pode ter várias permissões.
RN002
Permissões não têm CRUD; apenas listagem para atribuição/remoção.
RN003
CRUD de roles atua apenas sobre mocks.
Fluxo Principal
Usuário acessa a tela de Roles.
Sistema exibe cards quantitativos e DataTable paginada com filtros.
Usuário cria/edita/exclui uma role.
Usuário atribui/remove permissões do catálogo fixo.
Sistema reflete as alterações em memória (mock).
Áreas Impactadas
Frontend
Tela de Roles, formulário de role, componente de atribuição de permissões (lista de permissões fixas).
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Nome (obrigatório), Descrição (obrigatória), Status (obrigatório), Permissões (seleção múltipla).
Saída
Listagem de roles: nome, descrição, status, permissões vinculadas.
Listagem de permissões: nome, descrição, status, key.
Cards quantitativos: total de roles, roles por status.
Critérios de Aceite
 DataTable de roles com paginação, filtros e cards quantitativos.
 Criar, editar e excluir roles (visual em mock).
 Role exibe nome, descrição, status e permissões.
 Atribuir e remover permissões funciona.
 Permissões aparecem apenas para listagem/atribuição (sem CRUD) e exibem nome, descrição, status e key.
Cenários de Exceção
Cenário 1
Formulário de role incompleto: bloqueia salvar e exibe validação.
Dependências
Etapa 1 (fundação e componentes).
Resultado Esperado
Gestão de roles funcional com atribuição de permissões fixas.
Fora de Escopo
Bloqueio por permissões (Etapa 4). CRUD de permissões. API/persistência.
Referências
Etapa 1.
Observações
O catálogo de permissões é mockado e fixo.