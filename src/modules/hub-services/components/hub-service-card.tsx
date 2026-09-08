import { AppWindow, ExternalLink, MonitorCloud, Pencil, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Can } from "@/modules/auth/components/can";

import type { HubServiceStatusCheckResult } from "../hooks/use-check-hub-service-status";
import type { HubService } from "../hooks/use-fetch-hub-services";
import { HubServiceStatusBadge, type HubServiceStatusState } from "./hub-service-status-badge";

const PERMISSION = "hub_services_manage";

interface HubServiceCardProps {
    hubService: HubService;
    statusState: HubServiceStatusState;
    statusResult?: HubServiceStatusCheckResult;
    isChecking: boolean;
    onAccess: (item: HubService) => void;
    onCheckStatus: (cd_id: number) => void;
    onEdit: (item: HubService) => void;
    onDelete: (item: HubService) => void;
}

/**
 * Card do modo "cards" (RF001) — corpo clicável abre `ds_access_url` (RF005),
 * desabilitado com indicação visual quando ausente (RN006). Botões de ação
 * chamam `stopPropagation` para não disparar o clique do corpo do card.
 */
export function HubServiceCard({
    hubService,
    statusState,
    statusResult,
    isChecking,
    onAccess,
    onCheckStatus,
    onEdit,
    onDelete,
}: HubServiceCardProps) {
    const hasAccessUrl = Boolean(hubService.ds_access_url);
    const Icon = hubService.st_type === "SYSTEM" ? AppWindow : MonitorCloud;

    return (
        <Card
            role={hasAccessUrl ? "button" : undefined}
            tabIndex={hasAccessUrl ? 0 : undefined}
            onClick={() => onAccess(hubService)}
            onKeyDown={(event) => {
                if (hasAccessUrl && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onAccess(hubService);
                }
            }}
            className={cn(
                "flex flex-col gap-3 rounded-sm border border-border/60 bg-(image:--background-gradient) p-4 text-left shadow-sm transition-all duration-200",
                hasAccessUrl && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <h3 className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                            {hasAccessUrl && (
                                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                            )}
                            {hubService.ds_title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                            {hubService.st_type === "SYSTEM" ? "Sistema" : "Serviço"} ·{" "}
                            {hubService.st_environment === "PROD" ? "Produção" : "Homologação"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                    <Can permission={PERMISSION} fallback={null}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => onEdit(hubService)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-destructive hover:text-destructive"
                                    onClick={() => onDelete(hubService)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                        </Tooltip>
                    </Can>
                </div>
            </div>

            <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                {hubService.ds_description}
            </p>

            {hubService.ds_ip && (
                <span className="font-mono text-xs text-muted-foreground">
                    {hubService.ds_ip}
                    {hubService.ds_port ? `:${hubService.ds_port}` : ""}
                </span>
            )}

            <div
                className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3"
                onClick={(event) => event.stopPropagation()}
            >
                <HubServiceStatusBadge
                    state={statusState}
                    httpStatus={statusResult?.httpStatus}
                    message={statusResult?.message}
                />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            disabled={!hubService.ds_status_url || isChecking}
                            onClick={() => onCheckStatus(hubService.cd_id)}
                        >
                            <RefreshCw className={cn("size-3.5", isChecking && "animate-spin")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Verificar status</TooltipContent>
                </Tooltip>
            </div>
        </Card>
    );
}
