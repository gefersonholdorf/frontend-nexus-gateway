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
import { Eye, EyeOff, Plug, ShieldCheck, ShieldX } from "lucide-react";
import { useMemo, useState } from "react";

import { CoreEntityCard } from "../components/core-entity-card";
import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { useFetchIntegrations } from "../hooks/use-fetch-integrations";

export function CoreIntegrationsPage() {
    const { data, isLoading } = useFetchIntegrations();
    const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

    const items = useMemo(() => data ?? [], [data]);

    const summarys = useMemo(
        () => [
            {
                title: "Total de integrações",
                value: items.length,
                icon: Plug,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Conectadas",
                value: items.filter((integration) => integration.st_status === "ok").length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Com falha",
                value: items.filter((integration) => integration.st_status === "fail").length,
                icon: ShieldX,
                colorText: "text-core-fail",
                borderColor: "hover:border-core-fail",
            },
        ],
        [items],
    );

    function toggleReveal(id: number) {
        setRevealedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    return (
        <>
            <HeaderPage
                title="Integrações"
                description="Conexões externas simuladas (Jira, GLPI, Microsoft, OpenVPN). Segredos nunca aparecem em texto puro por padrão."
                icon={Plug}
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
                                <BreadcrumbPage>Integrações</BreadcrumbPage>
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

                {/* "Testar Conexão" e edição de configuração chegam na Etapa 6. */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((integration) => {
                        const isRevealed = revealedIds.has(integration.cd_id);

                        return (
                            <CoreEntityCard
                                key={integration.cd_id}
                                icon={Plug}
                                title={integration.ds_name}
                                description={integration.ds_description}
                                status={
                                    <StatusDot
                                        tone={integration.st_status === "ok" ? "ok" : "fail"}
                                        label={integration.st_status === "ok" ? "Conectado" : "Falha na conexão"}
                                    />
                                }
                                footer={
                                    <div className="flex w-full flex-col gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center justify-between gap-2">
                                            <span>Ativa</span>
                                            {integration.fl_active ? (
                                                <StatusDot tone="ok" label="Sim" />
                                            ) : (
                                                <StatusDot tone="off" label="Não" />
                                            )}
                                        </div>

                                        {Object.entries(integration.ds_config).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between gap-2">
                                                <span className="capitalize">{key}</span>
                                                <MonoValue>{value}</MonoValue>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between gap-2">
                                            <span>Segredo</span>
                                            <div className="flex items-center gap-1.5">
                                                <MonoValue>
                                                    {isRevealed
                                                        ? integration.ds_secret
                                                        : "•".repeat(Math.min(integration.ds_secret.length, 12))}
                                                </MonoValue>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-6"
                                                    onClick={() => toggleReveal(integration.cd_id)}
                                                    aria-label={isRevealed ? "Ocultar segredo" : "Revelar segredo"}
                                                >
                                                    {isRevealed ? (
                                                        <EyeOff className="size-3.5" />
                                                    ) : (
                                                        <Eye className="size-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
