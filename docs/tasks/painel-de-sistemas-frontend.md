# Painel de Sistemas — Frontend

## Contexto

O backend do módulo **Painel de Sistemas** já está definido e expõe um CRUD de sistemas/serviços e uma operação de verificação de status sob demanda. Falta a camada de **interface** que permita aos usuários autorizados cadastrar, editar, excluir, listar, acessar e verificar a disponibilidade desses recursos de forma organizada.

Esta especificação cobre exclusivamente o **frontend**, consumindo os endpoints já contratados. Usuários afetados: colaboradores com a permissão `hub_services_manage`.

---

## Resumo

Interface para gestão do catálogo de sistemas e serviços, com **listagem em dois modos de visualização (datatable e cards)**, formulário de **criação/edição**, ação de **acesso ao recurso** (abertura da URL em nova aba), **verificação de status individual e em lote** sob demanda, e **exclusão com confirmação**. Busca, filtros, ordenação e paginação são realizados no **frontend**, sobre a coleção retornada pelo backend.

---

## Objetivo

Permitir que usuários com a permissão `hub_services_manage` localizem, cadastrem, mantenham, acessem e verifiquem a disponibilidade de sistemas e serviços por meio de uma interface organizada e responsiva às regras já definidas no backend.

---

## Requisitos Funcionais

### RF001
A interface deve exibir a **listagem** dos registros obtidos em `GET /hub-services`, permitindo alternar entre os modos **datatable** e **cards**.

### RF002
A interface deve permitir **criar** um registro por meio de formulário, enviando os dados para `POST /hub-services`.

### RF003
A interface deve permitir **editar** um registro existente por meio de formulário, enviando os dados para `PUT /hub-services/{id}`.

### RF004
A interface deve permitir **excluir** um registro, com **diálogo de confirmação** prévio, acionando `DELETE /hub-services/{id}`.

### RF005
A interface deve permitir **acessar** o recurso abrindo a `ds_access_url` em **nova aba**: no modo datatable, pelo clique na linha/título; no modo cards, pelo clique no corpo do card.

### RF006
A interface deve permitir **verificar o status individual** de um registro sob demanda, acionando `POST /hub-services/{id}/status-check`, e exibir o resultado (UP/DOWN, httpStatus, message).

### RF007
A interface deve permitir **verificar o status de todos os registros** ("Verificar todos"), disparando as verificações individuais apenas dos registros que possuem `ds_status_url`.

### RF008
A interface deve oferecer **busca, filtros (por Tipo e por Ambiente), ordenação e paginação** realizados no **frontend**, sobre a coleção já carregada.

### RF009
A interface deve refletir o **carregamento por item** durante a verificação de status, sem travar a tela.

---

## Regras de Negócio

### RN001
Todas as ações da interface exigem que o usuário possua a permissão **`hub_services_manage`**. Sem ela, o acesso ao módulo deve ser negado/oculto.

### RN002
Os campos **`ds_title`, `ds_description`, `st_type` e `st_environment`** são **obrigatórios** no formulário. Os demais (`ds_access_url`, `ds_ip`, `ds_port`, `ds_status_url`) são **opcionais**.

### RN003
`st_type` aceita apenas **SYSTEM** ou **SERVICE**; `st_environment` aceita apenas **PROD** ou **HOM**. A interface deve apresentar esses valores em opções controladas.

### RN004
**IP e Porta são interdependentes**: ambos são opcionais, mas **se um for preenchido, o outro passa a ser obrigatório**. A validação deve ocorrer **antes do envio**, bloqueando o submit e sinalizando os campos.

### RN005
Quando informadas, `ds_access_url` e `ds_status_url` devem ter formato válido e protocolo **http** ou **https**. A validação deve ocorrer no frontend antes do envio.

### RN006
Quando o registro **não possuir `ds_access_url`**, a **ação de acesso deve ficar desabilitada** (linha/card não clicável para acesso), com indicação visual.

### RN007
Quando o registro **não possuir `ds_status_url`**, o botão **"Verificar status" deve ficar desabilitado**, evitando a chamada que retornaria HTTP 400.

### RN008
A **exclusão** deve exigir **confirmação explícita** do usuário em diálogo antes de acionar o `DELETE`, dado que a remoção é física e definitiva.

### RN009
O resultado da verificação de status deve ser exibido conforme o retorno:
- **UP** → indicador de "Disponível", apresentando `httpStatus`.
- **DOWN** → indicador de "Indisponível", apresentando `httpStatus` e `message`.

### RN010
A verificação **"Verificar todos"** dispara **N chamadas individuais** (não há limite), com resultado exibido por item conforme cada resposta chega. Registros sem `ds_status_url` são ignorados nessa ação.

