import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Boxes, History, MonitorCog, Plug, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router";

import { CoreEntityCard } from "../components/core-entity-card";

interface CoreArea {
    title: string;
    description: string;
    icon: typeof Users;
    path: string;
}

// As 5 áreas do menu "Administração" (RF002) — a mesma ordem do sidebar.
const CORE_AREAS: CoreArea[] = [
    {
        title: "Usuários",
        description: "Cadastro, status e vínculo de roles dos usuários do sistema.",
        icon: Users,
        path: "/core/users",
    },
    {
        title: "Roles",
        description: "Perfis de acesso e atribuição de permissões do catálogo fixo.",
        icon: Shield,
        path: "/core/roles",
    },
    {
        title: "Módulos",
        description: "Catálogo de módulos do sistema e integrações vinculadas.",
        icon: Boxes,
        path: "/core/modules",
    },
    {
        title: "Integrações",
        description: "Conexões externas simuladas (Jira, GLPI, Microsoft, OpenVPN).",
        icon: Plug,
        path: "/core/integrations",
    },
    {
        title: "Auditoria",
        description: "Trilha de eventos administrativos, somente leitura.",
        icon: History,
        path: "/core/audit",
    },
];

export function CoreHomePage() {
    const navigate = useNavigate();

    return (
        <>
            <HeaderPage
                title="Core"
                description="Painel de controle de sistemas: usuários, permissões, módulos, integrações e auditoria."
                icon={MonitorCog}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Core</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {CORE_AREAS.map((area) => (
                        <CoreEntityCard
                            key={area.path}
                            icon={area.icon}
                            title={area.title}
                            description={area.description}
                            onClick={() => navigate(area.path)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
