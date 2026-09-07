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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Pencil, Plug, RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import { useMemo, useState } from "react";

import { Can } from "@/modules/auth/components/can";

import { CoreEntityCard } from "../components/core-entity-card";
import { MonoValue } from "../components/core-mono-value";
import { StatusDot } from "../components/core-status-dot";
import { InactiveIntegrationModal } from "../components/inactive-integration-modal";
import { IntegrationDetailsDrawer } from "../components/integration-details-drawer";
import { useFetchIntegrations, type CoreIntegration } from "../hooks/use-fetch-integrations";
import { useTestIntegrationConnection } from "../hooks/use-test-integration-connection";
import { useToggleIntegrationStatus } from "../hooks/use-toggle-integration-status";

type StatusFilter = "all" | "active" | "inactive";
type TypeFilter = "all" | string;

interface Filters {
    ds_type: TypeFilter;
    status: StatusFilter;
}

/**
 * Listagem em cards das integrações (`GET /integrations`, RF024) — sem botão
 * de criar (fora de escopo). Edição/detalhe abrem um `Drawer` a partir do
 * card (não existe rota `/core/integrations/:id`); ativar/inativar usa o
 * `Switch` do rodapé + confirmação de inativação; "Testar Conexão" chama a
 * API (RF027) e tem estado de carregamento próprio por card. Ações de
 * escrita gated por `integrations.manage`.
 */
export function CoreIntegrationsPage() {
    const { data, isLoading } = useFetchIntegrations();
    const { mutate: toggleStatus, isPending: isToggling, variables: toggleVariables } =
        useToggleIntegrationStatus();
    const { mutate: testConnection, isPending: isTesting, variables: testVariables } =
        useTestIntegrationConnection();

    const [filters, setFilters] = useState<Filters>({ ds_type: "all", status: "all" });
    const [selectedIntegrationId, setSelectedIntegrationId] = useState<number | null>(null);
    const [inactiveIntegrationId, setInactiveIntegrationId] = useState<number | null>(null);

    const allIntegrations = useMemo(() => data ?? [], [data]);

    const integrationTypes = useMemo(
        () => Array.from(new Set(allIntegrations.map((integration) => integration.ds_type))),
        [allIntegrations],
    );

    // Filtros client-side (tipo e status) — aceitável, pois é mock em memória.
    const filteredIntegrations = useMemo(() => {
        return allIntegrations.filter((integration) => {
            const matchesType = filters.ds_type === "all" || integration.ds_type === filters.ds_type;
            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" ? integration.fl_active : !integration.fl_active);

            return matchesType && matchesStatus;
        });
    }, [allIntegrations, filters]);

    // KPIs refletem o catálogo completo, não a lista filtrada.
    const summarys = useMemo(
        () => [
            {
                title: "Total de integrações",
                value: allIntegrations.length,
                icon: Plug,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Ativas",
                value: allIntegrations.filter((integration) => integration.fl_active).length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Com falha",
                value: allIntegrations.filter((integration) => integration.st_status === "fail").length,
                icon: ShieldX,
                colorText: "text-core-fail",
                borderColor: "hover:border-core-fail",
            },
        ],
        [allIntegrations],
    );

    const selectedIntegration = useMemo(
        () => allIntegrations.find((integration) => integration.cd_id === selectedIntegrationId) ?? null,
        [allIntegrations, selectedIntegrationId],
    );

    const inactiveIntegration = useMemo(
        () => allIntegrations.find((integration) => integration.cd_id === inactiveIntegrationId) ?? null,
        [allIntegrations, inactiveIntegrationId],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

    function handleToggleStatus(integration: CoreIntegration, checked: boolean) {
        if (!checked) {
            setInactiveIntegrationId(integration.cd_id);
            return;
        }

        toggleStatus({ cd_id: integration.cd_id, fl_active: true });
    }

    return (
        <>
            <HeaderPage
                title="Integrações"
                description="Conexões externas administradas pelo Core. Segredos nunca aparecem em texto puro por padrão."
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

                <Card className="gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-0 shadow-sm dark:border-border/80">
                    <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
                        <Select
                            value={filters.ds_type}
                            onValueChange={(value) => handleFilterChange("ds_type", value)}
                        >
                            <SelectTrigger className="lg:w-48">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os tipos</SelectItem>
                                {integrationTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange("status", value as StatusFilter)}
                        >
                            <SelectTrigger className="lg:w-44">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="active">Ativa</SelectItem>
                                <SelectItem value="inactive">Inativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Grid rígido de cards (RF024/RF025) — sem botão de criar. */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredIntegrations.map((integration) => {
                        const isTestingThis = isTesting && testVariables?.cd_id === integration.cd_id;
                        const isTogglingThis = isToggling && toggleVariables?.cd_id === integration.cd_id;

                        return (
                            <CoreEntityCard
                                key={integration.cd_id}
                                icon={Plug}
                                title={integration.ds_name}
                                description={integration.ds_description}
                                onClick={() => setSelectedIntegrationId(integration.cd_id)}
                                status={<MonoValue className="text-muted-foreground">{integration.ds_type}</MonoValue>}
                                actions={
                                    <div className="flex items-center gap-1">
                                        <Can permission="integrations.manage" fallback={null}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        disabled={isTestingThis}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            testConnection({ cd_id: integration.cd_id });
                                                        }}
                                                    >
                                                        {isTestingThis ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="size-4" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Testar conexão</TooltipContent>
                                            </Tooltip>
                                        </Can>

                                        <Can permission="integrations.manage" fallback={null}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setSelectedIntegrationId(integration.cd_id);
                                                        }}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar integração</TooltipContent>
                                            </Tooltip>
                                        </Can>
                                    </div>
                                }
                                footer={
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span
                                                    className="flex items-center gap-2"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <Can
                                                        permission="integrations.manage"
                                                        fallback={
                                                            <Switch checked={integration.fl_active} disabled />
                                                        }
                                                    >
                                                        <Switch
                                                            checked={integration.fl_active}
                                                            disabled={isTogglingThis}
                                                            onCheckedChange={(checked) =>
                                                                handleToggleStatus(integration, checked)
                                                            }
                                                        />
                                                    </Can>
                                                    <span className="text-xs text-muted-foreground">
                                                        {integration.fl_active ? "Ativa" : "Inativa"}
                                                    </span>
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {integration.fl_active
                                                    ? "Inativar integração"
                                                    : "Ativar integração"}
                                            </TooltipContent>
                                        </Tooltip>

                                        <StatusDot
                                            tone={integration.st_status === "ok" ? "ok" : "fail"}
                                            label={
                                                integration.st_status === "ok"
                                                    ? "Conectado"
                                                    : "Falha na conexão"
                                            }
                                        />
                                    </div>
                                }
                            />
                        );
                    })}

                    {!isLoading && filteredIntegrations.length === 0 && (
                        <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                            Nenhuma integração encontrada para os filtros aplicados.
                        </p>
                    )}
                </div>
            </div>

            <IntegrationDetailsDrawer
                open={Boolean(selectedIntegration)}
                onOpenChange={(next) => !next && setSelectedIntegrationId(null)}
                integration={selectedIntegration}
            />

            <InactiveIntegrationModal
                open={Boolean(inactiveIntegration)}
                onOpenChange={(next) => !next && setInactiveIntegrationId(null)}
                integration={inactiveIntegration}
            />
        </>
    );
}
