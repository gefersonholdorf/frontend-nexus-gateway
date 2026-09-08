import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatLastLogin } from "@/lib/format-last-login";
import { formatDate } from "date-fns";
import {
    Calendar,
    KeyRound,
    Mail,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Shield,
    Trash2,
    UserCheck,
    User as UserIcon,
    Users
} from "lucide-react";
import { useMemo, useState } from "react";

import { Can } from "@/modules/auth/components/can";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeUserPasswordModal } from "../components/change-user-password-modal";
import { StatusDot } from "../components/core-status-dot";
import { CreateUserModal } from "../components/create-user-modal";
import { DeleteUserModal } from "../components/delete-user-modal";
import { EditUserModal } from "../components/edit-user-modal";
import { InactiveUserModal } from "../components/inactive-user-modal";
import { UserRolesDrawer } from "../components/user-roles-drawer";
import { useFetchRoles } from "../hooks/use-fetch-roles";
import { useFetchUsers, type CoreUser } from "../hooks/use-fetch-users";
import { useToggleUserStatus } from "../hooks/use-toggle-user-status";

type StatusFilter = "all" | "active" | "inactive";

interface Filters {
    ds_name: string;
    ds_email: string;
    status: StatusFilter;
}

const PAGE_SIZE = 8;

export function CoreUsersPage() {
    const { data: users, isLoading, isError, refetch } = useFetchUsers();
    const { data: roles } = useFetchRoles();
    const { mutate: toggleStatus } = useToggleUserStatus();

    const [filters, setFilters] = useState<Filters>({
        ds_name: "",
        ds_email: "",
        status: "all",
    });
    const [page, setPage] = useState(1);

    const [createOpen, setCreateOpen] = useState(false);
    const [editUser, setEditUser] = useState<CoreUser | null>(null);
    const [inactiveUser, setInactiveUser] = useState<CoreUser | null>(null);
    const [deleteUser, setDeleteUser] = useState<CoreUser | null>(null);
    const [rolesUserId, setRolesUserId] = useState<number | null>(null);
    const [passwordUser, setPasswordUser] = useState<CoreUser | null>(null);

    const allUsers = useMemo(() => users ?? [], [users]);

    // Deriva o usuário do drawer "Gerenciar roles" a partir da lista sempre
    // atualizada (em vez de um snapshot capturado no clique) — assim, quando
    // assign/unassign de role invalida `users.all()` e a lista é refeita, o
    // drawer aberto reflete o vínculo atual sem precisar fechar/reabrir.
    const rolesUser = useMemo(
        () => allUsers.find((user) => user.cd_id === rolesUserId) ?? null,
        [allUsers, rolesUserId],
    );

    // Filtros client-side (RF006): nome, e-mail e status — aceitável, pois é mock em memória.
    const filteredUsers = useMemo(() => {
        const name = filters.ds_name.trim().toLowerCase();
        const email = filters.ds_email.trim().toLowerCase();

        return allUsers.filter((user) => {
            const matchesName = name === "" || user.ds_name.toLowerCase().includes(name);
            const matchesEmail = email === "" || user.ds_email.toLowerCase().includes(email);
            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" ? user.fl_active : !user.fl_active);

            return matchesName && matchesEmail && matchesStatus;
        });
    }, [allUsers, filters]);

    const totalItems = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pagedUsers = useMemo(
        () => filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredUsers, currentPage],
    );

    const pagination = {
        page: currentPage,
        perPage: PAGE_SIZE,
        total: totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    // KPIs (RF005) refletem a base completa de usuários, não a página filtrada.
    const summarys = useMemo(
        () => [
            {
                title: "Total de usuários",
                value: allUsers.length,
                icon: Users,
                colorText: "text-core-signal",
                borderColor: "hover:border-core-signal",
            },
            {
                title: "Ativos",
                value: allUsers.filter((user) => user.fl_active).length,
                icon: UserCheck,
                colorText: "text-core-ok",
                borderColor: "hover:border-core-ok",
            },
            {
                title: "Inativos",
                value: allUsers.filter((user) => !user.fl_active).length,
                icon: UserIcon,
                colorText: "text-core-neutral",
                borderColor: "hover:border-core-neutral",
            },
        ],
        [allUsers],
    );

    function handleFilterChange<K extends keyof Filters>(key: K, value: Filters[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    }

    function handleActivate(user: CoreUser) {
        toggleStatus({ cd_id: user.cd_id, fl_active: true });
    }

    const columns: Column<CoreUser>[] = [
        {
            key: "cd_id",
            title: "Usuário",
            icon: UserIcon,
            render: (_, row) => {
                if (!row) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            ---
                        </span>
                    );
                }

                const initials = row.ds_name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase();

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex max-w-35 items-center gap-2 min-w-0">
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarImage
                                        src={row.ds_avatar_url ?? ""}
                                        alt={row.ds_name}
                                    />

                                    <AvatarFallback className="bg-primary/90 text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col min-w-0">
                                    <span className="truncate font-medium">
                                        {row.ds_name}
                                    </span>

                                    {row.ds_role_description && (
                                        <span className="truncate text-[.8rem] text-muted-foreground">
                                            {row.ds_role_description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </TooltipTrigger>

                        <TooltipContent>
                            <div className="flex flex-col">
                                <span className="font-medium">{row.ds_name}</span>

                                {row.ds_role_description && (
                                    <span className="text-xs">
                                        {row.ds_role_description}
                                    </span>
                                )}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )
            }
        },
        {
            key: "ds_email",
            title: "E-mail",
            icon: Mail,
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
            key: "dt_created_at",
            title: "Data de criação",
            icon: Calendar,
            render: (value) => <span>{formatDate(value as string, "dd/MM/yyyy")}</span>,
        },
        {
            key: "dt_last_login",
            title: "Último Login",
            icon: Calendar,
            render: (value) => (
                <span className="text-sm">
                    {value ? formatLastLogin(value as string) : "---"}
                </span>
            ),
        },
        {
            key: "qt_roles",
            title: "Perfis Vinculados",
            render: (_, row) => {
                const totalRoles = roles?.length ?? 0;
                const percentage = totalRoles > 0 ? (row.qt_roles / totalRoles) * 100 : 0;

                return (
                    <div className="flex w-32 flex-col gap-1">
                        <span className="text-sm">
                            {row.qt_roles}/{totalRoles}
                        </span>
                        <Progress value={percentage} />
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <HeaderPage
                title="Usuários"
                description="Cadastro, status e vínculo de roles dos usuários do sistema."
                icon={Users}
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
                                <BreadcrumbPage>Usuários</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    // Criação de usuário é ação administrativa (RF008), gated por users.manage.
                    <Can permission="users.manage" fallback={null}>
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Novo usuário
                        </Button>
                    </Can>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={pagedUsers}
                    columns={columns}
                    registerName="Usuários"
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

                            <Input
                                placeholder="Buscar por e-mail"
                                value={filters.ds_email}
                                onChange={(e) => handleFilterChange("ds_email", e.target.value)}
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
                    actions={(user) => (
                        // Todas as ações de escrita sobre usuário exigem users.manage (RF008/RF009).
                        <Can permission="users.manage" fallback={null}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setRolesUserId(user.cd_id)}
                                    >
                                        <Shield className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Gerenciar roles</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setEditUser(user)}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar usuário</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setPasswordUser(user)}
                                    >
                                        <KeyRound className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Alterar senha</TooltipContent>
                            </Tooltip>

                            {user.fl_active ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => setInactiveUser(user)}
                                        >
                                            <PowerOff className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Inativar usuário</TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => handleActivate(user)}
                                        >
                                            <Power className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ativar usuário</TooltipContent>
                                </Tooltip>
                            )}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-core-fail hover:text-core-fail"
                                        onClick={() => setDeleteUser(user)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Excluir usuário</TooltipContent>
                            </Tooltip>
                        </Can>
                    )}
                />
            </div>

            <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

            <EditUserModal
                open={Boolean(editUser)}
                onOpenChange={(next) => !next && setEditUser(null)}
                user={editUser}
            />

            <InactiveUserModal
                open={Boolean(inactiveUser)}
                onOpenChange={(next) => !next && setInactiveUser(null)}
                user={inactiveUser}
            />

            <DeleteUserModal
                open={Boolean(deleteUser)}
                onOpenChange={(next) => !next && setDeleteUser(null)}
                user={deleteUser}
            />

            <UserRolesDrawer
                open={Boolean(rolesUser)}
                onOpenChange={(next) => !next && setRolesUserId(null)}
                user={rolesUser}
            />

            <ChangeUserPasswordModal
                open={Boolean(passwordUser)}
                onOpenChange={(next) => !next && setPasswordUser(null)}
                user={passwordUser}
            />
        </>
    );
}
