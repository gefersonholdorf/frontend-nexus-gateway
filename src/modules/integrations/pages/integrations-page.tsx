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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    Edit,
    MoreHorizontalIcon,
    Plug,
    PlugZap,
    Plus,
    RefreshCw,
    Tag,
    Trash2,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFetchIntegrations, type Integration } from "../hooks/use-fetch-integrations";
import { useTestIntegration } from "../hooks/use-test-integration";
import { useSyncIntegration } from "../hooks/use-sync-integration";
import { useDeleteIntegration } from "../hooks/use-delete-integration";
import { Can } from "@/modules/auth/components/can";

const columns: Column<Integration>[] = [
    {
        key: "ds_name",
        title: "Integração",
        icon: Plug,
        // NOTA: secret é write-only — nunca exibido aqui nem em qualquer célula.
        render: (_, row) => (
            <div className="flex min-w-0 max-w-72 flex-col">
                <span className="truncate font-medium">{row.ds_name}</span>
                <span className="truncate text-[.8rem] text-muted-foreground">
                    {row.ds_type}
                </span>
            </div>
        ),
    },
    {
        key: "ds_type",
        title: "Tipo",
        icon: Tag,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return (
                <Badge variant="outline" className="text-xs">
                    {value.toString()}
                </Badge>
            );
        },
    },
    {
        key: "fl_active",
        title: "Status",
        icon: CheckCircle,
        render: (value) => (
            <div className="flex items-center gap-1">
                {value ? (
                    <Badge className="border border-border bg-transparent text-primary-text/10">
                        <CheckCircle className="size-4 text-emerald-500" />
                        <span className="text-emerald-500">Ativa</span>
                    </Badge>
                ) : (
                    <Badge className="border border-border bg-transparent text-primary-text/10">
                        <XCircle className="size-4 text-gray-500" />
                        <span className="text-gray-500">Inativa</span>
                    </Badge>
                )}
            </div>
        ),
    },
];

interface Filters {
    text: string;
    status: "all" | "active" | "inactive";
}

const PER_PAGE = 10;

