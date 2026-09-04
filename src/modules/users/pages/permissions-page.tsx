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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Edit,
    Hash,
    KeyRound,
    MoreHorizontalIcon,
    Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFetchPermissions, type Permission } from "@/modules/rbac/hooks/use-fetch-permissions";
import { Can } from "@/modules/auth/components/can";

const columns: Column<Permission>[] = [
    {
        key: "ds_name",
        title: "Permissão",
        icon: KeyRound,
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
];

interface Filters {
    text: string;
}

const PER_PAGE = 10;

export function PermissionsPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({ text: "" });

    // Estados de modais (TODO — componentes ainda não existem).
    const [, setSelectedPermission] = useState<Permission | null>(null);
    const [, setOpenCreateModal] = useState(false);
    const [, setOpenEditModal] = useState(false);

    const { data, isLoading, isError, refetch } = useFetchPermissions();

    // Filtro client-side por chave/nome.
    const filteredPermissions = useMemo(() => {
        const permissions = data ?? [];
        const text = filters.text.trim().toLowerCase();

        return permissions.filter((permission) => {
            if (text.length === 0) return true;
            return (
                permission.ds_key.toLowerCase().includes(text) ||
                permission.ds_name.toLowerCase().includes(text)
            );
        });
    }, [data, filters]);

    // Paginação client-side.
    const total = filteredPermissions.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedPermissions = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredPermissions.slice(start, start + PER_PAGE);
    }, [filteredPermissions, currentPage]);

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
        const permissions = data ?? [];

        return [
            {
                title: "Total",
                value: permissions.length,
                icon: KeyRound,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
        ];
    }, [data]);

    function handleFilterText(text: string) {
        setFilters({ text });
        setPage(1);
    }

    function handleEdit(permission: Permission) {
        setSelectedPermission(permission);
        setOpenEditModal(true);
        /* TODO: abrir modal de edição de permissão */
    }

    function handleCreate() {
        setOpenCreateModal(true);
        /* TODO: abrir modal de criação de permissão */
    }

    return (
        <>
            <HeaderPage
                title="Permissões"
                description="Catálogo de permissões disponíveis no sistema para composição de roles."
                icon={KeyRound}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Permissões</BreadcrumbPage>
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
                            Nova permissão
                        </Button>
                    </Can>
                </div>

                <TableComponentV2
                    data={paginatedPermissions}
                    columns={columns}
                    registerName="Permissões"
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
                                placeholder="Buscar por chave ou nome..."
                                value={filters.text}
                                onChange={(e) => handleFilterText(e.target.value)}
                                className="sm:max-w-xs"
                            />
                        </div>
                    }
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(permission) => (
                        <Can permission="rbac.manage">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <MoreHorizontalIcon />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-fit">
                                    <DropdownMenuItem onClick={() => handleEdit(permission)}>
                                        <Edit /> Editar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Can>
                    )}
                />
            </div>

            {/* TODO: modais de criação e edição de permissão.
          Estados prontos: setSelectedPermission / setOpenCreateModal / setOpenEditModal. */}
        </>
    );
}