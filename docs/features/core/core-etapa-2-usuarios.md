Etapa 2 — Usuários
Contexto
Segunda etapa do módulo core. Implementa a gestão de usuários sobre a fundação da Etapa 1. Dados mockados via React Query.
Resumo
Tela de Usuários com DataTable paginada, filtros, cards quantitativos e CRUD visual, incluindo vínculo de roles.
Objetivo
Permitir listar, criar, editar, excluir usuários e gerenciar suas roles (efeito visual sobre mocks).
Requisitos Funcionais
RF001
Exibir Usuários em DataTable com paginação, com filtros e cards quantitativos.
RF002
Permitir criar, editar e excluir usuários (efeito visual sobre dados mockados).
RF003
Usuário possui: nome, e-mail, cargo, status (Ativo, Inativo, Bloqueado), data de criação e roles vinculadas.
RF004
Permitir vincular e desvincular roles a um usuário (1 ou mais).
Regras de Negócio
RN001
Status de usuário restrito a Ativo, Inativo e Bloqueado.
RN002
Um usuário pode ter 1 ou mais roles.
RN003
CRUD atua apenas sobre mocks, sem persistência.
Fluxo Principal
Usuário acessa a tela de Usuários.
Sistema exibe cards quantitativos e a DataTable paginada com filtros.
Usuário cria/edita/exclui um usuário.
Usuário vincula/desvincula roles.
Sistema reflete as alterações em memória (mock).
Áreas Impactadas
Frontend
Tela de Usuários, formulário de usuário, seleção de roles.
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Nome (obrigatório), E-mail (obrigatório, válido), Cargo (obrigatório), Status (obrigatório), Roles (seleção múltipla).
Saída
Listagem: nome, e-mail, cargo, status, data de criação, roles vinculadas.
Cards quantitativos: totais por status.
Critérios de Aceite
 DataTable de usuários com paginação, filtros e cards quantitativos.
 Criar, editar e excluir usuários (visual em mock).
 Usuário exibe nome, e-mail, cargo, status, data de criação e roles.
 Vincular e desvincular roles funciona.
 Validação impede salvar com campos obrigatórios vazios ou e-mail inválido.
Cenários de Exceção
Cenário 1
Formulário incompleto/e-mail inválido: bloqueia salvar e exibe validação no campo.
Dependências
Etapa 1 (fundação e componentes reutilizáveis).
Roles disponíveis (mock) para vínculo — Etapa 3 pode refinar; aqui usar mock de roles.
Resultado Esperado
Tela de Usuários funcional com CRUD visual e gestão de roles.
Fora de Escopo
Bloqueio por permissões (Etapa 4). API/persistência.
Referências
Etapa 1.
Observações
Utilizar mock de roles para o vínculo; a gestão completa de roles é da Etapa 3.