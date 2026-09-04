Etapa 5 — Gerenciador de Módulos
Contexto
Quinta etapa do módulo core. Implementa o gerenciamento de módulos de negócio e o vínculo com integrações. Dados mockados via React Query.
Resumo
Listagem de módulos em cards, com cards quantitativos e filtros, CRUD visual, tela de detalhe do módulo e vínculo/desvínculo de integrações.
Objetivo
Permitir gerenciar módulos, controlar sua ativação (exibição no menu/acesso) e associar integrações.
Requisitos Funcionais
RF001
Exibir o Gerenciador de Módulos como listagem em cards, com cards quantitativos e filtros.
RF002
Permitir criar, editar e excluir módulos (efeito visual sobre mocks).
RF003
Módulo possui: nome, descrição, status (Ativo/Inativo) e exibe a quantidade de integrações vinculadas.
RF004
Na criação do módulo, permitir selecionar integrações que fazem sentido para ele.
RF005
Módulo ativo aparece no menu e libera acesso; inativo não aparece e não libera acesso.
RF006
Na tela de gerenciamento de um módulo, permitir conectar/desconectar integrações.
RF007
O módulo core não deve aparecer como desativável nesta listagem.
Regras de Negócio
RN001
Um módulo pode ter 1 ou mais integrações.
RN002
A quantidade de integrações vinculadas é refletida no card.
RN003
Módulo ativo é exibido no menu; inativo não.
RN004
Core não é desativável.
Fluxo Principal
Usuário acessa o Gerenciador de Módulos (cards).
Sistema exibe módulos com status e contagem de integrações.
Usuário cria/edita/exclui módulo e seleciona integrações.
Usuário acessa o detalhe e conecta/desconecta integrações.
Sistema atualiza contagem e visibilidade no menu (mock).
Áreas Impactadas
Frontend
Listagem de módulos em cards, formulário de módulo, tela de detalhe, seleção/vínculo de integrações, menu condicional.
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Nome (obrigatório), Descrição (obrigatória), Status (obrigatório), Integrações (seleção múltipla).
Saída
Card do módulo: nome, descrição, status, quantidade de integrações.
Cards quantitativos: módulos ativos/inativos, total.
Critérios de Aceite
 Listagem de módulos em cards com cards quantitativos e filtros.
 Criar, editar e excluir módulos (visual em mock).
 Card exibe quantidade de integrações vinculadas.
 Seleção de integrações na criação funciona.
 Módulo ativo aparece no menu e libera acesso; inativo não.
 Detalhe do módulo permite conectar/desconectar integrações.
 Core não aparece como desativável.
Cenários de Exceção
Cenário 1
Módulo sem integrações: contagem 0 e estado vazio informativo.
Cenário 2
Formulário de módulo incompleto: bloqueia salvar e exibe validação.
Dependências
Etapa 1 (fundação). Etapa 6 (integrações) para vínculo completo — usar mock de integrações se a Etapa 6 ainda não existir.
Resultado Esperado
Gerenciador de Módulos funcional com CRUD, detalhe e vínculo de integrações.
Fora de Escopo
Configuração/teste de integrações (Etapa 6). API/persistência.
Referências
Etapa 1.
Observações
O conjunto de integrações disponíveis é mockado.