import {
    AppWindow,
    Boxes,
    Building2,
    Cctv,
    EyeOff,
    FileText,
    History,
    KeyRound,
    LayoutDashboard,
    Megaphone,
    MonitorCloud,
    MonitorCog,
    Plug,
    Shield,
    Users,
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
                label: "Campanhas",
                path: "/campaigns",
                icon: Megaphone,
                profiles: ['Administrador']
            },
        ],
    },
    {
        title: "Governança",
        items: [
            {
                label: "Organograma",
                path: "/organograma",
                icon: Building2,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Documentos ISO",
                path: "/documents",
                icon: FileText,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
        ]
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

    {
        title: "Operações",
        items: [
            {
                label: "Central de Operações",
                path: "/operations",
                icon: MonitorCog,
                isBlocked: false,
                profiles: ['Administrador', 'Suporte']
            },
            {
                label: "Central de Segurança",
                path: "/security-center",
                icon: Cctv,
                isBlocked: false,
                profiles: ['Administrador']
            },
            // {
            //     label: "Backups/Restores",
            //     path: "/backups",
            //     icon: DatabaseBackup,
            //     isBlocked: false,
            //     profiles: ['Administrador']
            // },
            {
                label: "Mascaramento",
                path: "/masking",
                icon: EyeOff,
                isBlocked: false,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            }
        ],
    },

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
    {
        title: "Administração",
        items: [
            {
                label: "Usuários",
                path: "/core/users",
                icon: Users,
                profiles: ['Administrador']
            },
            {
                label: "Módulos",
                path: "/core/modules",
                icon: Boxes,
                profiles: ['Administrador']
            },
            {
                label: "Integrações",
                path: "/core/integrations",
                icon: Plug,
                profiles: ['Administrador']
            },
            {
                label: "Auditoria",
                path: "/core/audit",
                icon: History,
                profiles: ['Administrador']
            },
            {
                label: "Perfis",
                path: "/core/roles",
                icon: Shield,
                profiles: ['Administrador']
            },
            {
                label: "Permissões",
                path: "/core/permissions",
                icon: KeyRound,
                profiles: ['Administrador']
            }
        ]
    }
];