Etapa 6 — Gerenciador de Integrações
Contexto
Sexta etapa do módulo core. Implementa o gerenciamento de integrações externas simuladas (Jira, GLPI, Microsoft, OpenVPN). Dados mockados via React Query.
Resumo
Listagem de integrações em cards, com cards quantitativos e filtros, ativar/desativar, formulário de configuração (mockado) e ação de testar conexão simulada.
Objetivo
Permitir gerenciar integrações e simular teste de conexão com resultado fixo por integração.
Requisitos Funcionais
RF001
Exibir o Gerenciador de Integrações como listagem em cards, com cards quantitativos e filtros.
RF002
Integração possui: nome, descrição, status e formulário de configuração (campos mockados/visuais).
RF003
Permitir ativar e desativar integrações.
RF004
Disponibilizar a ação Testar Conexão com resultado simulado.
RF005
Resultado do Testar Conexão fixo por integração: Jira = sucesso, Microsoft = falha.
Regras de Negócio
RN001
Jira retorna sucesso e Microsoft retorna falha no teste de conexão.
RN002
GLPI e OpenVPN retornam sucesso por padrão (premissa ajustável).
RN003
Dados e resultados são simulados; sem persistência.
Fluxo Principal
Usuário acessa o Gerenciador de Integrações (cards).
Sistema exibe integrações com status e cards quantitativos.
Usuário ativa/desativa uma integração.
Usuário abre o formulário de configuração (mock) e edita campos visuais.
Usuário aciona Testar Conexão e recebe o resultado simulado.
Áreas Impactadas
Frontend
Listagem de integrações em cards, formulário de configuração, feedback de teste de conexão.
Backend
Não aplicável.
Banco de Dados
Não aplicável.
Dados Necessários
Entrada
Nome (obrigatório), Descrição (obrigatória), Status (obrigatório), Campos de configuração (ex.: URL, chave/token, usuário — mockados).
Saída
Card da integração: nome, descrição, status, resultado do teste.
Cards quantitativos: integrações ativas/inativas, total.
Critérios de Aceite
 Listagem de integrações em cards com cards quantitativos e filtros.
 Ativar e desativar integrações funciona.
 Formulário de configuração exibido (mockado/visual).
 Testar Conexão retorna sucesso para Jira e falha para Microsoft.
 Feedback do teste é exibido claramente ao usuário.
Cenários de Exceção
Cenário 1
Testar Conexão no Microsoft: exibe falha, sem alterar o status configurado.
Dependências
Etapa 1 (fundação).
Resultado Esperado
Gerenciador de Integrações funcional com configuração e teste de conexão simulados.
Fora de Escopo
Conexão real com serviços externos. API/persistência.
Referências
Etapa 1. Etapa 5 (vínculo módulo–integração).
Observações
Comportamento de GLPI e OpenVPN definido como sucesso — ajustável. Confirmar permanência do OpenVPN.