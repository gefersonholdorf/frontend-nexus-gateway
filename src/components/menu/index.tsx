import { AlertTriangle, AppWindow, Calendar, Cctv, LayoutDashboard, LayoutDashboardIcon, Network, Rocket } from "lucide-react";

export const sidebarItems = [
    {
        label: "Dashboard",
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
        icon: LayoutDashboardIcon,
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