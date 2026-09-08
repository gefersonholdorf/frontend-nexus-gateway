import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Boxes, Info, Link2, Plug, Unlink } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { Can } from "@/modules/auth/components/can";
import { useHasPermission } from "@/modules/providers/permission-provider";

import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { InactiveModuleModal } from "../components/inactive-module-modal";
import { useFetchIntegrations } from "../hooks/use-fetch-integrations";
import { useFetchModule } from "../hooks/use-fetch-module";
import { useLinkModuleIntegration } from "../hooks/use-link-module-integration";
import { useToggleModuleStatus } from "../hooks/use-toggle-module-status";
import { useUnlinkModuleIntegration } from "../hooks/use-unlink-module-integration";

export default function CoreModuleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const moduleId = id ? Number(id) : undefined;

    const { data: moduleItem, isLoading } = useFetchModule(moduleId);
    const { data: integrations } = useFetchIntegrations();
    const { mutate: toggleStatus, isPending: isToggling } = useToggleModuleStatus();
    const { mutate: linkIntegration, isPending: isLinking } = useLinkModuleIntegration();
    const { mutate: unlinkIntegration, isPending: isUnlinking } = useUnlinkModuleIntegration();

    const canManage = useHasPermission("modules.manage");

    const [inactiveOpen, setInactiveOpen] = useState(false);
    const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");

    const linkedIntegrationIds = useMemo(
        () => new Set((moduleItem?.integrations ?? []).map((integration) => integration.cd_id)),
        [moduleItem],
    );

    const linkedIntegrations = useMemo(
        () => (integrations ?? []).filter((integration) => linkedIntegrationIds.has(integration.cd_id)),
        [integrations, linkedIntegrationIds],
    );

    const availableIntegrations = useMemo(
        () => (integrations ?? []).filter((integration) => !linkedIntegrationIds.has(integration.cd_id)),
        [integrations, linkedIntegrationIds],
    );

    const isCoreModule = moduleItem?.ds_key === "core";
    const canToggleStatus = canManage && !isCoreModule;

    function handleToggleStatus(checked: boolean) {
        if (!moduleItem || !canToggleStatus) {
            return;
        }

        if (!checked) {
            setInactiveOpen(true);
            return;
        }

        toggleStatus({ cd_id: moduleItem.cd_id, ds_key: moduleItem.ds_key, fl_active: true });
    }

    function handleConnectIntegration() {
        if (!moduleItem || !selectedIntegrationId) {
            return;
        }

        linkIntegration(
            { cd_module: moduleItem.cd_id, cd_integration: Number(selectedIntegrationId) },
            { onSuccess: () => setSelectedIntegrationId("") },
        );
    }

    function handleDisconnectIntegration(cd_integration: number) {
        if (!moduleItem) {
            return;
        }

        unlinkIntegration({ cd_module: moduleItem.cd_id, cd_integration });
    }

    const switchTooltip = isCoreModule
        ? "O módulo Core nunca pode ser desativado."
        : !canManage
            ? "Você não tem permissão para alterar o status deste módulo."
            : moduleItem?.fl_active
                ? "Inativar módulo"
                : "Ativar módulo";

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
                        Módulo não encontrado.
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
                                            <Switch
                                                checked={moduleItem.fl_active}
                                                disabled={!canToggleStatus || isToggling}
                                                onCheckedChange={handleToggleStatus}
                                            />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>{switchTooltip}</TooltipContent>
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

                                            <div className="flex items-center gap-3">
                                                <StatusDot
                                                    tone={integration.st_status === "ok" ? "ok" : "fail"}
                                                    label={integration.st_status === "ok" ? "Conectado" : "Falha"}
                                                />

                                                <Can permission="modules.manage" fallback={null}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-core-fail hover:text-core-fail"
                                                                disabled={isUnlinking}
                                                                onClick={() =>
                                                                    handleDisconnectIntegration(integration.cd_id)
                                                                }
                                                            >
                                                                <Unlink className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Desconectar integração</TooltipContent>
                                                    </Tooltip>
                                                </Can>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Can permission="modules.manage" fallback={null}>
                                <div className="flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-center">
                                    <Select
                                        value={selectedIntegrationId}
                                        onValueChange={setSelectedIntegrationId}
                                        disabled={availableIntegrations.length === 0}
                                    >
                                        <SelectTrigger className="sm:w-64">
                                            <SelectValue
                                                placeholder={
                                                    availableIntegrations.length === 0
                                                        ? "Todas as integrações já vinculadas"
                                                        : "Selecione uma integração"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableIntegrations.map((integration) => (
                                                <SelectItem
                                                    key={integration.cd_id}
                                                    value={String(integration.cd_id)}
                                                >
                                                    {integration.ds_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!selectedIntegrationId || isLinking}
                                        onClick={handleConnectIntegration}
                                    >
                                        <Link2 className="size-4" />
                                        Conectar integração
                                    </Button>
                                </div>
                            </Can>
                        </Card>
                    </>
                )}
            </div>

            <InactiveModuleModal
                open={inactiveOpen}
                onOpenChange={setInactiveOpen}
                module={moduleItem ?? null}
            />
        </>
    );
}
