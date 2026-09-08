Refatoração do Frontend Core — Remoção de Mocks e Integração com API
Contexto
O Módulo Core do Nexus Gateway (Usuários, Roles, Permissões, Módulos, Integrações e Auditoria) foi construído com dados mockados, sem persistência.
O backend já disponibilizou todas as rotas necessárias, incluindo as que estavam faltando (detalhes, ciclo de vida de roles, ativação/inativação de usuários, contagem de integrações por módulo, st_status de integração e auditoria enriquecida).
É necessário refatorar o frontend para remover totalmente os mocks e consumir a API real via React Query, incluindo o fluxo de autenticação (login) e o contexto do usuário logado (/me) que controla menu e permissões.
Usuários afetados: administradores do sistema que utilizam o Módulo Core.
Resumo
A refatoração substitui a camada de dados mockados por hooks de React Query (queries para leitura e mutations para escrita), adiciona o fluxo de login com armazenamento e envio do token JWT, e usa GET /me para montar a sidebar e aplicar o controle de acesso por permissões.
Objetivo
Remover 100% dos dados mockados do Módulo Core.
Consumir a API real em todas as telas via React Query.
Implementar login e obtenção do contexto do usuário via /me.
Garantir cache, invalidação e sincronização consistentes.
Aplicar controle de acesso por permissões retornadas em /me.
Requisitos Funcionais
Autenticação e Contexto
RF001 — Login
Implementar tela/fluxo de login consumindo POST /auth/login com ds_email e senha, recebendo o token JWT.
RF002 — Armazenamento do token
Armazenar o token JWT de forma segura no frontend e enviá-lo no cabeçalho Authorization: Bearer <token> em todas as chamadas autenticadas.
RF003 — Contexto do usuário
Após o login, consumir GET /me para obter user, roles e permissions.
RF004 — Controle de menu e acesso
A sidebar e as ações do Core devem ser exibidas conforme as permissions retornadas por GET /me.
RF005 — Logout / expiração
Em resposta 401, descartar o token e redirecionar ao login.
Padrão de Dados (React Query)
RF006
Toda leitura deve usar queries com chave de cache única por entidade e parâmetros.
RF007
Toda escrita deve usar mutations com invalidação das queries afetadas após sucesso.
RF008
Remover todos os arquivos/estruturas de mock do Módulo Core.
Usuários
RF009
Listagem via GET /users; KPIs (Total, Ativos, Inativos) calculados a partir de fl_active.
RF010
Detalhe via GET /users/{id}.
RF011
Create POST /users; Edit PUT /users/{id}; Delete DELETE /users/{id}.
RF012
Inativar/Ativar via PATCH /users/{id}/active.
RF013
Alterar senha via PATCH /users/{id}/password.
RF014
Vincular role POST /users/{id}/roles; desvincular DELETE /users/{id}/roles/{roleId}.
Roles
RF015
Listagem GET /roles; detalhe GET /roles/{id} (com permissões vinculadas).
RF016
Create POST /roles; Edit PUT /roles/{id}; Delete DELETE /roles/{id}.
RF017
Inativar/Ativar via PATCH /roles/{id}/status.
RF018
Atribuir permissão POST /roles/{id}/permissions; remover DELETE /roles/{id}/permissions/{permId}.
Permissões
RF019
Listagem GET /permissions em modo somente leitura (acessada pela tela de Roles).
Módulos
RF020
Listagem GET /modules (cards), exibindo qt_integrations.
RF021
Detalhe GET /modules/{id} com integrações e permissões vinculadas.
RF022
Ativar/Desativar PATCH /modules/{id}/active.
RF023
Vincular integração POST /modules/{id}/integrations; desvincular DELETE /modules/{id}/integrations/{intId}.
Integrações
RF024
Listagem GET /integrations (cards), exibindo st_status e secret mascarado.
RF025
Detalhe GET /integrations/{id}.
RF026
Edit PUT /integrations/{id}.
RF027
Testar conexão POST /integrations/{id}/test, atualizando st_status na UI após a resposta.
Auditoria
RF028
Listagem GET /audit com paginação e filtros (cd_user, ds_action, ds_entity, from, to, page, pageSize), somente leitura, exibindo ds_user_name, ds_ip e ds_agent.
Regras de Negócio
RN001
Nenhum dado mockado pode permanecer no Módulo Core após a refatoração.
RN002
Após mutation bem-sucedida, invalidar as queries relacionadas (ex.: criar usuário invalida a lista de usuários).
RN003
O controle de acesso usa exclusivamente as permissions de GET /me.
RN004
Em 401, o token é descartado e o usuário é redirecionado ao login.
RN005
O secret de integração nunca é exibido em texto claro; exibir a versão mascarada retornada pela API.
RN006
fl_active (ligado/desligado) e st_status (último teste) são exibidos como informações independentes na integração.
RN007
O item de menu de um módulo só é exibido quando o módulo está ativo e o usuário possui a permissão correspondente.
Fluxo Principal
O usuário acessa a tela de login e informa e-mail e senha.
O frontend chama POST /auth/login e recebe o token JWT.
O token é armazenado e passa a ser enviado em todas as chamadas.
O frontend chama GET /me e monta a sidebar e as permissões.
Ao abrir cada tela do Core, o React Query executa a query correspondente.
Ações de escrita disparam mutations e invalidam as queries afetadas.
Em erro 401, o token é descartado e o usuário retorna ao login.
Áreas Impactadas
Frontend
/app/modules/core (Usuários, Roles, Módulos, Integrações, Auditoria).
Camada de autenticação (login, armazenamento e envio do token).
Cliente HTTP / interceptador para Authorization e tratamento de 401.
Hooks de React Query (queries e mutations) por entidade.
sidebar-modules e provider de permissões baseado em /me.
Remoção dos arquivos de mock.
Backend
Não aplicável (rotas já disponíveis).
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Login: ds_email, senha.
Token JWT: obrigatório nas chamadas autenticadas.
Payloads de escrita: conforme contrato de cada rota.
Filtros de auditoria: opcionais.
Saída
POST /auth/login: token.
GET /me: user, roles, permissions.
Listagens, detalhes e objetos conforme schemas da API.
Critérios de Aceite
 Nenhum dado mockado permanece no Módulo Core.
 Login consome POST /auth/login e armazena o token JWT.
 Todas as chamadas autenticadas enviam Authorization: Bearer.
 GET /me monta a sidebar e aplica as permissões.
 Todas as leituras usam queries e todas as escritas usam mutations.
 Mutations invalidam as queries relacionadas.
 Usuários: listagem, KPIs, detalhe, create, edit, delete, active, senha e vínculo de roles funcionam via API.
 Roles: listagem, detalhe, create, edit, delete, status e vínculo de permissões funcionam via API.
 Permissões exibidas somente leitura pela tela de Roles.
 Módulos: cards com qt_integrations, detalhe, ativar/desativar e vínculo de integrações via API.
 Integrações: cards com st_status e secret mascarado, detalhe, edit e teste de conexão via API.
 Auditoria: listagem paginada com filtros e campos ds_user_name, ds_ip, ds_agent.
 Em erro 401, o usuário é redirecionado ao login.
