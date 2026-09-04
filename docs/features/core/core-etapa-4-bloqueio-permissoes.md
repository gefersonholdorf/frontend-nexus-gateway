Etapa 4 — Bloqueio por Permissões (Simulado)
Contexto
Quarta etapa do módulo core. Aplica o controle de acesso simulado baseado nas permissões vinculadas às roles (definidas na Etapa 3). Dados mockados.
Resumo
Aplicação de bloqueio de acesso simulado: telas, botões e ações ficam indisponíveis quando o perfil atual não possui a permissão correspondente.
Objetivo
Simular o comportamento de segurança por permissões, demonstrando o controle de acesso na interface.
Requisitos Funcionais
RF001
Aplicar bloqueio de acesso simulado com base nas permissões do perfil atual (mock).
RF002
Ocultar ou desabilitar ações/telas/botões quando a permissão correspondente não estiver presente.
Regras de Negócio
RN001
Sem a permissão correspondente, a ação/tela não fica acessível.
RN002
O perfil atual e suas permissões são definidos por mock nesta fase.
Fluxo Principal
Sistema identifica o perfil atual (mock) e suas permissões.
Ao renderizar telas/ações, verifica a permissão necessária.
Elementos sem permissão são ocultados ou desabilitados.
Áreas Impactadas
Frontend
Navegação, telas do core, botões de ação (verificação de permissão).
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Permissões do perfil atual (mock), keys de permissão por ação/tela.
Saída
Interface com elementos condicionados por permissão.
Critérios de Aceite
 Ações/telas sem permissão são ocultadas ou desabilitadas.
 Com a permissão presente, a ação/tela fica acessível.
 O comportamento é consistente em todas as telas do core.
Cenários de Exceção
Cenário 1
Perfil sem permissão tenta acessar ação: acesso não é liberado.
Dependências
Etapa 3 (permissões e roles). Etapas 2, 5, 6, 7 para aplicar o bloqueio nas respectivas telas.
Resultado Esperado
Controle de acesso simulado aplicado de forma consistente.
Fora de Escopo
Autenticação/autorização real. API/persistência.
Referências
Etapa 3.
Observações
Recomenda-se aplicar esta etapa após as telas existirem, ou incrementalmente conforme cada tela é concluída.