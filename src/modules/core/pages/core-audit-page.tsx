import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDate } from "date-fns";
import {
    Boxes,
    Clock,
    FilePlus2,
    History,
    Laptop,
    Network,
    PencilLine,
    Trash2,
    User as UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Can } from "@/modules/auth/components/can";

import { MonoValue } from "../components/core-mono-value";
import { useFetchAudit, type AuditItem } from "@/modules/audit/hooks/use-fetch-audit";

type AuditAction = "all" | "CREATE" | "UPDATE" | "DELETE";

interface Filters {
    cd_user: string;
    ds_action: AuditAction;
    ds_entity: string;
    from: string;
    to: string;
}

const PAGE_SIZE = 10;

const columns: Column<AuditItem>[] = [
    {
        key: "ds_action",
        title: "Ação",
        icon: History,
        render: (value) => {
            const action = (value ?? "").toString().toUpperCase();

            if (action === "CREATE") {
                return (
                    <Badge className="border border-border bg-transparent">
                        <FilePlus2 className="size-4 text-emerald-500" />
                        <span className="text-emerald-500">CREATE</span>
                    </Badge>
                );
            }
            if (action === "UPDATE") {
                return (
                    <Badge className="border border-border bg-transparent">
                        <PencilLine className="size-4 text-amber-500" />
                        <span className="text-amber-500">UPDATE</span>
                    </Badge>
                );
            }
            if (action === "DELETE") {
                return (
                    <Badge className="border border-border bg-transparent">
                        <Trash2 className="size-4 text-red-500" />
                        <span className="text-red-500">DELETE</span>
                    </Badge>
                );
            }
            return <span className="text-sm text-muted-foreground">{action || "---"}</span>;
        },
    },
    {
        key: "ds_entity",
        title: "Módulo/Entidade",
        icon: Boxes,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{value.toString()}</span>;
        },
    },
    {
        key: "ds_user_name",
        title: "Usuário",
        icon: UserIcon,
        // Sem cd_user, a ação foi executada pelo próprio sistema; com cd_user
        // mas sem ds_user_name, mostramos o ID como fallback.
        render: (_value, row) => {
            if (row.cd_user === null || row.cd_user === undefined) {
                return <span className="text-sm text-muted-foreground">Sistema</span>;
            }
            return <span>{row.ds_user_name ?? `#${row.cd_user}`}</span>;
        },
    },
    {
        key: "dt_created_at",
        title: "Data/Hora",
        icon: Clock,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{formatDate(value.toString(), "dd/MM/yyyy HH:mm")}</span>;
        },
    },
    {
        key: "ds_ip",
        title: "IP",
        icon: Network,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <MonoValue>{value as string}</MonoValue>;
        },
    },
    {
        key: "ds_agent",
        title: "Agente",
        icon: Laptop,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{value.toString()}</span>;
        },
    },
];

/**
 * Trilha de auditoria do Core (RF028). Somente leitura: sem botão de
 * criação, sem coluna/ação de escrita. Consome o hook V2 real
 * (`useFetchAudit`, `GET /audit`) — mesma fonte de dados usada por
 * `src/modules/audit/pages/audit-page.tsx`. Paginação e filtros são
 * SERVER-SIDE (enviados ao hook), não client-side.
 */
export function CoreAuditPage() {
    const [filters, setFilters] = useState<Filters>({
        cd_user: "",
        ds_action: "all",
        ds_entity: "",
        from: "",
        to: "",
    });
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useFetchAudit({
        page,
        pageSize: PAGE_SIZE,
        cd_user: filters.cd_user.trim() ? Number(filters.cd_user) : undefined,
        ds_action: filters.ds_action === "all" ? undefined : filters.ds_action,
        ds_entity: filters.ds_entity.trim() || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
    });

    const items = useMemo(() => data?.items ?? [], [data]);

    // LIMITAÇÃO DO BACKEND: o retorno atual NÃO traz total/totalPages.
    // Estimamos o total como (page-1)*pageSize + items.length (apenas o
    // visto até aqui) e usamos hasNextPage = items.length === pageSize como
    // heurística de "há próxima página" — mesmo padrão de
    // `src/modules/audit/pages/audit-page.tsx`.
    const pagination = {
        page,
        perPage: PAGE_SIZE,
        total: (page - 1) * PAGE_SIZE + items.length,
        totalPages: page + (items.length === PAGE_SIZE ? 1 : 0),
        hasNextPage: items.length === PAGE_SIZE,
        hasPreviousPage: page > 1,
    };

    // KPIs (RF028) refletem apenas os eventos da PÁGINA atual — mesma
    // limitação de paginação descrita acima.
    const summarys = useMemo(
        () => [
            {
                title: "Eventos (página)",
                value: items.length,
                icon: History,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Criações",
                value: items.filter((item) => item.ds_action === "CREATE").length,
                icon: FilePlus2,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Atualizações",
                value: items.filter((item) => item.ds_action === "UPDATE").length,
                icon: PencilLine,
                colorText: "text-amber-500",
                borderColor: "hover:border-amber-500",
            },
            {
                title: "Exclusões",
                value: items.filter((item) => item.ds_action === "DELETE").length,
                icon: Trash2,
                colorText: "text-core-fail",
                borderColor: "hover:border-core-fail",
            },
        ],
        [items],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    return (
        // Tela inteira exige permissão de leitura de auditoria (RF028) —
        // sem fallback, mesmo padrão de `src/modules/audit/pages/audit-page.tsx`.
        <Can permission="audit.read">
            <HeaderPage
                title="Auditoria"
                description="Trilha de eventos administrativos do módulo Core."
                icon={History}
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
                                <BreadcrumbPage>Auditoria</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Somente leitura: sem botão de criação, sem ações por linha. */}
                <TableComponentV2
                    data={items}
                    columns={columns}
                    registerName="Eventos"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    cardsQuantity={{ summarys, isLoading }}
                    pagination={pagination}
                    onPageChange={setPage}
                    filteringComponent={
                        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
                            <Input
                                type="number"
                                placeholder="ID do usuário"
                                value={filters.cd_user}
                                onChange={(e) => handleFilterChange("cd_user", e.target.value)}
                                className="lg:w-40"
                            />

                            <Select
                                value={filters.ds_action}
                                onValueChange={(value) =>
                                    handleFilterChange("ds_action", value as AuditAction)
                                }
                            >
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Ação" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as ações</SelectItem>
                                    <SelectItem value="CREATE">CREATE</SelectItem>
                                    <SelectItem value="UPDATE">UPDATE</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Módulo/Entidade (ex.: user, role...)"
                                value={filters.ds_entity}
                                onChange={(e) => handleFilterChange("ds_entity", e.target.value)}
                                className="lg:max-w-xs"
                            />

                            <Input
                                type="date"
                                aria-label="Data inicial"
                                value={filters.from}
                                onChange={(e) => handleFilterChange("from", e.target.value)}
                                className="lg:w-44"
                            />

                            <Input
                                type="date"
                                aria-label="Data final"
                                value={filters.to}
                                onChange={(e) => handleFilterChange("to", e.target.value)}
                                className="lg:w-44"
                            />
                        </div>
                    }
                />
            </div>
        </Can>
    );
}
