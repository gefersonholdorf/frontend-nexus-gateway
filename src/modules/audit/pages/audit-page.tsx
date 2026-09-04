import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { HeaderPage } from "@/components/header-page";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "date-fns";
import {
    Boxes,
    Clock,
    FilePlus2,
    FileText,
    History,
    PencilLine,
    Trash2,
    User as UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFetchAudit, type AuditItem } from "../hooks/use-fetch-audit";
import { Can } from "@/modules/auth/components/can";

type AuditAction = "all" | "CREATE" | "UPDATE" | "DELETE";

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
        title: "Entidade",
        icon: Boxes,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{value.toString()}</span>;
        },
    },
    {
        key: "cd_user",
        title: "Usuário",
        icon: UserIcon,
        // Sem cd_user, a ação foi executada pelo próprio sistema.
        render: (value) => {
            if (value === null || value === undefined) {
                return <span className="text-sm text-muted-foreground">Sistema</span>;
            }
            return <span>#{value.toString()}</span>;
        },
    },
    {
        key: "ds_details",
        title: "Detalhes",
        icon: FileText,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            const details = value.toString();
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="block max-w-72 truncate">{details}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-96">
                        <span className="text-xs">{details}</span>
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        key: "dt_created_at",
        title: "Data",
        icon: Clock,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{formatDate(value.toString(), "dd/MM/yyyy HH:mm")}</span>;
        },
    },
];

// Filtros server-side (enviados ao hook useFetchAudit).
interface Filters {
    ds_action: AuditAction;
    ds_entity: string;
    cd_user: string;
    from: string;
    to: string;
}

const PAGE_SIZE = 20;

export function AuditPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        ds_action: "all",
        ds_entity: "",
        cd_user: "",
        from: "",
        to: "",
    });

    // Auditoria é SERVER-SIDE: enviamos page/pageSize e filtros ao hook.
    const { data, isLoading, isError, refetch } = useFetchAudit({
        page,
        pageSize: PAGE_SIZE,
        ds_action: filters.ds_action === "all" ? undefined : filters.ds_action,
        ds_entity: filters.ds_entity.trim() || undefined,
        cd_user: filters.cd_user.trim() ? Number(filters.cd_user) : undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
    });

    const items = data?.items ?? [];

    // LIMITAÇÃO DO BACKEND: o retorno atual NÃO traz total/totalPages.
    // Estimamos o total como (page-1)*pageSize + items.length (apenas o visto até aqui)
    // e usamos hasNextPage = items.length === pageSize como heurística de "há próxima página".
    const pagination = {
        page,
        perPage: PAGE_SIZE,
        total: (page - 1) * PAGE_SIZE + items.length,
        totalPages: page + (items.length === PAGE_SIZE ? 1 : 0),
        hasNextPage: items.length === PAGE_SIZE,
        hasPreviousPage: page > 1,
    };

    // Card único: total da PÁGINA atual (não é o total geral — vide limitação acima).
    const summarys = useMemo(
        () => [
            {
                title: "Eventos (página)",
                value: items.length,
                icon: History,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
        ],
        [items.length],
    );

    // Ao alterar qualquer filtro, voltamos para a página 1.
    function handleFilterChange<K extends keyof Filters>(
        key: K,
        value: Filters[K],
    ) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    return (
        // A página inteira exige permissão de leitura de auditoria.
        // OBS: o RouteGuard também pode cuidar disso na definição da rota.
        <Can permission="audit.read">
            <HeaderPage
                title="Auditoria"
                description="Trilha de eventos do sistema. Consulte ações de criação, atualização e exclusão por entidade e usuário."
                icon={History}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
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
                {/* Tela somente leitura: sem botão de criação. */}
                <TableComponentV2
                    data={items}
                    columns={columns}
                    registerName="Eventos"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    cardsQuantity={{
                        summarys,
                        isLoading,
                    }}
                    filteringComponent={
                        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:flex-wrap">
                            <Select
                                value={filters.ds_action}
                                onValueChange={(value) =>
                                    handleFilterChange("ds_action", value as AuditAction)
                                }
                            >
                                <SelectTrigger className="lg:w-48">
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
                                placeholder="Entidade (ex.: user, role...)"
                                value={filters.ds_entity}
                                onChange={(e) => handleFilterChange("ds_entity", e.target.value)}
                                className="lg:max-w-xs"
                            />

                            <Input
                                type="number"
                                placeholder="ID do usuário"
                                value={filters.cd_user}
                                onChange={(e) => handleFilterChange("cd_user", e.target.value)}
                                className="lg:w-40"
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
                    pagination={pagination}
                    onPageChange={setPage}
                />
            </div>
        </Can>
    );
}