### RN011
Busca, filtros, ordenação e paginação operam **client-side**, pois `GET /hub-services` não recebe parâmetros e retorna a coleção completa.

---

## Fluxo Principal

### Listagem e acesso
1. O usuário abre o módulo (com `hub_services_manage`).
2. A interface chama `GET /hub-services` e carrega a coleção.
3. O usuário escolhe o modo de visualização (datatable ou cards).
4. O usuário aplica busca/filtros/ordenação e navega pela paginação (client-side).
5. Ao clicar na linha/título (datatable) ou no corpo do card, a `ds_access_url` abre em nova aba; se não houver URL, a ação está desabilitada.

### Criação/edição
1. O usuário aciona "Novo" (ou "Editar" em um registro).
2. A interface exibe o formulário com os campos e opções controladas.
3. O usuário preenche os dados.
4. A interface valida obrigatoriedade, domínios (tipo/ambiente), interdependência IP/Porta e formato das URLs.
5. A interface envia `POST /hub-services` (criação) ou `PUT /hub-services/{id}` (edição).
6. Em sucesso, a interface atualiza a listagem e informa o resultado.

### Verificação de status (individual)
1. O usuário aciona "Verificar status" em um registro que possui `ds_status_url`.
2. A interface exibe carregamento no item e chama `POST /hub-services/{id}/status-check`.
3. Ao responder, a interface exibe Disponível/Indisponível com `httpStatus` (e `message` quando DOWN).

### Verificação de status (todos)
1. O usuário aciona "Verificar todos".
2. A interface dispara verificações individuais apenas para registros com `ds_status_url`.
3. Cada item exibe carregamento e, em seguida, seu resultado, sem travar a tela.

### Exclusão
1. O usuário aciona "Excluir" em um registro.
2. A interface exibe diálogo de confirmação.
3. Ao confirmar, a interface chama `DELETE /hub-services/{id}` e atualiza a listagem.

---

## Áreas Impactadas

### Frontend
- Tela de listagem com dois modos de visualização (datatable e cards) e alternância entre eles.
- Formulário de criação/edição com validações.
- Ação de acesso ao recurso (abertura em nova aba).
- Verificação de status individual e em lote, com estados de carregamento por item.
- Diálogo de confirmação de exclusão.
- Busca, filtros, ordenação e paginação client-side.
- Controle de exibição/acesso conforme a permissão `hub_services_manage`.

### Backend
- Não aplicável (consumo dos endpoints já contratados: `GET /hub-services`, `POST /hub-services`, `GET /hub-services/{id}`, `PUT /hub-services/{id}`, `DELETE /hub-services/{id}`, `POST /hub-services/{id}/status-check`).

### Banco de Dados
- Não aplicável.

---

## Dados Necessários

### Entrada (formulário)
- **st_type**: SYSTEM ou SERVICE. Obrigatório. Opção controlada.
- **st_environment**: PROD ou HOM. Obrigatório. Opção controlada.
- **ds_title**: texto. Obrigatório (mínimo 1 caractere).
- **ds_description**: texto. Obrigatório (mínimo 1 caractere).
- **ds_access_url**: texto. Opcional. Formato http/https válido.
- **ds_ip**: texto. Opcional. Interdependente com a porta.
- **ds_port**: número. Opcional. Interdependente com o IP.
- **ds_status_url**: texto. Opcional. Formato http/https válido.

### Saída (exibição)
- **Listagem**: `cd_id`, `st_type`, `st_environment`, `ds_title`, `ds_description`, `ds_access_url`, `ds_ip`, `ds_port`, `ds_status_url`, `dt_created_at`, `dt_updated_at`.
- **Resultado de status**: `status` (UP/DOWN), `httpStatus`, `message`.

---

## Critérios de Aceite

- [ ] Usuário sem `hub_services_manage` não acessa/visualiza o módulo.
- [ ] A listagem carrega os registros de `GET /hub-services` e permite alternar entre datatable e cards.
- [ ] É possível criar um registro válido via formulário (`POST /hub-services`).
- [ ] É possível editar um registro existente via formulário (`PUT /hub-services/{id}`).
- [ ] O formulário bloqueia o envio quando falta título, descrição, tipo ou ambiente.
- [ ] O formulário só permite SYSTEM/SERVICE para tipo e PROD/HOM para ambiente.
- [ ] Ao preencher IP sem porta (ou porta sem IP), o envio é bloqueado e os campos são sinalizados.
- [ ] URLs com formato inválido ou protocolo diferente de http/https bloqueiam o envio.
- [ ] Clicar na linha/título (datatable) ou no corpo do card abre `ds_access_url` em nova aba.
- [ ] Quando não há `ds_access_url`, a ação de acesso fica desabilitada com indicação visual.
- [ ] Os botões de ação (Editar, Excluir, Verificar status) não disparam o acesso à URL.
- [ ] A verificação individual chama `POST /hub-services/{id}/status-check` e exibe UP/DOWN, httpStatus e message (quando DOWN).
- [ ] Durante a verificação, o item exibe estado de carregamento sem travar a tela.
- [ ] Quando não há `ds_status_url`, o botão "Verificar status" fica desabilitado.
- [ ] "Verificar todos" dispara verificações apenas para registros com `ds_status_url` e exibe cada resultado individualmente.
- [ ] A exclusão exige confirmação em diálogo antes de chamar `DELETE /hub-services/{id}`.
- [ ] Busca, filtros (Tipo/Ambiente), ordenação e paginação funcionam no frontend sobre a coleção carregada.

