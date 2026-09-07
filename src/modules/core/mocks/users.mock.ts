/**
 * Mock de usuários administrados pelo módulo Core (RF005/RF006).
 *
 * Status é binário (RN004: apenas Ativo/Inativo, sem "Bloqueado").
 * `cd_roles` referencia `CoreRole.cd_id` em `roles.mock.ts`.
 */
export interface CoreUser {
    cd_id: number;
    ds_name: string;
    ds_email: string;
    ds_role_description: string;
    fl_active: boolean;
    cd_roles: number[];
    dt_created_at: string;
}

export const usersMock: CoreUser[] = [
    {
        cd_id: 1,
        ds_name: "Geferson Holdorf",
        ds_email: "geferson.holdorf@nexus.com",
        ds_role_description: "Administrador de Sistemas",
        fl_active: true,
        cd_roles: [1],
        dt_created_at: "2025-01-10T09:00:00Z",
    },
    {
        cd_id: 2,
        ds_name: "Mariana Souza",
        ds_email: "mariana.souza@nexus.com",
        ds_role_description: "Analista de Suporte",
        fl_active: true,
        cd_roles: [2],
        dt_created_at: "2025-01-14T09:00:00Z",
    },
    {
        cd_id: 3,
        ds_name: "Rafael Lima",
        ds_email: "rafael.lima@nexus.com",
        ds_role_description: "Desenvolvedor Backend",
        fl_active: true,
        cd_roles: [3],
        dt_created_at: "2025-02-02T09:00:00Z",
    },
    {
        cd_id: 4,
        ds_name: "Bianca Ferreira",
        ds_email: "bianca.ferreira@nexus.com",
        ds_role_description: "Analista de Infraestrutura",
        fl_active: true,
        cd_roles: [4],
        dt_created_at: "2025-02-18T09:00:00Z",
    },
    {
        cd_id: 5,
        ds_name: "Carlos Eduardo",
        ds_email: "carlos.eduardo@nexus.com",
        ds_role_description: "Auditor Interno",
        fl_active: true,
        cd_roles: [5],
        dt_created_at: "2025-03-03T09:00:00Z",
    },
    {
        cd_id: 6,
        ds_name: "Fernanda Alves",
        ds_email: "fernanda.alves@nexus.com",
        ds_role_description: "Analista de Suporte",
        fl_active: false,
        cd_roles: [2],
        dt_created_at: "2025-03-20T09:00:00Z",
    },
    {
        cd_id: 7,
        ds_name: "Thiago Martins",
        ds_email: "thiago.martins@nexus.com",
        ds_role_description: "Desenvolvedor Frontend",
        fl_active: true,
        cd_roles: [1, 3],
        dt_created_at: "2025-04-05T09:00:00Z",
    },
    {
        cd_id: 8,
        ds_name: "Juliana Costa",
        ds_email: "juliana.costa@nexus.com",
        ds_role_description: "Analista de Infraestrutura",
        fl_active: false,
        cd_roles: [4],
        dt_created_at: "2025-04-22T09:00:00Z",
    },
];
