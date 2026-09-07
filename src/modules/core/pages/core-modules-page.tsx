import { HeaderPage } from "@/components/header-page";
import { CardQuantityComponent } from "@/components/table-component-v2";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Boxes, Plug, ShieldCheck, ShieldOff } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import { CoreEntityCard } from "../components/core-entity-card";
import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { useFetchModules } from "../hooks/use-fetch-modules";

export function CoreModulesPage() {
    const { data, isLoading } = useFetchModules();
    const navigate = useNavigate();

    const items = useMemo(() => data ?? [], [data]);

    const summarys = useMemo(
        () => [
            {
                title: "Total de módulos",
                value: items.length,
                icon: Boxes,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Ativos",
                value: items.filter((module) => module.fl_active).length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Inativos",
                value: items.filter((module) => !module.fl_active).length,
                icon: ShieldOff,
                colorText: "text-core-neutral",
                borderColor: "hover:border-core-neutral",
            },
        ],
        [items],
    );

    return (
        <>
            <HeaderPage
                title="Módulos"
                description="Catálogo de módulos do sistema e integrações vinculadas. O módulo Core nunca aparece como desativável."
                icon={Boxes}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/core">Core</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Módulos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {summarys.map((summary) => (
                        <CardQuantityComponent key={summary.title} summary={summary} isLoading={isLoading} />
                    ))}
                </div>

                {/* Grid rígido de cards (RF017/RF019) — sem botão de criar (RF018). */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((module) => (
                        <CoreEntityCard
                            key={module.cd_id}
                            icon={Boxes}
                            title={module.ds_name}
                            description={module.ds_description}
                            onClick={() => navigate(`/core/modules/${module.cd_id}`)}
                            status={
                                module.fl_active ? (
                                    <StatusDot tone="ok" label="Ativo" />
                                ) : (
                                    <StatusDot tone="off" label="Inativo" />
                                )
                            }
                            footer={
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Plug className="size-3.5" aria-hidden="true" />
                                    <MonoValue>{module.cd_integrations.length}</MonoValue>
                                    <span>integração(ões) vinculada(s)</span>
                                </div>
                            }
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
