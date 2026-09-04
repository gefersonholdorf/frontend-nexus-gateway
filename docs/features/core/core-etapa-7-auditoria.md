Etapa 7 — Auditoria
Contexto
Sétima e última etapa do módulo core. Implementa a consulta de auditoria (somente leitura) com dados mockados via React Query.
Resumo
Tela de Auditoria somente leitura, em DataTable com paginação, com filtros e cards quantitativos.
Objetivo
Permitir consultar o histórico de ações do sistema (dados mockados estáticos).
Requisitos Funcionais
RF001
Exibir a Auditoria como listagem somente leitura em DataTable com paginação, com filtros e cards quantitativos.
RF002
Cada registro contém: usuário responsável, ação, mensagem, IP, horário e módulo.
RF003
Disponibilizar filtros (ex.: usuário, ação, módulo, período).
Regras de Negócio
RN001
Auditoria é somente leitura; sem criar, editar ou excluir.
RN002
Registros são mockados estáticos; ações nas telas não geram novos registros.
Fluxo Principal
Usuário acessa a tela de Auditoria.
Sistema exibe cards quantitativos e DataTable paginada.
Usuário aplica filtros para consultar registros.
Áreas Impactadas
Frontend
Tela de Auditoria, DataTable, filtros, cards quantitativos.
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Filtros: usuário responsável, ação, módulo, período/horário.
Saída
Registro: usuário responsável, ação, mensagem, IP, horário, módulo.
Cards quantitativos: total de registros, por ação/módulo.
Critérios de Aceite
 Auditoria somente leitura em DataTable com paginação.
 Filtros e cards quantitativos presentes.
 Cada registro exibe usuário responsável, ação, mensagem, IP, horário e módulo.
 Não há ações de criar, editar ou excluir.
Cenários de Exceção
Cenário 1
Filtro sem resultados: exibe estado vazio informativo.
Dependências
Etapa 1 (fundação e DataTable/filtros).
Resultado Esperado
Tela de Auditoria funcional, somente leitura, com filtros e dados mockados.
Fora de Escopo
Geração automática de registros a partir de ações. API/persistência.
Referências
Etapa 1.
Observações
Registros mockados estáticos, conforme definido no escopo geral.