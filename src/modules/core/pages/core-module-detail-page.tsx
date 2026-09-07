import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Boxes, Info, Plug } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router";

import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { useFetchIntegrations } from "../hooks/use-fetch-integrations";
import { useFetchModules } from "../hooks/use-fetch-modules";

/**
 * Única rota de detalhe real do módulo Core (`/core/modules/:id`).
 * Toggle de status e conectar/desconectar integrações chegam na Etapa 5;
 * aqui o objetivo é ler o mock e exibir a identidade do módulo (fundação).
 */
export default function CoreModuleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: modules, isLoading } = useFetchModules();
    const { data: integrations } = useFetchIntegrations();

    const moduleItem = useMemo(
        () => modules?.find((module) => String(module.cd_id) === id),
        [modules, id],
    );

    const linkedIntegrations = useMemo(
        () =>
            (integrations ?? []).filter((integration) =>
                moduleItem?.cd_integrations.includes(integration.cd_id),
            ),
        [integrations, moduleItem],
    );

    const isCoreModule = moduleItem?.ds_key === "core";

    return (
        <>
            <HeaderPage
                title={moduleItem ? moduleItem.ds_name : "Módulo"}
                description={moduleItem?.ds_description ?? "Carregando detalhe do módulo..."}
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
                                <BreadcrumbLink href="/core/modules">Módulos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>{moduleItem?.ds_name ?? "Detalhe"}</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {!isLoading && !moduleItem && (
                    <Card className="p-6 text-sm text-muted-foreground">
                        Módulo não encontrado no catálogo mockado.
                    </Card>
                )}

                {moduleItem && (
                    <>
                        <Card className="flex flex-col gap-4 rounded-sm border border-border/60 bg-(image:--background-gradient) p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-core-ink/15 bg-core-ink/5 text-core-ink">
                                        <Boxes className="size-4" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Status do módulo</p>
                                        {moduleItem.fl_active ? (
                                            <StatusDot tone="ok" label="Ativo" />
                                        ) : (
                                            <StatusDot tone="off" label="Inativo" />
                                        )}
                                    </div>
                                </div>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Switch checked={moduleItem.fl_active} disabled />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isCoreModule
                                            ? "O módulo Core nunca pode ser desativado."
                                            : "Alternar status chega na Etapa 5 (CRUD visual)."}
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {isCoreModule && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Info className="size-3.5" aria-hidden="true" />
                                    Módulo fixo do sistema — sempre ativo, sem opção de desativar.
                                </div>
                            )}
                        </Card>

                        <Card className="flex flex-col gap-3 rounded-sm border border-border/60 bg-(image:--background-gradient) p-5">
                            <div className="flex items-center gap-2">
                                <Plug className="size-4 text-core-signal" aria-hidden="true" />
                                <h2 className="text-sm font-semibold text-foreground">
                                    Integrações vinculadas
                                </h2>
                            </div>

                            {linkedIntegrations.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Nenhuma integração vinculada a este módulo.
                                </p>
                            ) : (
                                <ul className="flex flex-col divide-y divide-border/60">
                                    {linkedIntegrations.map((integration) => (
                                        <li
                                            key={integration.cd_id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {integration.ds_name}
                                                </p>
                                                <MonoValue className="text-muted-foreground">
                                                    {integration.ds_type}
                                                </MonoValue>
                                            </div>
                                            <StatusDot
                                                tone={integration.st_status === "ok" ? "ok" : "fail"}
                                                label={integration.st_status === "ok" ? "Conectado" : "Falha"}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Conectar/desconectar integrações chega na Etapa 5 (RF023).
                            </p>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}
