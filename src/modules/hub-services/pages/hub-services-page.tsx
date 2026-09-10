import { HeaderPage } from "@/components/header-page";
import { CardQuantityComponent, TableComponentV2, type Column } from "@/components/table-component-v2";
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "date-fns";
import {
    AppWindow,
    Boxes,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MonitorCheck,
    Network,
    Pencil,
    Plus,
    RefreshCw,
    ShieldCheck,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Can } from "@/modules/auth/components/can";

import { CreateHubServiceModal } from "../components/create-hub-service-modal";
import { DeleteHubServiceModal } from "../components/delete-hub-service-modal";
import { EditHubServiceModal } from "../components/edit-hub-service-modal";
import { HubServiceCard } from "../components/hub-service-card";
import { HubServiceStatusBadge, type HubServiceStatusState } from "../components/hub-service-status-badge";
import { HubServiceViewToggle, type HubServiceViewMode } from "../components/hub-service-view-toggle";
import { useCheckHubServiceStatus, type HubServiceStatusCheckResult } from "../hooks/use-check-hub-service-status";
import { useFetchHubServices, type HubService } from "../hooks/use-fetch-hub-services";

const PERMISSION = "hub_services_manage";
const PAGE_SIZE = 8;

type TypeFilter = "all" | "SYSTEM" | "SERVICE";
type EnvironmentFilter = "all" | "PROD" | "HOM";
type SortOption = "title-asc" | "title-desc" | "newest" | "oldest";

interface Filters {
    search: string;
    type: TypeFilter;
    environment: EnvironmentFilter;
    sort: SortOption;
}

