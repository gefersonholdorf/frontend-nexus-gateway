import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
    KeyRound,
    KeySquare,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Shield,
    ShieldCheck,
    ShieldOff,
    Text,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Can } from "@/modules/auth/components/can";

import { CreateRoleModal } from "../components/create-role-modal";
import { StatusDot } from "../components/core-status-dot";
import { DeleteRoleModal } from "../components/delete-role-modal";
import { EditRoleModal } from "../components/edit-role-modal";
import { InactiveRoleModal } from "../components/inactive-role-modal";
import { RolePermissionsDrawer } from "../components/role-permissions-drawer";
import { useFetchPermissions } from "../hooks/use-fetch-permissions";
import { useFetchRoles } from "../hooks/use-fetch-roles";
import { useToggleRoleStatus } from "../hooks/use-toggle-role-status";
import type { CoreRole } from "../mocks/roles.mock";

type StatusFilter = "all" | "active" | "inactive";

interface Filters {
    ds_name: string;
    status: StatusFilter;
}

const PAGE_SIZE = 8;

export function CoreRolesPage() {
    const { data: roles, isLoading, isError, refetch } = useFetchRoles();
    const { data: permissions } = useFetchPermissions();
    const { mutate: toggleStatus } = useToggleRoleStatus();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<Filters>({ ds_name: "", status: "all" });
    const [page, setPage] = useState(1);

    const [createOpen, setCreateOpen] = useState(false);
    const [editRole, setEditRole] = useState<CoreRole | null>(null);
    const [inactiveRole, setInactiveRole] = useState<CoreRole | null>(null);
    const [deleteRole, setDeleteRole] = useState<CoreRole | null>(null);
    const [permissionsRole, setPermissionsRole] = useState<CoreRole | null>(null);

    const permissionNameById = useMemo(() => {
        const map = new Map<number, string>();
        (permissions ?? []).forEach((permission) => map.set(permission.cd_id, permission.ds_name));
        return map;
    }, [permissions]);

    const allRoles = useMemo(() => roles ?? [], [roles]);

    // Filtros client-side (RF011): nome e status — aceitável, pois é mock em memória.
    const filteredRoles = useMemo(() => {
        const name = filters.ds_name.trim().toLowerCase();

        return allRoles.filter((role) => {
            const matchesName = name === "" || role.ds_name.toLowerCase().includes(name);
            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" ? role.fl_active : !role.fl_active);

            return matchesName && matchesStatus;
        });
    }, [allRoles, filters]);

    const totalItems = filteredRoles.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pagedRoles = useMemo(
        () => filteredRoles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredRoles, currentPage],
    );

    const pagination = {
        page: currentPage,
        perPage: PAGE_SIZE,
        total: totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    // KPIs refletem a base completa de roles, não a página filtrada.
    const summarys = useMemo(
        () => [
            {
                title: "Total de roles",
                value: allRoles.length,
                icon: Shield,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Ativas",
                value: allRoles.filter((role) => role.fl_active).length,
                icon: ShieldCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Inativas",
                value: allRoles.filter((role) => !role.fl_active).length,
                icon: ShieldOff,
                colorText: "text-core-neutral",
                borderColor: "hover:border-core-neutral",
            },
        ],
        [allRoles],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function handleActivate(role: CoreRole) {
        toggleStatus({ cd_id: role.cd_id, fl_active: true });
    }

    const columns: Column<CoreRole>[] = [
        {
            key: "ds_name",
            title: "Nome",
            icon: Shield,
        },
        {
            key: "ds_description",
            title: "Descrição",
            icon: Text,
        },
        {
            key: "fl_active",
            title: "Status",
            render: (value) =>
                value ? (
                    <StatusDot tone="ok" label="Ativo" />
                ) : (
                    <StatusDot tone="off" label="Inativo" />
                ),
        },
        {
            key: "cd_permissions",
            title: "Permissões",
            render: (value) => {
                const permissionIds = (value as number[]) ?? [];

                if (permissionIds.length === 0) {
                    return <span className="text-sm text-muted-foreground">Nenhuma</span>;
                }

                return (
                    <div className="flex flex-wrap gap-1">
                        {permissionIds.map((permissionId) => (
                            <Badge key={permissionId} variant="outline">
                                {permissionNameById.get(permissionId) ?? `#${permissionId}`}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <HeaderPage
                title="Roles"
                description="Perfis de acesso e atribuição de permissões do catálogo fixo. Dados mockados, sem persistência real."
                icon={Shield}
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
                                <BreadcrumbPage>Roles</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/core/permissions")}
                        >
                            <KeyRound className="size-4" />
                            Ver catálogo de permissões
                        </Button>
                        {/* Criação de role é CRUD (RF010), gated por rbac.manage. */}
                        <Can permission="rbac.manage" fallback={null}>
                            <Button size="sm" onClick={() => setCreateOpen(true)}>
                                <Plus className="size-4" />
                                Nova role
                            </Button>
                        </Can>
                    </div>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={pagedRoles}
                    columns={columns}
                    registerName="Roles"
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
                                placeholder="Buscar por nome"
                                value={filters.ds_name}
                                onChange={(e) => handleFilterChange("ds_name", e.target.value)}
                                className="lg:max-w-xs"
                            />

                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    handleFilterChange("status", value as StatusFilter)
                                }
                            >
                                <SelectTrigger className="lg:w-44">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    actions={(role) => (
                        <>
                            {/* Atribuir/remover permissões da role (RF014) exige rbac.assign,
                                separado do CRUD de role em si. */}
                            <Can permission="rbac.assign" fallback={null}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => setPermissionsRole(role)}
                                        >
                                            <KeySquare className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Gerenciar permissões</TooltipContent>
                                </Tooltip>
                            </Can>

                            {/* Editar/ativar/inativar/excluir role é CRUD (RF010), gated por rbac.manage. */}
                            <Can permission="rbac.manage" fallback={null}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => setEditRole(role)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar role</TooltipContent>
                                </Tooltip>

                                {role.fl_active ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => setInactiveRole(role)}
                                            >
                                                <PowerOff className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Inativar role</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() => handleActivate(role)}
                                            >
                                                <Power className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Ativar role</TooltipContent>
                                    </Tooltip>
                                )}

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-core-fail hover:text-core-fail"
                                            onClick={() => setDeleteRole(role)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Excluir role</TooltipContent>
                                </Tooltip>
                            </Can>
                        </>
                    )}
                />
            </div>

            <CreateRoleModal open={createOpen} onOpenChange={setCreateOpen} />

            <EditRoleModal
                open={Boolean(editRole)}
                onOpenChange={(next) => !next && setEditRole(null)}
                role={editRole}
            />

            <InactiveRoleModal
                open={Boolean(inactiveRole)}
                onOpenChange={(next) => !next && setInactiveRole(null)}
                role={inactiveRole}
            />

            <DeleteRoleModal
                open={Boolean(deleteRole)}
                onOpenChange={(next) => !next && setDeleteRole(null)}
                role={deleteRole}
            />

            <RolePermissionsDrawer
                open={Boolean(permissionsRole)}
                onOpenChange={(next) => !next && setPermissionsRole(null)}
                role={permissionsRole}
            />
        </>
    );
}