Cenários de Exceção
Cenário 1 — Credenciais inválidas
POST /auth/login retorna 401. Exibir mensagem de erro sem revelar qual campo está incorreto.
Cenário 2 — Token expirado
Qualquer chamada retorna 401. Descartar o token e redirecionar ao login.
Cenário 3 — Permissão ausente
A permissão necessária não está em /me. O item de menu/ação não é exibido.
Cenário 4 — Falha de rede/servidor
Query/mutation falha. Exibir mensagem de erro, manter estado anterior e permitir retry.
Cenário 5 — Teste de conexão falho
POST /integrations/{id}/test retorna ok: false. Exibir a message e atualizar st_status para falha na UI.
Cenário 6 — Exclusão de role vinculada
DELETE /roles/{id} retorna 409. Exibir mensagem informando o conflito.
Dependências
shadcn/ui
React Query
Implementação em /app/modules/core
Registro no sidebar-modules
API Nexus Backend com todas as rotas do Core disponíveis (confirmado).
Resultado Esperado
Após a refatoração, o Módulo Core opera integralmente com dados reais da API via React Query, com login funcional, contexto de usuário via /me, controle de acesso por permissões, cache e invalidação consistentes, e sem nenhum dado mockado.
Fora de Escopo
Alterações no backend (rotas já entregues).
CRUD de permissões (somente leitura).
Create de módulos e create de integrações no frontend (mantido fora de escopo pela especificação anterior).
Sincronização de integrações (POST /integrations/{id}/sync), salvo confirmação de que haverá acionamento na UI.
Referências
Documentação OpenAPI 3.0.3 — "Nexus Backend API", versão 1.0.0.
Especificação anterior: "Módulo Core — Nexus Gateway (Frontend)".
Especificação de rotas faltantes: "FEATURE-SEM-ID-rotas-faltantes-core-backend.md".
Observações
Decisão registrada: os KPIs de usuários serão calculados no frontend a partir da listagem.
Confirmado: todas as rotas faltantes foram criadas no backend; os endpoints de detalhe, status de role, active de usuário, st_status, qt_integrations e campos de auditoria são tratados como disponíveis.
Pendência não bloqueante: definir se POST /integrations/{id}/sync terá acionamento na UI.
Recomendação: centralizar o envio do token e o tratamento de 401 em um interceptador único do cliente HTTP para evitar duplicação.