import { HeaderPage } from "@/components/header-page";
import { CardQuantityComponent } from "@/components/table-component-v2";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Boxes, Pencil, Plug, ShieldCheck, ShieldOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Can } from "@/modules/auth/components/can";

import { CoreEntityCard } from "../components/core-entity-card";
import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { EditModuleModal } from "../components/edit-module-modal";
import { useFetchModules } from "../hooks/use-fetch-modules";
import type { CoreModule } from "../mocks/modules.mock";

type StatusFilter = "all" | "active" | "inactive";

interface Filters {
    ds_name: string;
    status: StatusFilter;
}

/**
 * Listagem em cards (RF017) — sem botão de criar (RF018). Edição fica
 * disponível diretamente no card; ativar/inativar e conectar/desconectar
 * integrações ficam concentrados na página de detalhe (`/core/modules/:id`),
 * alcançável clicando em qualquer card — paridade de recursos entre as duas
 * telas, sem duplicar a confirmação destrutiva de inativação aqui.
 */
export function CoreModulesPage() {
    const { data, isLoading } = useFetchModules();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<Filters>({ ds_name: "", status: "all" });
    const [editModule, setEditModule] = useState<CoreModule | null>(null);

    const allModules = useMemo(() => data ?? [], [data]);

    // Filtros client-side (RF017/RF019): nome e status — aceitável, pois é mock em memória.
    const filteredModules = useMemo(() => {
        const name = filters.ds_name.trim().toLowerCase();

        return allModules.filter((module) => {
            const matchesName = name === "" || module.ds_name.toLowerCase().includes(name);
            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" ? module.fl_active : !module.fl_active);

            return matchesName && matchesStatus;
        });
    }, [allModules, filters]);

    // KPIs refletem o catálogo completo, não a lista filtrada.
    const summarys = useMemo(
        () => [
            {
                title: "Total de módulos",
                value: allModules.length,
                icon: Boxes,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Ativos",
                value: allModules.filter((module) => module.fl_active).length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Inativos",
                value: allModules.filter((module) => !module.fl_active).length,
                icon: ShieldOff,
                colorText: "text-core-neutral",
                borderColor: "hover:border-core-neutral",
            },
        ],
        [allModules],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

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

                <Card className="gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-0 shadow-sm dark:border-border/80">
                    <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
                        <Input
                            placeholder="Buscar por nome"
                            value={filters.ds_name}
                            onChange={(e) => handleFilterChange("ds_name", e.target.value)}
                            className="lg:max-w-xs"
                        />

                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange("status", value as StatusFilter)}
                        >
                            <SelectTrigger className="lg:w-44">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Grid rígido de cards (RF017/RF019) — sem botão de criar (RF018). */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredModules.map((module) => (
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
                            actions={
                                <Can permission="modules.manage" fallback={null}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setEditModule(module);
                                                }}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Editar módulo</TooltipContent>
                                    </Tooltip>
                                </Can>
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

                    {!isLoading && filteredModules.length === 0 && (
                        <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                            Nenhum módulo encontrado para os filtros aplicados.
                        </p>
                    )}
                </div>
            </div>

            <EditModuleModal
                open={Boolean(editModule)}
                onOpenChange={(next) => !next && setEditModule(null)}
                module={editModule}
            />
        </>
    );
}
