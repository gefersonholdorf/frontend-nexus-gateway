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
import { formatDate } from "date-fns";
import {
    CalendarDays,
    CheckCircle,
    Edit,
    Eye,
    KeyRound,
    MoreHorizontalIcon,
    Plus,
    Shield,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useFetchRoles, type Role } from "../hooks/use-fetch-roles";
import { Can } from "@/modules/auth/components/can";

// Considera a role ativa quando o status é "ATIVO" ou "ACTIVE".
function isRoleActive(status: string): boolean {
    const normalized = status?.toUpperCase();
    return normalized === "ATIVO" || normalized === "ACTIVE";
}

const columns: Column<Role>[] = [
    {
        key: "ds_name",
        title: "Role",
        icon: Shield,
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
        key: "st_status",
        title: "Status",
        icon: CheckCircle,
        render: (value) => {
            const status = (value ?? "").toString();
            return (
                <div className="flex items-center gap-1">
                    {isRoleActive(status) ? (
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
            );
        },
    },
    {
        key: "dt_created_at",
        title: "Criada em",
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

export function RolesPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({ text: "" });

    // Estados de modais (TODO — componentes ainda não existem).
    const [, setSelectedRole] = useState<Role | null>(null);
    const [, setOpenCreateModal] = useState(false);
    const [, setOpenEditModal] = useState(false);

    const { data, isLoading, isError, refetch } = useFetchRoles();

    // Filtro client-side por nome/descrição.
    const filteredRoles = useMemo(() => {
        const roles = data ?? [];
        const text = filters.text.trim().toLowerCase();

        return roles.filter((role) => {
            if (text.length === 0) return true;
            return (
                role.ds_name.toLowerCase().includes(text) ||
                (role.ds_description ?? "").toLowerCase().includes(text)
            );
        });
    }, [data, filters]);

    // Paginação client-side.
    const total = filteredRoles.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedRoles = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredRoles.slice(start, start + PER_PAGE);
    }, [filteredRoles, currentPage]);

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
        const roles = data ?? [];
        const active = roles.filter((r) => isRoleActive(r.st_status)).length;

        return [
            {
                title: "Total",
                value: roles.length,
                icon: Shield,
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
        ];
    }, [data]);

    function handleFilterText(text: string) {
        setFilters({ text });
        setPage(1);
    }

    function handleEdit(role: Role) {
        setSelectedRole(role);
        setOpenEditModal(true);
        /* TODO: abrir modal de edição de role */
    }

    function handleCreate() {
        setOpenCreateModal(true);
        /* TODO: abrir modal de criação de role */
    }

    return (
        <>
            <HeaderPage
                title="Roles"
                description="Gerencie os papéis de acesso do sistema e as permissões vinculadas a cada um."
                icon={Shield}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Roles</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <div className="flex justify-end">
                    <Can permission="rbac.manage">
                        <Button onClick={handleCreate} className="gap-2">
                            <Plus className="size-4" />
                            Nova role
                        </Button>
                    </Can>
                </div>

                <TableComponentV2
                    data={paginatedRoles}
                    columns={columns}
                    registerName="Roles"
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
                                placeholder="Buscar por nome ou descrição..."
                                value={filters.text}
                                onChange={(e) => handleFilterText(e.target.value)}
                                className="sm:max-w-xs"
                            />
                        </div>
                    }
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(role) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onClick={() => navigate(`/roles/${role.cd_id}`)}>
                                    <Eye /> Ver detalhes
                                </DropdownMenuItem>

                                <Can permission="rbac.manage">
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => handleEdit(role)}>
                                        <Edit /> Editar
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => navigate(`/roles/${role.cd_id}/permissoes`)}
                                    >
                                        <KeyRound /> Gerenciar permissões
                                    </DropdownMenuItem>
                                </Can>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>

            {/* TODO: modais de criação e edição de role.
          Estados prontos: setSelectedRole / setOpenCreateModal / setOpenEditModal. */}
        </>
    );
}