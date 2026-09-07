/**
 * Mock das 4 integrações externas simuladas do módulo Core (RN012).
 *
 * `st_status` reflete o resultado do ÚLTIMO teste de conexão (RN015). Resultado
 * fixo por integração quando a ação "Testar Conexão" for implementada (Etapa 6):
 * Jira/GLPI/OpenVPN → sucesso, Microsoft → falha. Aqui já nascem com esse valor
 * para a listagem ter algo coerente para mostrar antes da Etapa 6 existir.
 *
 * `ds_secret` nunca deve ser exibido em texto puro por padrão nas telas — a UI
 * é responsável por mascarar (RF027).
 */
export interface CoreIntegration {
    cd_id: number;
    ds_type: string;
    ds_name: string;
    ds_description: string;
    fl_active: boolean;
    st_status: "ok" | "fail";
    ds_config: Record<string, string>;
    ds_secret: string;
}

export const integrationsMock: CoreIntegration[] = [
    {
        cd_id: 1,
        ds_type: "Jira",
        ds_name: "Jira Software",
        ds_description: "Gestão de chamados e tickets de projeto integrada ao Jira.",
        fl_active: true,
        st_status: "ok",
        ds_config: {
            url: "https://nexus.atlassian.net",
            usuario: "integracao.jira@nexus.com",
        },
        ds_secret: "jira-token-8f2c1a9e",
    },
    {
        cd_id: 2,
        ds_type: "GLPI",
        ds_name: "GLPI",
        ds_description: "Inventário de ativos e chamados de suporte via GLPI.",
        fl_active: true,
        st_status: "ok",
        ds_config: {
            url: "https://glpi.nexus.internal",
            usuario: "integracao.glpi",
        },
        ds_secret: "glpi-app-token-4b7d02f1",
    },
    {
        cd_id: 3,
        ds_type: "Microsoft",
        ds_name: "Microsoft 365",
        ds_description: "Autenticação e diretório de usuários via Microsoft Entra ID.",
        fl_active: true,
        st_status: "fail",
        ds_config: {
            url: "https://login.microsoftonline.com/nexus",
            usuario: "integracao.m365@nexus.com",
        },
        ds_secret: "ms-client-secret-9a3e77bc",
    },
    {
        cd_id: 4,
        ds_type: "OpenVPN",
        ds_name: "OpenVPN Access Server",
        ds_description: "Controle de acesso remoto e VPN corporativa.",
        fl_active: false,
        st_status: "ok",
        ds_config: {
            url: "https://vpn.nexus.internal",
            usuario: "integracao.vpn",
        },
        ds_secret: "ovpn-key-1c5f9d33",
    },
];
