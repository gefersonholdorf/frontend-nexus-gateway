import {
    AppWindow,
    Boxes,
    Building2,
    Cctv,
    EyeOff,
    FileText,
    History,
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
        /**
         * Quando informado, a visibilidade do item passa a ser controlada por
         * `useHasPermission(permission)` (permissões reais via `/me`), em vez
         * de `profiles`/`user.roles`. Usado hoje apenas pelos itens do grupo
         * "Administração" (módulo Core).
         */
        permission?: string
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
                profiles: ['Administrador'],
                permission: 'users.manage'
            },
            {
                label: "Módulos",
                path: "/core/modules",
                icon: Boxes,
                profiles: ['Administrador'],
                permission: 'modules.manage'
            },
            {
                label: "Integrações",
                path: "/core/integrations",
                icon: Plug,
                profiles: ['Administrador'],
                permission: 'integrations.manage'
            },
            {
                label: "Auditoria",
                path: "/core/audit",
                icon: History,
                profiles: ['Administrador'],
                permission: 'audit.read'
            },
            {
                label: "Perfis",
                path: "/core/roles",
                icon: Shield,
                profiles: ['Administrador'],
                permission: 'rbac.roles.manage'
            },
        ]
    }
];