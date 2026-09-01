import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { HeaderPage } from "@/components/header-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "date-fns";
import {
    BadgeCheck,
    CalendarDays,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    KeyRound,
    MoreHorizontalIcon,
    Plus,
    Trash2,
    User as UserIcon,
    Users,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useFetchUsers, type User } from "../hooks/use-fetch-users";

// Gera as iniciais (até 2) a partir do nome, para o fallback do avatar.
function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

const columns: Column<User>[] = [
    {
        key: "ds_name",
        title: "Usuário",
        icon: UserIcon,
        render: (_, row) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex min-w-0 max-w-60 items-center gap-2">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={row.ds_avatar_url ?? ""} alt={row.ds_name} />
                            <AvatarFallback className="bg-primary/90 text-white">
                                {getInitials(row.ds_name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">{row.ds_name}</span>
                            <span className="truncate text-[.8rem] text-muted-foreground">
                                {row.ds_email}
                            </span>
                        </div>
                    </div>
                </TooltipTrigger>

                <TooltipContent>
                    <div className="flex flex-col">
                        <span className="font-medium">{row.ds_name}</span>
                        <span className="text-xs text-muted-foreground">{row.ds_email}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        ),
    },
    {
        key: "ds_role_description",
        title: "Cargo",
        icon: BadgeCheck,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{value.toString()}</span>;
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
                        <span className="text-emerald-500">Ativo</span>
                    </Badge>
                ) : (
                    <Badge className="border border-border bg-transparent text-primary-text/10">
                        <XCircle className="size-4 text-red-500" />
                        <span className="text-red-500">Inativo</span>
                    </Badge>
                )}
            </div>
        ),
    },
    {
        key: "dt_last_login",
        title: "Último acesso",
        icon: Clock,
        render: (value) => {
            if (!value) {
                return <span className="text-sm text-muted-foreground">---</span>;
            }
            return <span>{formatDate(value.toString(), "dd/MM/yyyy")}</span>;
        },
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

// Estado dos filtros client-side.
interface Filters {
    text: string;
    status: "all" | "active" | "inactive";
}

const PER_PAGE = 10;

export function UsersPage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({ text: "", status: "all" });

    // Estados dos modais (ainda não implementados — placeholders/TODO).
    const [, setSelectedUser] = useState<User | null>(null);
    const [, setOpenCreateModal] = useState(false);
    const [, setOpenEditModal] = useState(false);
    const [, setOpenChangePasswordModal] = useState(false);

    const { data, isLoading, isError, refetch } = useFetchUsers();

    // Aplica filtro por texto (nome/email) e por status — client-side,
    // pois o backend atual retorna um array simples sem paginação/filtro.
    const filteredUsers = useMemo(() => {
        const users = data ?? [];
        const text = filters.text.trim().toLowerCase();

        return users.filter((user) => {
            const matchesText =
                text.length === 0 ||
                user.ds_name.toLowerCase().includes(text) ||
                user.ds_email.toLowerCase().includes(text);

            const matchesStatus =
                filters.status === "all" ||
                (filters.status === "active" && user.fl_active) ||
                (filters.status === "inactive" && !user.fl_active);

            return matchesText && matchesStatus;
        });
    }, [data, filters]);

    // Paginação client-side: fatiar o array filtrado por page/perPage.
    const total = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredUsers.slice(start, start + PER_PAGE);
    }, [filteredUsers, currentPage]);

    const pagination = {
        page: currentPage,
        perPage: PER_PAGE,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };

    // Cards de resumo derivados do próprio array (client-side).
    const summarys = useMemo(() => {
        const users = data ?? [];
        const active = users.filter((u) => u.fl_active).length;
        const inactive = users.filter((u) => !u.fl_active).length;

        return [
            {
                title: "Total",
                value: users.length,
                icon: Users,
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

    // Atualiza filtro e reseta a página.
    function handleFilterText(text: string) {
        setFilters((prev) => ({ ...prev, text }));
        setPage(1);
    }

    function handleFilterStatus(status: Filters["status"]) {
        setFilters((prev) => ({ ...prev, status }));
        setPage(1);
    }

    // Handlers de ações — placeholders enquanto os modais não existem.
    function handleEdit(user: User) {
        setSelectedUser(user);
        setOpenEditModal(true);
        /* TODO: abrir modal de edição de usuário */
    }

    function handleChangePassword(user: User) {
        setSelectedUser(user);
        setOpenChangePasswordModal(true);
        /* TODO: abrir modal de alteração de senha */
    }

    function handleDelete(user: User) {
        setSelectedUser(user);
        /* TODO: abrir confirmação de exclusão de usuário */
    }

    function handleCreate() {
        setOpenCreateModal(true);
        /* TODO: abrir modal de criação de usuário */
    }

    return (
        <>
            <HeaderPage
                title="Gestão de Usuários"
                description="Central de usuários, acessos e perfis do sistema. Gerencie cadastros, permissões e status de acesso."
                icon={Users}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Usuários</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Ação de criação — protegida por permissão */}
                <div className="flex justify-end">
                    {/* <Can permission="users.manage"> */}
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="size-4" />
                        Novo usuário
                    </Button>
                    {/* </Can> */}
                </div>

                <TableComponentV2
                    data={paginatedUsers}
                    columns={columns}
                    registerName="Usuários"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    cardsQuantity={{
                        summarys,
                        isLoading,
                    }}
                    filteringComponent={
                        // Filtro simples inline (client-side): busca + status.
                        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                            <Input
                                placeholder="Buscar por nome ou e-mail..."
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
                                    <SelectItem value="active">Ativos</SelectItem>
                                    <SelectItem value="inactive">Inativos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    pagination={pagination}
                    onPageChange={setPage}
                    actions={(user) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-fit">
                                <DropdownMenuItem onClick={() => navigate(`/usuarios/${user.cd_id}`)}>
                                    <Eye /> Ver detalhes
                                </DropdownMenuItem>

                                {/* <Can permission="users.manage"> */}
                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                    <Edit /> Editar
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                                    <KeyRound /> Alterar senha
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => handleDelete(user)}
                                    className="text-red-500 focus:text-red-500"
                                >
                                    <Trash2 /> Excluir
                                </DropdownMenuItem>
                                {/* </Can> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                />
            </div>

            {/* TODO: modais de criação, edição, alteração de senha e exclusão
          serão adicionados quando os componentes existirem. Estados já
          preparados: setSelectedUser / setOpenCreateModal / setOpenEditModal /
          setOpenChangePasswordModal. */}
        </>
    );
}