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
import { Switch } from "@/components/ui/switch";
import { formatDate } from "date-fns";
import {
    Boxes,
    CalendarDays,
    CheckCircle,
    Edit,
    Eye,
    Hash,
    KeyRound,
    MoreHorizontalIcon,
    Plug,
    Plus,
    Trash2,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useFetchModules, type Module } from "../hooks/use-fetch-modules";
import { useHasPermission } from "@/modules/providers/permission-provider";
import { useToggleModuleActive } from "../hooks/use-toggle-module-active";
import { useDeleteModule } from "../hooks/use-delete-module";
import { Can } from "@/modules/auth/components/can";

// Célula de status: Switch (protegido por permissão) + Badge Ativo/Inativo.
// Componente isolado para poder usar o hook useHasPermission dentro do render.
function ModuleStatusCell({ module }: { module: Module }) {
    const canManage = useHasPermission("modules.manage");
    const toggleModule = useToggleModuleActive();

    return (
        <div className="flex items-center gap-2">
            {canManage && (
                <Switch
                    checked={module.fl_active}
                    onCheckedChange={() =>
                        toggleModule.mutate({ id: module.cd_id, fl_active: !module.fl_active })
                    }
                    aria-label={module.fl_active ? "Desativar módulo" : "Ativar módulo"}
                />
            )}

            {module.fl_active ? (
                <Badge className="border border-border bg-transparent text-primary-text/10">
                    <CheckCircle className="size-4 text-emerald-500" />
                    <span className="text-emerald-500">Ativo</span>
                </Badge>
            ) : (
                <Badge className="border border-border bg-transparent text-primary-text/10">
                    <XCircle className="size-4 text-red-500" />
                    <span className="text-red-500">Inativo</span>
                </Badge>
            )}
        </div>
    );
}

const columns: Column<Module>[] = [
    {
        key: "ds_name",
        title: "Módulo",
        icon: Boxes,
        render: (_, row) => (
            <div className="flex min-w-0 max-w-72 flex-col">
                <span className="truncate font-medium">{row.ds_name}</span>
                {row.ds_description ? (
                    <span className="truncate text-[.8rem] text-muted-foreground">
                        {row.ds_description}
                    </span>
                ) : (
                    <span className="text-[.8rem] text-muted-foreground">---</span>
                )}
            </div>
        ),
    },
    {
        key: "ds_key",
        title: "Chave",
        icon: Hash,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return (
                <Badge variant="outline" className="font-mono text-xs">
                    {value.toString()}
                </Badge>
            );
        },
    },
    {
        key: "fl_active",
        title: "Status",
        icon: CheckCircle,
        render: (_, row) => <ModuleStatusCell module={row} />,
    },
    {
        key: "dt_created_at",
        title: "Criado em",
        icon: CalendarDays,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{formatDate(value.toString(), "dd/MM/yyyy")}</span>;
        },
    },
];

interface Filters {
    text: string;
}

const PER_PAGE = 10;

export function ModulesPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({ text: "" });

    // Estados de modais (TODO — componentes ainda não existem).
    const [, setSelectedModule] = useState<Module | null>(null);
    const [, setOpenCreateModal] = useState(false);
    const [, setOpenEditModal] = useState(false);

    const { data, isLoading, isError, refetch } = useFetchModules();
    const deleteModule = useDeleteModule();

    // Filtro client-side por nome/chave.
    const filteredModules = useMemo(() => {
        const modules = data ?? [];
        const text = filters.text.trim().toLowerCase();

        return modules.filter((module) => {
            if (text.length === 0) return true;
            return (
                module.ds_name.toLowerCase().includes(text) ||
                module.ds_key.toLowerCase().includes(text)
            );
        });
    }, [data, filters]);

    // Paginação client-side.
    const total = filteredModules.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedModules = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredModules.slice(start, start + PER_PAGE);
    }, [filteredModules, currentPage]);

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
        const modules = data ?? [];
        const active = modules.filter((m) => m.fl_active).length;
        const inactive = modules.filter((m) => !m.fl_active).length;

        return [
            {
                title: "Total",
                value: modules.length,
                icon: Boxes,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "Ativos",
                value: active,
                icon: CheckCircle,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Inativos",
                value: inactive,
                icon: XCircle,
                colorText: "text-red-400",
                borderColor: "hover:border-red-400",
            },
        ];
    }, [data]);

    function handleFilterText(text: string) {
        setFilters({ text });
        setPage(1);
    }

    function handleEdit(module: Module) {
        setSelectedModule(module);
        setOpenEditModal(true);
        /* TODO: abrir modal de edição de módulo */
    }

    function handleCreate() {
        setOpenCreateModal(true);
        /* TODO: abrir modal de criação de módulo */
    }

    // Exclusão direta com confirmação simples.
    // TODO: substituir window.confirm por um modal de confirmação (DeleteModuleModal).
    function handleDelete(module: Module) {
        const confirmed = window.confirm(
            `Deseja realmente excluir o módulo "${module.ds_name}"?`,
        );
        if (!confirmed) return;

        try {
            deleteModule.mutate({ id: module.cd_id });
        } catch (error) {
            console.error("Erro ao excluir módulo:", error);
        }
    }

    return (
        <>
            <HeaderPage
                title="Módulos"
                description="Gerencie os módulos do sistema, suas chaves, permissões e integrações."
                icon={Boxes}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Módulos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <div className="flex justify-end">
                    <Can permission="modules.manage">
                        <Button onClick={handleCreate} className="gap-2">
                            <Plus className="size-4" />
                            Novo módulo
                        </Button>
                    </Can>
                </div>

                <TableComponentV2
                    data={paginatedModules}
                    columns={columns}
                    registerName="Módulos"
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
                                placeholder="Buscar por nome ou chave..."
                                value={filters.text}
                                onChange={(e) => handleFilterText(e.target.value)}
                                className="sm:max-w-xs"
                            />
                        </div>
                    }
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(module) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onClick={() => navigate(`/modulos/${module.cd_id}`)}>
                                    <Eye /> Ver detalhes
                                </DropdownMenuItem>

                                <Can permission="modules.manage">
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => handleEdit(module)}>
                                        <Edit /> Editar
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => navigate(`/modulos/${module.cd_id}/permissoes`)}
                                    >
                                        <KeyRound /> Gerenciar permissões
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => navigate(`/modulos/${module.cd_id}/integracoes`)}
                                    >
                                        <Plug /> Gerenciar integrações
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => handleDelete(module)}
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

            {/* TODO: modais de criação/edição de módulo e confirmação de exclusão.
          Estados prontos: setSelectedModule / setOpenCreateModal / setOpenEditModal. */}
        </>
    );
}