---

## Cenários de Exceção

### Cenário 1 — Campos obrigatórios ausentes
Condição: envio do formulário sem título, descrição, tipo ou ambiente. Comportamento: o envio é bloqueado e os campos obrigatórios são sinalizados.

### Cenário 2 — IP e Porta inconsistentes
Condição: apenas IP ou apenas porta preenchido. Comportamento: o envio é bloqueado; ambos os campos são sinalizados como obrigatórios em conjunto.

### Cenário 3 — URL inválida
Condição: `ds_access_url` ou `ds_status_url` com formato inválido ou protocolo diferente de http/https. Comportamento: o envio é bloqueado e o campo é sinalizado.

### Cenário 4 — Acesso sem URL
Condição: registro sem `ds_access_url`. Comportamento: ação de acesso desabilitada, com indicação visual.

### Cenário 5 — Verificação sem URL de status
Condição: registro sem `ds_status_url`. Comportamento: botão "Verificar status" desabilitado; o registro é ignorado na ação "Verificar todos".

### Cenário 6 — Recurso indisponível
Condição: `status-check` retorna `status = DOWN`. Comportamento: exibir indicador "Indisponível" com `httpStatus` e `message`.

### Cenário 7 — Falha na chamada ao backend
Condição: erro de rede ou resposta de erro do backend (ex.: falha ao salvar, listar ou excluir). Comportamento: a interface exibe mensagem de erro e mantém o estado consistente (não remove/atualiza item sem confirmação de sucesso).

### Cenário 8 — Cancelamento da exclusão
Condição: usuário aciona excluir e cancela no diálogo. Comportamento: nenhuma chamada `DELETE` é feita; o registro permanece inalterado.

---

## Dependências

- Backend do Painel de Sistemas disponível, expondo os endpoints contratados.
- Provisionamento da permissão **`hub_services_manage`** no controle de acesso.

---

## Resultado Esperado

Após a implementação, usuários com a permissão `hub_services_manage` conseguirão, pela interface: listar (em datatable ou cards), buscar/filtrar/ordenar/paginar, criar, editar e excluir (com confirmação) sistemas e serviços, acessar o recurso pela URL em nova aba, e verificar a disponibilidade de forma individual ou em lote, com feedback visual de Disponível/Indisponível.

---

## Fora de Escopo

- Paginação, busca e filtros no lado do servidor (backend não os oferece nesta versão).
- Monitoramento contínuo/agendado e histórico de status.
- Alertas/notificações de indisponibilidade.
- Exclusão lógica (inativação) — a remoção é física.
- Definições visuais detalhadas (cores exatas, tipografia, componentes específicos) serão tratadas pela documentação técnica/design do frontend.

---

## Referências

- Contrato de endpoints do backend do Painel de Sistemas fornecido nesta conversa (`GET/POST/PUT/DELETE /hub-services`, `GET /hub-services/{id}`, `POST /hub-services/{id}/status-check`).

---

## Observações

- **Paginação client-side (risco registrado)**: como `GET /hub-services` retorna a coleção completa sem parâmetros, busca/filtros/ordenação/paginação ocorrem no frontend. Se o volume de registros crescer significativamente, o desempenho da tela pode ser impactado; nesse cenário, recomenda-se evoluir o backend para paginação/filtragem no servidor.
- **"Verificar todos" sem limite**: dispara N chamadas individuais. Sem limite definido, um volume alto de registros pode gerar muitas requisições simultâneas; recomenda-se avaliar controle de concorrência/execução em blocos na etapa técnica (não bloqueante).
- **IP e Porta**: permanecem opcionais em conjunto — é válido cadastrar apenas por URL, sem IP/porta.
- Detalhes técnicos (framework, componentes, biblioteca de tabela, estratégia de estado) serão definidos na documentação técnica do frontend.