import {
    AlertTriangle,
    AppWindow,
    Calendar,
    Cctv,
    LayoutDashboard,
    MonitorCloud,
    Network,
    Rocket,
    Server,
} from "lucide-react";

export const sidebarModules = [
    {
        title: "Geral",
        items: [
            {
                label: "Página Inicial",
                path: "/welcome",
                icon: LayoutDashboard,
            },
            {
                label: "Calendário",
                path: "/calendar",
                icon: Calendar,
            },
        ],
    },

    {
        title: "Infraestrutura",
        items: [
            {
                label: "Sistemas",
                path: "/systems",
                icon: AppWindow,
            },
            {
                label: "Serviços",
                path: "/services",
                icon: MonitorCloud,
            },
            {
                label: "Servidores",
                path: "/servers",
                icon: Server,
            },
            {
                label: "IP Map",
                path: "/ipmap",
                icon: Network,
            },
        ],
    },

    {
        title: "Operações",
        items: [
            {
                label: "Central de Segurança",
                path: "/security-center",
                icon: Cctv,
            },
            {
                label: "Incidentes",
                path: "/incidents",
                icon: AlertTriangle,
                isBlocked: true,
            },
        ],
    },

    {
        title: "Automação",
        items: [
            {
                label: "Deploy Automatizado",
                path: "/deploy",
                icon: Rocket,
                isBlocked: true,
            },
        ],
    },
];