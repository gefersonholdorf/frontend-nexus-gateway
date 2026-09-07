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
import { useFetchCoreAudit } from "../hooks/use-fetch-core-audit";
import { auditMock, type CoreAuditItem } from "../mocks/audit.mock";

type AuditAction = "all" | "CREATE" | "UPDATE" | "DELETE" | "READ";

interface Filters {
    ds_user: string;
    ds_action: AuditAction;
    ds_module: string;
    from: string;
    to: string;
}

const PAGE_SIZE = 10;

const columns: Column<CoreAuditItem>[] = [
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
        key: "ds_module",
        title: "Módulo/Entidade",
        icon: Boxes,
    },
    {
        key: "ds_user",
        title: "Usuário",
        icon: UserIcon,
    },
    {
        key: "dt_created_at",
        title: "Data/Hora",
        icon: Clock,
        render: (value) => <span>{formatDate(value as string, "dd/MM/yyyy HH:mm")}</span>,
    },
    {
        key: "ds_ip",
        title: "IP",
        icon: Network,
        render: (value) => <MonoValue>{value as string}</MonoValue>,
    },
    {
        key: "ds_agent",
        title: "Agente",
        icon: Laptop,
    },
];

/**
 * Trilha de auditoria mockada do Core (RF029/RF030). Somente leitura: sem
 * botão de criação, sem coluna/ação de escrita. Filtros (usuário, ação,
 * módulo, período) e paginação são aplicados client-side sobre o mock em
 * memória, no mesmo padrão de `core-users-page.tsx`/`core-integrations-page.tsx`.
 */
export function CoreAuditPage() {
    const [filters, setFilters] = useState<Filters>({
        ds_user: "",
        ds_action: "all",
        ds_module: "",
        from: "",
        to: "",
    });
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useFetchCoreAudit({
        ds_user: filters.ds_user.trim() || undefined,
        ds_action: filters.ds_action === "all" ? undefined : filters.ds_action,
        ds_module: filters.ds_module === "all" ? undefined : filters.ds_module,
        from: filters.from || undefined,
        to: filters.to || undefined,
    });

    const allItems = useMemo(() => data ?? [], [data]);

    const totalItems = allItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pagedItems = useMemo(
        () => allItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [allItems, currentPage],
    );

    const pagination = {
        page: currentPage,
        perPage: PAGE_SIZE,
        total: totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    // Opções do filtro de módulo vêm do catálogo completo (não da lista já
    // filtrada), para o Select não perder opções conforme o usuário filtra.
    const moduleOptions = useMemo(() => Array.from(new Set(auditModules(auditMock))), []);

    // KPIs (RF030) refletem os eventos que atendem aos filtros aplicados.
    const summarys = useMemo(
        () => [
            {
                title: "Eventos",
                value: allItems.length,
                icon: History,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Criações",
                value: allItems.filter((item) => item.ds_action === "CREATE").length,
                icon: FilePlus2,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Atualizações",
                value: allItems.filter((item) => item.ds_action === "UPDATE").length,
                icon: PencilLine,
                colorText: "text-amber-500",
                borderColor: "hover:border-amber-500",
            },
            {
                title: "Exclusões",
                value: allItems.filter((item) => item.ds_action === "DELETE").length,
                icon: Trash2,
                colorText: "text-core-fail",
                borderColor: "hover:border-core-fail",
            },
        ],
        [allItems],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    return (
        // Tela inteira exige permissão de leitura de auditoria (RF029/RN013) —
        // sem fallback, mesmo padrão de `src/modules/audit/pages/audit-page.tsx`.
        <Can permission="audit.read">
            <HeaderPage
                title="Auditoria"
                description="Trilha de eventos administrativos do módulo Core. Tela somente leitura, dados mockados e estáticos."
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
                {/* Somente leitura (RN013): sem botão de criação, sem ações por linha. */}
                <TableComponentV2
                    data={pagedItems}
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
                                placeholder="Buscar por usuário"
                                value={filters.ds_user}
                                onChange={(e) => handleFilterChange("ds_user", e.target.value)}
                                className="lg:max-w-xs"
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
                                    <SelectItem value="READ">READ</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.ds_module || "all"}
                                onValueChange={(value) => handleFilterChange("ds_module", value)}
                            >
                                <SelectTrigger className="lg:w-48">
                                    <SelectValue placeholder="Módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os módulos</SelectItem>
                                    {moduleOptions.map((module) => (
                                        <SelectItem key={module} value={module}>
                                            {module}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

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

// Opções de módulo do filtro são derivadas dos próprios dados mockados, para
// não precisar manter uma lista fixa em paralelo ao mock.
function auditModules(items: CoreAuditItem[]): string[] {
    return items.map((item) => item.ds_module).sort((a, b) => a.localeCompare(b));
}