export function IntegrationsPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({ text: "", status: "all" });

    // Estados de modais (TODO — componentes ainda não existem).
    const [, setSelectedIntegration] = useState<Integration | null>(null);
    const [, setOpenCreateModal] = useState(false);
    const [, setOpenEditModal] = useState(false);

    const { data, isLoading, isError, refetch } = useFetchIntegrations();
    const testIntegration = useTestIntegration();
    const syncIntegration = useSyncIntegration();
    const deleteIntegration = useDeleteIntegration();

    // Filtro client-side por texto (nome/tipo) e status.
    const filteredIntegrations = useMemo(() => {
        const integrations = data ?? [];
        const text = filters.text.trim().toLowerCase();

        return integrations.filter((integration) => {
            const matchesText =
                text.length === 0 ||
                integration.ds_name.toLowerCase().includes(text) ||
                integration.ds_type.toLowerCase().includes(text);

            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" && integration.fl_active) ||
                (filters.status === "inactive" && !integration.fl_active);

            return matchesText && matchesStatus;
        });
    }, [data, filters]);

    // Paginação client-side.
    const total = filteredIntegrations.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedIntegrations = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredIntegrations.slice(start, start + PER_PAGE);
    }, [filteredIntegrations, currentPage]);

    const pagination = {
        page: currentPage,
        perPage: PER_PAGE,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    // Cards de resumo derivados do array.
    const summarys = useMemo(() => {
        const integrations = data ?? [];
        const active = integrations.filter((i) => i.fl_active).length;
        const inactive = integrations.filter((i) => !i.fl_active).length;

        return [
            {
                title: "Total",
                value: integrations.length,
                icon: Plug,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "Ativas",
                value: active,
                icon: CheckCircle,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Inativas",
                value: inactive,
                icon: XCircle,
                colorText: "text-red-400",
                borderColor: "hover:border-red-400",
            },
        ];
    }, [data]);

    function handleFilterText(text: string) {
        setFilters((prev) => ({ ...prev, text }));
        setPage(1);
    }

    function handleFilterStatus(status: Filters["status"]) {
        setFilters((prev) => ({ ...prev, status }));
        setPage(1);
    }

    // Testar conexão da integração.
    // NOTA: idealmente usar toast; window.alert é temporário.
    async function handleTest(integration: Integration) {
        try {
            const result = await testIntegration.mutateAsync({ id: integration.cd_id });
            window.alert(
                result.ok
                    ? result.message ?? "Conexão testada com sucesso."
                    : result.message ?? "Falha ao testar a conexão.",
            );
        } catch (error) {
            console.error("Erro ao testar integração:", error);
            window.alert("Erro ao testar a conexão.");
        }
    }

    // Sincronizar integração.
    async function handleSync(integration: Integration) {
        try {
            const result = await syncIntegration.mutateAsync({ id: integration.cd_id });
            window.alert(
                result.ok
                    ? result.message ?? "Sincronização iniciada com sucesso."
                    : result.message ?? "Falha ao sincronizar.",
            );
        } catch (error) {
            console.error("Erro ao sincronizar integração:", error);
            window.alert("Erro ao sincronizar a integração.");
        }
    }

    function handleEdit(integration: Integration) {
        setSelectedIntegration(integration);
        setOpenEditModal(true);
        /* TODO: abrir modal de edição ou navigate(`/integracoes/${integration.cd_id}/editar`) */
    }

    // Exclusão com confirmação simples.
    // TODO: substituir window.confirm por modal de confirmação (DeleteIntegrationModal).
    async function handleDelete(integration: Integration) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a integração "${integration.ds_name}"?`,
        );
        if (!confirmed) return;

        try {
            await deleteIntegration.mutateAsync({ id: integration.cd_id });
        } catch (error) {
            console.error("Erro ao excluir integração:", error);
            window.alert("Erro ao excluir a integração.");
        }
    }

    function handleCreate() {
        setOpenCreateModal(true);
        /* TODO: abrir modal de criação de integração */
    }

    return (
        <>
            <HeaderPage
                title="Integrações"
                description="Gerencie as integrações externas do sistema, teste conexões e sincronize dados."
                icon={Plug}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
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
                <div className="flex justify-end">
                    <Can permission="integrations.manage">
                        <Button onClick={handleCreate} className="gap-2">
                            <Plus className="size-4" />
                            Nova integração
                        </Button>
                    </Can>
                </div>

                <TableComponentV2
                    data={paginatedIntegrations}
                    columns={columns}
                    registerName="Integrações"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    cardsQuantity={{
                        summarys,
                        isLoading,
                    }}
                    filteringComponent={
                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                            <Input
                                placeholder="Buscar por nome ou tipo..."
                                value={filters.text}
                                onChange={(e) => handleFilterText(e.target.value)}
                                className="sm:max-w-xs"
                            />

                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    handleFilterStatus(value as Filters["status"])
                                }
                            >
                                <SelectTrigger className="sm:w-48">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="active">Ativas</SelectItem>
                                    <SelectItem value="inactive">Inativas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(integration) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onClick={() => handleTest(integration)}>
                                    <PlugZap /> Testar conexão
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSync(integration)}>
                                    <RefreshCw /> Sincronizar
                                </DropdownMenuItem>

                                <Can permission="integrations.manage">
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => handleEdit(integration)}>
                                        <Edit /> Editar
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => handleDelete(integration)}
                                        className="text-red-500 focus:text-red-500"
                                    >
                                        <Trash2 /> Excluir
                                    </DropdownMenuItem>
                                </Can>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>

            {/* TODO: modais de criação/edição de integração e confirmação de exclusão.
          Estados prontos: setSelectedIntegration / setOpenCreateModal / setOpenEditModal.
          LEMBRETE: secret é write-only — nunca exibir valor; apenas permitir escrita. */}
        </>
    );
}