import {
    AppWindow,
    Boxes,
    Building2,
    CalendarClock,
    Cctv,
    EyeOff,
    FileClock,
    FileStack,
    FileText,
    Gavel,
    GitBranch,
    History,
    LayoutDashboard,
    Megaphone,
    MonitorCog,
    Plug,
    Shield,
    Tags,
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
        // Grupo próprio — não misturar com "Governança" (onde está o legado
        // "Documentos ISO", intocado e sem relação com este módulo).
        title: "Gestão de Documentos",
        items: [
            {
                label: "Documentos",
                path: "/gestao-documentos",
                icon: FileText,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Revisões",
                path: "/gestao-documentos/revisoes",
                icon: FileClock,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Versões",
                path: "/gestao-documentos/versoes",
                icon: FileStack,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura']
            },
            {
                label: "Aprovações Pendentes",
                path: "/gestao-documentos/aprovacoes-pendentes",
                icon: Gavel,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura'],
                permission: 'aprovacao.avaliar'
            },
            {
                label: "Categorias",
                path: "/gestao-documentos/configuracoes/categorias",
                icon: Tags,
                profiles: ['Administrador'],
                permission: 'configuracoes.gerenciar'
            },
            {
                label: "Áreas",
                path: "/gestao-documentos/configuracoes/areas",
                icon: Building2,
                profiles: ['Administrador'],
                permission: 'configuracoes.gerenciar'
            },
            {
                label: "Fluxos de Aprovação",
                path: "/gestao-documentos/configuracoes/fluxos",
                icon: GitBranch,
                profiles: ['Administrador'],
                permission: 'configuracoes.gerenciar'
            },
            {
                label: "Período de Revisão",
                path: "/gestao-documentos/configuracoes/periodo-revisao",
                icon: CalendarClock,
                profiles: ['Administrador'],
                permission: 'configuracoes.gerenciar'
            },
        ],
    },

    {
        title: "Infraestrutura",
        items: [
            {
                label: "Painel de Sistemas",
                path: "/hub-services",
                icon: AppWindow,
                profiles: ['Administrador', 'Suporte', 'Desenvolvedor', 'Infraestrutura'],
                permission: 'hub_services_manage'
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
                label: "Perfis",
                path: "/core/roles",
                icon: Shield,
                profiles: ['Administrador'],
                permission: 'rbac.roles.manage'
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
        ]
    }
];