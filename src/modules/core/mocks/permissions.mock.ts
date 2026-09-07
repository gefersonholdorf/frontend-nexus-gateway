/**
 * Catálogo FIXO de permissões do módulo Core (RF016/RN008).
 *
 * Somente leitura — nunca sofre CRUD (nem aqui, nem na tela `/core/permissions`).
 * As 6 chaves abaixo são as únicas usadas por `Can`/`useHasPermission` em todo o app.
 */
export interface CorePermission {
    cd_id: number;
    ds_key: string;
    ds_name: string;
    ds_description: string;
}

export const permissionsMock: CorePermission[] = [
    {
        cd_id: 1,
        ds_key: "users.manage",
        ds_name: "Gerenciar usuários",
        ds_description: "Criar, editar, inativar e vincular roles a usuários.",
    },
    {
        cd_id: 2,
        ds_key: "rbac.manage",
        ds_name: "Gerenciar roles",
        ds_description: "Criar, editar e inativar roles (perfis de acesso).",
    },
    {
        cd_id: 3,
        ds_key: "rbac.assign",
        ds_name: "Atribuir permissões",
        ds_description: "Vincular e desvincular permissões do catálogo a uma role.",
    },
    {
        cd_id: 4,
        ds_key: "modules.manage",
        ds_name: "Gerenciar módulos",
        ds_description: "Editar módulos e conectar/desconectar integrações vinculadas.",
    },
    {
        cd_id: 5,
        ds_key: "integrations.manage",
        ds_name: "Gerenciar integrações",
        ds_description: "Editar configuração de integrações e testar conexão.",
    },
    {
        cd_id: 6,
        ds_key: "audit.read",
        ds_name: "Consultar auditoria",
        ds_description: "Visualizar a trilha de eventos administrativos do sistema.",
    },
];
