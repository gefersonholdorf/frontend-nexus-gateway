import { AlertTriangle, AppWindow, Calendar, Cctv, LayoutDashboard, MonitorCloud, Network, Rocket, Server } from "lucide-react";

export const sidebarItems = [
    {
        label: "Página Inicial",
        path: "/welcome",
        icon: LayoutDashboard,
    },
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
    {
        label: "Central de Segurança",
        path: "/security-center",
        icon: Cctv,
    }, ,
    {
        label: "Calendário",
        path: "/events",
        icon: Calendar,
        isBlocked: true,
    },
    {
        label: "Incidentes",
        path: "/incidents",
        icon: AlertTriangle,
        isBlocked: true,
    },
    {
        label: "Deploy Automatizado",
        path: "/deploy",
        icon: Rocket,
        isBlocked: true,
    }
];