export function HubServicesPage() {
    const { data: hubServices, isLoading, isError, refetch } = useFetchHubServices();
    const { mutate: checkStatus } = useCheckHubServiceStatus();

    const [filters, setFilters] = useState<Filters>({
        search: "",
        type: "all",
        environment: "all",
        sort: "title-asc",
    });
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<HubServiceViewMode>("table");

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<HubService | null>(null);
    const [deleteItem, setDeleteItem] = useState<HubService | null>(null);

    // Estado por item da verificação de status (RF006/RF007/RF009), elevado à
    // página em vez de por linha renderizada: RN010 exige que "Verificar
    // todos" cubra todos os registros filtrados, não só os da página atual —
    // uma instância de mutation por linha montada só cobriria o que está
    // paginado/visível.
    const [statusById, setStatusById] = useState<Record<number, HubServiceStatusCheckResult>>({});
    const [checkingIds, setCheckingIds] = useState<Set<number>>(new Set());

    const allItems = useMemo(() => hubServices ?? [], [hubServices]);

    const filteredItems = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        const filtered = allItems.filter((item) => {
            const matchesSearch =
                search === "" ||
                item.ds_title.toLowerCase().includes(search) ||
                item.ds_description.toLowerCase().includes(search);
            const matchesType = filters.type === "all" || item.st_type === filters.type;
            const matchesEnvironment =
                filters.environment === "all" || item.st_environment === filters.environment;

            return matchesSearch && matchesType && matchesEnvironment;
        });

        const sorted = [...filtered].sort((a, b) => {
            switch (filters.sort) {
                case "title-desc":
                    return b.ds_title.localeCompare(a.ds_title);
                case "newest":
                    return b.dt_created_at.localeCompare(a.dt_created_at);
                case "oldest":
                    return a.dt_created_at.localeCompare(b.dt_created_at);
                case "title-asc":
                default:
                    return a.ds_title.localeCompare(b.ds_title);
            }
        });

        return sorted;
    }, [allItems, filters]);

    // Cards quantitativos (RF001-003) — deliberadamente calculados sobre
    // `filteredItems`, não sobre `allItems`: aqui o pedido explícito é
    // reagir ao filtro ativo (diferente do padrão em core-modules-page.tsx,
    // que reflete o catálogo completo).
    const cardCounts = useMemo(
        () => [
            {
                title: "Sistemas",
                value: filteredItems.filter((item) => item.st_type === "SYSTEM").length,
                icon: AppWindow,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Serviços",
                value: filteredItems.filter((item) => item.st_type === "SERVICE").length,
                icon: MonitorCheck,
                colorText: "text-core-ink",
                borderColor: "hover:border-core-ink",
            },
            {
                title: "Produção",
                value: filteredItems.filter((item) => item.st_environment === "PROD").length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Homologação",
                value: filteredItems.filter((item) => item.st_environment === "HOM").length,
                icon: Network,
                colorText: "text-core-neutral",
                borderColor: "hover:border-core-neutral",
            },
        ],
        [filteredItems],
    );

    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pagedItems = useMemo(
        () => filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredItems, currentPage],
    );

    const pagination = {
        page: currentPage,
        perPage: PAGE_SIZE,
        total: totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function checkOne(cd_id: number) {
        setCheckingIds((prev) => new Set(prev).add(cd_id));
        checkStatus(cd_id, {
            onSuccess: (result) => setStatusById((prev) => ({ ...prev, [cd_id]: result })),
            onSettled: () =>
                setCheckingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(cd_id);
                    return next;
                }),
        });
    }

    // "Verificar todos" (RF007/RN010): dispara sobre todo o conjunto filtrado,
    // não apenas a página atual, ignorando registros sem ds_status_url.
    function checkAll() {
        filteredItems.filter((item) => item.ds_status_url).forEach((item) => checkOne(item.cd_id));
    }

    function handleAccess(item: HubService) {
        if (!item.ds_access_url) {
            return;
        }
        window.open(item.ds_access_url, "_blank", "noopener,noreferrer");
    }

    function statusStateFor(item: HubService): HubServiceStatusState {
        if (checkingIds.has(item.cd_id)) {
            return "checking";
        }
        // RF012: sem URL de status, o item nunca pode ser verificado — estado
        // próprio, distinto de "idle" (que tem URL mas ainda não foi checado).
        if (!item.ds_status_url) {
            return "not_monitored";
        }
        const result = statusById[item.cd_id];
        if (!result) {
            return "idle";
        }
        return result.status === "UP" ? "up" : "down";
    }

    const anyChecking = checkingIds.size > 0;

    const filteringComponent = (
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
            <Input
                placeholder="Buscar por título ou descrição"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="lg:max-w-xs"
            />

            <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value as TypeFilter)}
            >
                <SelectTrigger className="lg:w-40">
                    <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="SYSTEM">Sistema</SelectItem>
                    <SelectItem value="SERVICE">Serviço</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.environment}
                onValueChange={(value) => handleFilterChange("environment", value as EnvironmentFilter)}
            >
                <SelectTrigger className="lg:w-44">
                    <SelectValue placeholder="Ambiente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os ambientes</SelectItem>
                    <SelectItem value="PROD">Produção</SelectItem>
                    <SelectItem value="HOM">Homologação</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value as SortOption)}
            >
                <SelectTrigger className="lg:w-48">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="title-asc">Título (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Título (Z-A)</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    const columns: Column<HubService>[] = [
        {
            key: "ds_title",
            title: "Título",
            icon: AppWindow,
            render: (_, row) => (
                <div className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                        {row.ds_access_url ? (
                            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        ) : null}
                        {row.ds_title}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{row.ds_description}</span>
                </div>
            ),
        },
        {
            key: "st_type",
            title: "Tipo",
            icon: Boxes,
            render: (value) => (value === "SYSTEM" ? "Sistema" : "Serviço"),
        },
        {
            key: "st_environment",
            title: "Ambiente",
            render: (value) => (value === "PROD" ? "Produção" : "Homologação"),
        },
        {
            key: "ds_ip",
            title: "IP:Porta",
            icon: Network,
            render: (_, row) =>
                row.ds_ip ? (
                    <span className="font-mono text-xs">
                        {row.ds_ip}
                        {row.ds_port ? `:${row.ds_port}` : ""}
                    </span>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            key: "ds_status_url",
            title: "Status",
            render: (_, row) => {
                const result = statusById[row.cd_id];
                return (
                    <div
                        className="flex items-center gap-1.5"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <HubServiceStatusBadge
                            state={statusStateFor(row)}
                            httpStatus={result?.httpStatus}
                            message={result?.message}
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    disabled={!row.ds_status_url || checkingIds.has(row.cd_id)}
                                    onClick={() => checkOne(row.cd_id)}
                                >
                                    <RefreshCw
                                        className={`size-3.5 ${checkingIds.has(row.cd_id) ? "animate-spin" : ""}`}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Verificar status</TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            key: "dt_created_at",
            title: "Criado em",
            icon: Calendar,
            render: (value) => <span>{formatDate(value as string, "dd/MM/yyyy")}</span>,
        },
    ];

    return (
        <Can permission={PERMISSION}>
            <HeaderPage
                title="Painel de Sistemas"
                description="Cadastro, acesso e verificação de disponibilidade de sistemas e serviços."
                icon={AppWindow}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Painel de Sistemas</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <HubServiceViewToggle value={viewMode} onChange={setViewMode} />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={checkAll}
                            disabled={anyChecking || filteredItems.every((item) => !item.ds_status_url)}
                        >
                            <RefreshCw className={`size-4 ${anyChecking ? "animate-spin" : ""}`} />
                            Verificar todos
                        </Button>
                        <Can permission={PERMISSION} fallback={null}>
                            <Button size="sm" onClick={() => setCreateOpen(true)}>
                                <Plus className="size-4" />
                                Novo
                            </Button>
                        </Can>
                    </div>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {cardCounts.map((summary) => (
                        <CardQuantityComponent key={summary.title} summary={summary} isLoading={isLoading} />
                    ))}
                </div>

                {viewMode === "cards" ? (
                    <div className="flex flex-col gap-4">
                        <Card className="gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-0 shadow-sm dark:border-border/80">
                            {filteringComponent}
                        </Card>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {pagedItems.map((item) => (
                                <HubServiceCard
                                    key={item.cd_id}
                                    hubService={item}
                                    statusState={statusStateFor(item)}
                                    statusResult={statusById[item.cd_id]}
                                    isChecking={checkingIds.has(item.cd_id)}
                                    onAccess={handleAccess}
                                    onCheckStatus={checkOne}
                                    onEdit={setEditItem}
                                    onDelete={setDeleteItem}
                                />
                            ))}

                            {!isLoading && pagedItems.length === 0 && (
                                <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                                    Nenhum sistema/serviço encontrado para os filtros aplicados.
                                </p>
                            )}
                        </div>

                        {totalItems > 0 && (
                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                <span>
                                    Mostrando {(currentPage - 1) * PAGE_SIZE + 1} a{" "}
                                    {Math.min(currentPage * PAGE_SIZE, totalItems)} de {totalItems} sistemas/serviços
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        disabled={!pagination.hasPreviousPage}
                                        onClick={() => setPage(currentPage - 1)}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <span>
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        disabled={!pagination.hasNextPage}
                                        onClick={() => setPage(currentPage + 1)}
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <TableComponentV2
                        data={pagedItems}
                        columns={columns}
                        registerName="Sistemas/serviços"
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={refetch}
                        getRowKey={(row) => row.cd_id}
                        pagination={pagination}
                        onPageChange={setPage}
                        onRowClick={handleAccess}
                        filteringComponent={filteringComponent}
                        actions={(item) => (
                            <Can permission={PERMISSION} fallback={null}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setEditItem(item);
                                            }}
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
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setDeleteItem(item);
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                            </Can>
                        )}
                    />
                )}
            </div>

            <CreateHubServiceModal open={createOpen} onOpenChange={setCreateOpen} />

            <EditHubServiceModal
                open={Boolean(editItem)}
                onOpenChange={(next) => !next && setEditItem(null)}
                hubService={editItem}
            />

            <DeleteHubServiceModal
                open={Boolean(deleteItem)}
                onOpenChange={(next) => !next && setDeleteItem(null)}
                hubService={deleteItem}
            />
        </Can>
    );
}
