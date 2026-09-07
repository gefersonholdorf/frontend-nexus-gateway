---
name: add-route-and-menu-entry
description: Adiciona uma rota protegida nova em src/main.tsx e, se aplicável, o item correspondente no menu lateral em src/components/menu/sidebar-module.tsx, seguindo exatamente o formato já usado nesses dois arquivos. Use sempre que uma página nova precisar ficar acessível por URL e/ou menu neste frontend.
---

# Adicionar rota + entrada de menu

## Passos

1. Importe o componente de página no topo de `src/main.tsx`, seguindo o agrupamento de imports já existente (imports de `src/modules/*` ficam nas últimas linhas do bloco de imports, próximos aos outros imports de módulo).
2. Adicione a `<Route path="/..." element={<...Page />} />` dentro do bloco `<Route element={<LayoutPages />}>` (rotas protegidas) — só coloque fora desse bloco (junto de `/` e `/403`) se a página for genuinamente pública, o que é raro.
3. Caminho da rota: kebab-case, sem barra final. Se a página pertence a um domínio com várias telas (como o Core em `/core/*`), use o prefixo do domínio (`/core/nova-tela`).
4. Se a página deve aparecer no menu lateral, edite `src/components/menu/sidebar-module.tsx`:
   - Escolha o grupo (`title`) mais próximo semanticamente (Geral, Governança, Infraestrutura, Operações, Administração) ou confirme com o usuário se precisa de um grupo novo.
   - Adicione o item com `label` (português, capitalizado), `path` (igual ao da rota), `icon` (um `LucideIcon` já importado ou novo import de `lucide-react`), e `profiles: string[]` com os perfis que devem enxergar o item (`Administrador`, `Suporte`, `Desenvolvedor`, `Infraestrutura` — copie de um item do mesmo grupo se não houver instrução diferente).
5. Se a página exige permissão específica (não apenas perfil), envolva o conteúdo da página com `RouteGuard` (`src/modules/auth/components/route-guard.tsx`) — isso é independente da visibilidade de menu por perfil. Ver `docs/architecture/auth-and-rbac.md`.
6. Rode `npm run lint` e `tsc -b`.

## Não fazer

- Não crie um arquivo de configuração de rotas separado — tudo fica centralizado em `src/main.tsx` (decisão arquitetural atual, documentada em `docs/architecture/routing.md`).
- Não crie um segundo mecanismo de controle de visibilidade de menu — use sempre o array `profiles` do item, no mesmo formato dos demais.
- Se a rota for para o módulo Core (`/core/*`) e a página ainda não existir, não crie um placeholder vazio sem avisar — primeiro confirme com o usuário se a intenção é implementar a etapa correspondente (ver `docs/architecture/core-module-roadmap.md`).
