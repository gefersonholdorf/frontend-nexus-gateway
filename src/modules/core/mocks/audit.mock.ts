/**
 * Auditoria MOCKADA da Etapa 7 (`/core/audit`).
 *
 * Dados estáticos — nenhuma ação do sistema gera novo registro automaticamente
 * (RN013). Não confundir com `src/modules/audit/hooks/use-fetch-audit.ts`
 * (hook V2 real, `GET /audit`), que é uma peça de produção separada.
 */
export interface CoreAuditItem {
    cd_id: number;
    ds_user: string;
    ds_module: string;
    ds_action: string;
    ds_message: string;
    ds_ip: string;
    ds_agent: string;
    dt_created_at: string;
}

export const auditMock: CoreAuditItem[] = [
    {
        cd_id: 1,
        ds_user: "Geferson Holdorf",
        ds_module: "Usuários",
        ds_action: "CREATE",
        ds_message: "Criou o usuário Thiago Martins.",
        ds_ip: "10.20.4.11",
        ds_agent: "Chrome 128 / Windows 11",
        dt_created_at: "2025-04-05T09:05:00Z",
    },
    {
        cd_id: 2,
        ds_user: "Geferson Holdorf",
        ds_module: "Roles",
        ds_action: "UPDATE",
        ds_message: "Atualizou as permissões da role Suporte.",
        ds_ip: "10.20.4.11",
        ds_agent: "Chrome 128 / Windows 11",
        dt_created_at: "2025-04-06T11:22:00Z",
    },
    {
        cd_id: 3,
        ds_user: "Mariana Souza",
        ds_module: "Usuários",
        ds_action: "UPDATE",
        ds_message: "Inativou o usuário Fernanda Alves.",
        ds_ip: "10.20.4.35",
        ds_agent: "Edge 126 / Windows 11",
        dt_created_at: "2025-04-08T14:40:00Z",
    },
    {
        cd_id: 4,
        ds_user: "Rafael Lima",
        ds_module: "Módulos",
        ds_action: "UPDATE",
        ds_message: "Ativou o módulo Central de Operações.",
        ds_ip: "10.20.5.02",
        ds_agent: "Firefox 127 / Ubuntu",
        dt_created_at: "2025-04-10T08:15:00Z",
    },
    {
        cd_id: 5,
        ds_user: "Bianca Ferreira",
        ds_module: "Integrações",
        ds_action: "UPDATE",
        ds_message: "Testou a conexão com Microsoft 365 (falha).",
        ds_ip: "10.20.6.44",
        ds_agent: "Chrome 128 / macOS",
        dt_created_at: "2025-04-12T16:02:00Z",
    },
    {
        cd_id: 6,
        ds_user: "Bianca Ferreira",
        ds_module: "Integrações",
        ds_action: "UPDATE",
        ds_message: "Testou a conexão com Jira Software (sucesso).",
        ds_ip: "10.20.6.44",
        ds_agent: "Chrome 128 / macOS",
        dt_created_at: "2025-04-12T16:05:00Z",
    },
    {
        cd_id: 7,
        ds_user: "Carlos Eduardo",
        ds_module: "Auditoria",
        ds_action: "READ",
        ds_message: "Consultou a trilha de auditoria do último trimestre.",
        ds_ip: "10.20.7.19",
        ds_agent: "Chrome 128 / Windows 11",
        dt_created_at: "2025-04-15T10:30:00Z",
    },
    {
        cd_id: 8,
        ds_user: "Geferson Holdorf",
        ds_module: "Roles",
        ds_action: "DELETE",
        ds_message: "Inativou a role Perfil descontinuado.",
        ds_ip: "10.20.4.11",
        ds_agent: "Chrome 128 / Windows 11",
        dt_created_at: "2025-04-18T09:47:00Z",
    },
    {
        cd_id: 9,
        ds_user: "Thiago Martins",
        ds_module: "Módulos",
        ds_action: "UPDATE",
        ds_message: "Conectou a integração GLPI ao módulo Central de Tickets.",
        ds_ip: "10.20.8.03",
        ds_agent: "Chrome 128 / Windows 11",
        dt_created_at: "2025-04-20T13:12:00Z",
    },
    {
        cd_id: 10,
        ds_user: "Juliana Costa",
        ds_module: "Usuários",
        ds_action: "CREATE",
        ds_message: "Criou o usuário Carlos Eduardo.",
        ds_ip: "10.20.9.27",
        ds_agent: "Edge 126 / Windows 11",
        dt_created_at: "2025-04-22T15:58:00Z",
    },
];
