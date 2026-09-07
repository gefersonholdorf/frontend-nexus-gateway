# Módulo Core — Nexus Gateway (Frontend)

## Contexto

O frontend do Nexus Gateway não possui um módulo administrativo padronizado e consistente. Caso exista qualquer estrutura relacionada à administração do sistema, ela deverá ser totalmente reconstruída conforme esta especificação.

O objetivo é entregar o módulo **Core**, responsável pela administração do sistema, cobrindo:

- Usuários
- Roles (Perfis)
- Permissões
- Módulos
- Integrações
- Auditoria

**Todos os dados são mockados**, sem backend e sem persistência.

---

# Resumo

O módulo será composto por 5 menus:

1. Usuários
2. Roles
3. Módulos
4. Integrações
5. Auditoria

Permissões não possuem item próprio e são acessadas pela tela de Roles.

---

# Objetivo

- Visualizar e navegar pelas áreas administrativas.
- Consultar KPIs e listagens.
- Abrir modais de CRUD sem persistência.
- Simular controle de acesso por permissões.
- Consultar auditoria somente leitura.

---

# Requisitos Funcionais

## Estrutura

### RF001
Reconstruir completamente o módulo Core.

### RF002
Sidebar contendo exatamente:
- Usuários
- Roles
- Módulos
- Integrações
- Auditoria

### RF003
Itens devem respeitar permissões do usuário logado.

---

## Usuários

### RF004
Listagem em DataTable.

### RF005
KPIs:
- Total
- Ativos
- Inativos

### RF006
Campos:
- Nome
- E-mail
- Cargo (ds_role_description)
- Status
- Data de criação
- Roles vinculadas

### RF007
Página de detalhe.

### RF008
Modais:
- Create
- Edit
- Inactive
- Delete

### RF009
Permitir vincular/desvincular roles visualmente.

---

## Roles

### RF010
Listagem em DataTable.

### RF011
Campos:
- Nome
- Descrição
- Status
- Permissões

### RF012
Página de detalhe.

### RF013
Modais:
- Create
- Edit
- Inactive
- Delete

### RF014
Permitir atribuir/remover permissões visualmente.

---

## Permissões

### RF015
Sem menu próprio.

### RF016
Campos:
- ds_key
- ds_name
- ds_description

Somente leitura.

---

## Módulos

### RF017
Listagem em cards.

### RF018
Sem Create.

### RF019
Campos:
- Nome
- Descrição
- Status
- Quantidade de integrações

### RF020
Card deve exibir quantidade de integrações.

### RF021
Página de detalhe.

### RF022
Modais:
- Edit
- Inactive

### RF023
Selecionar/desvincular integrações.

---

## Integrações

### RF024
Listagem em cards.

### RF025
Campos:
- Tipo
- Nome
- fl_active
- st_status

### RF026
Modais:
- Edit
- Inactive

### RF027
Exibir ds_config dinamicamente.

Exibir ds_secret mascarado.

### RF028
Ação Testar Conexão.

---

## Auditoria

### RF029
Somente leitura.

### RF030
Campos:
- Usuário
- Módulo/Entidade
- Ação
- Data/Hora
- IP
- Agente

---

# Regras de Negócio

## RN001
Core não pode ser desativado.

## RN002
Demais módulos iniciam inativos.

## RN003
Módulo ativo aparece no menu.

## RN004
Usuário possui apenas status Ativo/Inativo.

## RN005
Cargo é diferente de Role.

## RN006
Usuário possui múltiplas roles.

## RN007
Role possui múltiplas permissões.

## RN008
Permissões são fixas.

## RN009
Módulo possui múltiplas integrações.

## RN010
Quantidade de integrações sempre exibida.

## RN011
Controle de acesso por permissões.

## RN012
Teste de conexão:

| Integração | Resultado |
|------------|------------|
| Jira | SUCCESS |
| Microsoft | FAILED |
| GLPI | SUCCESS |
| OpenVPN | SUCCESS |

## RN013
Auditoria somente leitura.

## RN014
Todos os dados são mockados.

## RN015
fl_active = ligado/desligado.

st_status = resultado do último teste.

---

# Dependências

- shadcn/ui
- React Query
- Implementação em /app/modules/core
- Registro no sidebar-modules

---

# Fora de Escopo

- Backend
- Persistência
- APIs reais
- Integrações reais
- CRUD de permissões
- Create de módulos
- Create de integrações

---

# Critérios de Aceite

- Core reconstruído
- Sidebar com 5 itens
- Controle por permissões
- Dados mockados
- KPIs e filtros
- DataTables
- Cards
- Modais
- Controle de acesso
- Teste de conexão simulado
- Auditoria somente leitura
- Interface em shadcn/ui
