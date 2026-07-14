import {
    AppWindow,
    Building2,
    FileText,
    LayoutDashboard,
    MonitorCloud,
    type LucideIcon
} from "lucide-react";

interface SidebarModule {
    title: string
    items: {
        label: string
        path: string
        icon: LucideIcon
        isBlocked?: boolean
        profiles: string[]
    }[]
}

export const sidebarModules: SidebarModule[] = [
    {
        title: "Geral",
        items: [
            {
                label: "Página Inicial",
                path: "/welcome",
                icon: LayoutDashboard,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Organograma",
                path: "/organograma",
                icon: Building2,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            // {
            //     label: "Calendário",
            //     path: "/calendar",
            //     icon: Calendar,
            // },
            {
                label: "Documentos ISO",
                path: "/documents",
                icon: FileText,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
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
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Serviços",
                path: "/services",
                icon: MonitorCloud,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            // {
            //     label: "Servidores",
            //     path: "/servers",
            //     icon: Server,
            // },
            // {
            //     label: "IP Map",
            //     path: "/ipmap",
            //     icon: Network,
            //     isBlocked: true,
            // },
        ],
    },

    // {
    //     title: "Operações",
    //     items: [
    //         {
    //             label: "Central de Segurança",
    //             path: "/security-center",
    //             icon: Cctv,
    //             isBlocked: true
    //         },
    //         {
    //             label: "Incidentes",
    //             path: "/incidents",
    //             icon: AlertTriangle,
    //             isBlocked: true,
    //         },
    //     ],
    // },

    // {
    //     title: "Automação",
    //     items: [
    //         {
    //             label: "Deploy Automatizado",
    //             path: "/deploy",
    //             icon: Rocket,
    //             isBlocked: true,
    //         },
    //     ],
    // },
    // {
    //     title: "Administração",
    //     items: [
    //         {
    //             label: "Usuários",
    //             path: "/users",
    //             icon: Users,
    //             profiles: ['Administrador']
    //         },
    //         {
    //             label: "Perfis",
    //             path: "/profiles",
    //             icon: UserRoundKey,
    //             profiles: ['Administrador']
    //         }
    //     ]
    // }
];