/**
 * Catálogo ISOLADO de módulos administrado pela Etapa 5 (`/core/modules`).
 *
 * Não tem relação com os grupos reais de `src/components/menu/sidebar-module.tsx`
 * — é uma demonstração autocontida de RN003 dentro das próprias telas do Core.
 *
 * `ds_key: "core"` identifica o módulo Core, que é FIXO: sempre `fl_active: true`
 * e nunca pode ser desativado (RN001), em nenhuma tela que consome este mock.
 * `cd_integrations` referencia `CoreIntegration.cd_id` em `integrations.mock.ts`.
 */
export interface CoreModule {
    cd_id: number;
    ds_key: string;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
    cd_integrations: number[];
    dt_created_at: string;
}

export const modulesMock: CoreModule[] = [
    {
        cd_id: 1,
        ds_key: "core",
        ds_name: "Core",
        ds_description: "Administração do sistema: usuários, roles, módulos, integrações e auditoria.",
        fl_active: true,
        cd_integrations: [],
        dt_created_at: "2025-01-01T09:00:00Z",
    },
    {
        cd_id: 2,
        ds_key: "documents",
        ds_name: "Documentos ISO",
        ds_description: "Governança documental: criação, revisão e aprovação de documentos.",
        fl_active: true,
        cd_integrations: [],
        dt_created_at: "2025-01-15T09:00:00Z",
    },
    {
        cd_id: 3,
        ds_key: "campaigns",
        ds_name: "Campanhas",
        ds_description: "Gestão de campanhas de comunicação interna.",
        fl_active: false,
        cd_integrations: [],
        dt_created_at: "2025-02-05T09:00:00Z",
    },
    {
        cd_id: 4,
        ds_key: "tickets",
        ds_name: "Central de Tickets",
        ds_description: "Abertura e acompanhamento de chamados de suporte.",
        fl_active: true,
        cd_integrations: [1, 2],
        dt_created_at: "2025-02-20T09:00:00Z",
    },
    {
        cd_id: 5,
        ds_key: "security-center",
        ds_name: "Central de Segurança",
        ds_description: "Monitoramento de acessos e eventos de segurança.",
        fl_active: false,
        cd_integrations: [3],
        dt_created_at: "2025-03-10T09:00:00Z",
    },
    {
        cd_id: 6,
        ds_key: "operations",
        ds_name: "Central de Operações",
        ds_description: "Painel operacional de sistemas e serviços monitorados.",
        fl_active: true,
        cd_integrations: [4],
        dt_created_at: "2025-03-25T09:00:00Z",
    },
];
