/**
 * Mock de roles (perfis de acesso) do módulo Core (RF011).
 *
 * Array mutável em memória: estado persiste durante a sessão da aba e zera ao
 * recarregar a página (RN014) — Etapa 3 (CRUD) escreve diretamente aqui.
 */
export interface CoreRole {
    cd_id: number;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
    cd_permissions: number[];
    dt_created_at: string;
}

export const rolesMock: CoreRole[] = [
    {
        cd_id: 1,
        ds_name: "Administrador",
        ds_description: "Acesso total à administração do sistema.",
        fl_active: true,
        cd_permissions: [1, 2, 3, 4, 5, 6],
        dt_created_at: "2025-01-10T09:00:00Z",
    },
    {
        cd_id: 2,
        ds_name: "Suporte",
        ds_description: "Gerencia usuários e consulta auditoria.",
        fl_active: true,
        cd_permissions: [1, 6],
        dt_created_at: "2025-01-12T09:00:00Z",
    },
    {
        cd_id: 3,
        ds_name: "Desenvolvedor",
        ds_description: "Gerencia módulos e integrações do sistema.",
        fl_active: true,
        cd_permissions: [4, 5],
        dt_created_at: "2025-02-01T09:00:00Z",
    },
    {
        cd_id: 4,
        ds_name: "Infraestrutura",
        ds_description: "Gerencia integrações externas e monitora conexões.",
        fl_active: true,
        cd_permissions: [5],
        dt_created_at: "2025-02-15T09:00:00Z",
    },
    {
        cd_id: 5,
        ds_name: "Auditor",
        ds_description: "Somente leitura da trilha de auditoria.",
        fl_active: true,
        cd_permissions: [6],
        dt_created_at: "2025-03-01T09:00:00Z",
    },
    {
        cd_id: 6,
        ds_name: "Perfil descontinuado",
        ds_description: "Role legada mantida apenas para histórico.",
        fl_active: false,
        cd_permissions: [],
        dt_created_at: "2024-11-20T09:00:00Z",
    },
];
