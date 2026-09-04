Etapa 1 — Fundação do Módulo Core
Contexto
Primeira etapa da refatoração do módulo core do frontend do Nexus Gateway. Estabelece a base sobre a qual todas as demais telas serão construídas. O conteúdo atual de /app/modules/core deve ser removido e reconstruído. Dados 100% mockados, consumidos via React Query, sem API real.
Resumo
Criação da estrutura base do módulo, camada de dados mockada, navegação e componentes reutilizáveis (DataTable com paginação, cards quantitativos e filtros) usando shadcn/ui.
Objetivo
Disponibilizar a fundação técnica-visual do módulo core, permitindo que as etapas seguintes reutilizem componentes padronizados e a camada de mocks.
Requisitos Funcionais
RF001
Remover completamente a implementação existente em /app/modules/core e reconstruir a base.
RF002
Estruturar a camada de dados mockada consumida via React Query, sem chamadas HTTP reais.
RF003
Criar a navegação do módulo core com as áreas: Usuários, Roles, Permissões, Módulos, Integrações e Auditoria.
RF004
Criar componente reutilizável de DataTable com paginação.
RF005
Criar componente reutilizável de cards quantitativos.
RF006
Criar componente reutilizável de filtros para listagens.
RF007
Garantir que o módulo core esteja sempre disponível e não seja desativável.
Regras de Negócio
RN001
Todos os dados são mockados; sem persistência.
RN002
Toda a UI utiliza shadcn/ui, com consistência visual entre telas.
RN003
O módulo core não pode ser desativado.
Fluxo Principal
O usuário acessa o módulo core.
O sistema exibe a navegação com as áreas administrativas.
Componentes base (DataTable, cards, filtros) ficam disponíveis para reuso.
Áreas Impactadas
Frontend
/app/modules/core (reconstrução da base), navegação/menu, componentes reutilizáveis, camada de mocks com React Query.
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Não aplicável nesta etapa (infraestrutura de base).
Saída
Estrutura de navegação e componentes reutilizáveis disponíveis.
Critérios de Aceite
 Conteúdo anterior de /app/modules/core removido e base reconstruída.
 Camada de dados mockada funciona via React Query, sem HTTP real.
 Navegação exibe todas as áreas do core.
 DataTable com paginação reutilizável disponível.
 Cards quantitativos reutilizáveis disponíveis.
 Componente de filtros reutilizável disponível.
 Módulo core não possui opção de desativação.
Cenários de Exceção
Cenário 1
Tentativa de desativar o core: ação indisponível, core permanece ativo.
Dependências
shadcn/ui e React Query configurados no projeto.
Resultado Esperado
Base do módulo pronta, com navegação e componentes reutilizáveis, servindo de fundação para as etapas seguintes.
Fora de Escopo
Implementação das telas de negócio (etapas posteriores).
API, persistência e integrações reais.
Referências
Pasta /app/modules/core. Biblioteca shadcn/ui.
Observações
Etapa base. As telas específicas são tratadas nas etapas 2 a 7.