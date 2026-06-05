import { AlertTriangle, AppWindow, BarChart3, Calendar, CameraIcon, Cctv, FileText, Layout, LayoutDashboard, LayoutDashboardIcon, Network, Rocket, Settings, Users } from "lucide-react";

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
    },
    {
        label: "Incidentes",
        path: "/incidents",
        icon: AlertTriangle,
    },
    {
        label: "Deploy Automatizado",
        path: "/deploy",
        icon: Rocket,
    }
];