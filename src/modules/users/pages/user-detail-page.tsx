import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    CheckCircle,
    Clock,
    Edit,
    KeyRound,
    Link2,
    Network,
    RefreshCw,
    Shield,
    Unlink,
    User as UserIcon,
    XCircle,
} from "lucide-react";
import { HeaderPage } from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useFetchUsers, type User } from "../hooks/use-fetch-users";
import { useFetchRoles, type Role } from "@/modules/rbac/hooks/use-fetch-roles";
import { useAssignRoleToUser } from "@/modules/rbac/hooks/use-assign-role-to-user";
import { useRemoveRoleFromUser } from "@/modules/rbac/hooks/use-remove-role-from-user";
import { Can } from "@/modules/auth/components/can";
import { EditUserModal } from "../components/edit-user-modal";
import { ChangePasswordModal } from "../components/change-password-modal";

// Formata datas ou retorna "---" quando ausente.
function formatDate(value?: string): string {
    if (!value) return "---";
    return format(new Date(value), "dd/MM/yyyy");
}

// Extrai iniciais do nome para o Avatar.
function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

// Campo rótulo/valor reutilizável no grid de dados.
function InfoField({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
            </span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function UserDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Limitação: o backend não expõe GET /users/:id.
    // Idealmente existiria um endpoint dedicado; por ora buscamos a lista e localizamos por cd_id.
    const {
        data: users,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
        refetch: refetchUsers,
    } = useFetchUsers();

    // Roles disponíveis no sistema.
    // Limitação: não há endpoint que retorne as roles JÁ atribuídas ao usuário,
    // portanto não conseguimos marcar vínculo atual (atribuído/não atribuído).
    const {
        data: roles,
        isLoading: isLoadingRoles,
        isError: isErrorRoles,
        refetch: refetchRoles,
    } = useFetchRoles();

    const assignRole = useAssignRoleToUser();
    const removeRole = useRemoveRoleFromUser();

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const user = useMemo<User | undefined>(
        () => (users ?? []).find((item) => String(item.cd_id) === String(id)),
        [users, id],
    );

    const availableRoles = useMemo<Role[]>(() => roles ?? [], [roles]);

    async function handleAssign(role: Role) {
        if (!user) return;
        try {
            await assignRole.mutateAsync({
                userId: user.cd_id,
                cd_role: role.cd_id,
            });
        } catch (error) {
            // TODO: substituir por toast (sonner)
            console.error("Erro ao atribuir role:", error);
        }
    }

    async function handleRemove(role: Role) {
        if (!user) return;
        try {
            await removeRole.mutateAsync({
                userId: user.cd_id,
                roleId: role.cd_id,
            });
        } catch (error) {
            // TODO: substituir por toast (sonner)
            console.error("Erro ao remover role:", error);
        }
    }

    return (
        <>
            <HeaderPage
                title={user?.ds_name ?? "Detalhes do usuário"}
                description="Informações e acessos do usuário."
                icon={UserIcon}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/usuarios">Usuários</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {user?.ds_name ?? "Detalhes"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8 pt-8">
                {/* Estado: carregando usuário */}
                {isLoadingUsers && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="size-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Estado: erro ao carregar usuários */}
                {!isLoadingUsers && isErrorUsers && (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                            <XCircle className="size-10 text-red-500" />
                            <div className="space-y-1">
                                <p className="font-medium">
                                    Não foi possível carregar o usuário.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Ocorreu um erro ao buscar os dados.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => refetchUsers()}>
                                <RefreshCw className="size-4" />
                                Tentar novamente
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Estado: usuário não encontrado após o carregamento */}
                {!isLoadingUsers && !isErrorUsers && !user && (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                            <UserIcon className="size-10 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="font-medium">Usuário não encontrado.</p>
                                <p className="text-sm text-muted-foreground">
                                    O usuário solicitado não existe ou foi removido.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => navigate("/usuarios")}>
                                <ArrowLeft className="size-4" />
                                Voltar
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Conteúdo principal quando o usuário existe */}
                {!isLoadingUsers && !isErrorUsers && user && (
                    <>
                        {/* Card: Dados do usuário */}
                        <Card className="w-full gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-6 text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-border/80">
                            <CardHeader className="p-0 flex w-full justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-16">
                                        <AvatarImage src={user.ds_avatar_url} alt={user.ds_name} />
                                        <AvatarFallback>{getInitials(user.ds_name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex gap-3 items-center">
                                            <span className="text-xl font-bold">{user.ds_name}</span>
                                            <div>
                                                <Badge className="border border-border bg-transparent text-primary-text/10">
                                                    {user.fl_active ? (
                                                        <>
                                                            <CheckCircle className="size-3.5 text-emerald-500" />
                                                            <span className="text-emerald-600">Ativo</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="size-3.5 text-red-500" />
                                                            <span className="text-red-600">Inativo</span>
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {user.ds_email}
                                        </span>
                                    </div>
                                </div>
                                {user && (
                                    <Can permission="users.manage">
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setOpenEditModal(true)}>
                                                <Edit className="size-4" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setOpenPasswordModal(true)}
                                            >
                                                <KeyRound className="size-4" />
                                                Alterar senha
                                            </Button>
                                        </div>
                                    </Can>
                                )}
                            </CardHeader>
                            <CardContent className="p-0 pt-4">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <InfoField
                                        icon={BadgeCheck}
                                        label="Cargo"
                                        value={user.ds_role_description ?? "---"}
                                    />
                                    <InfoField
                                        icon={Network}
                                        label="Nome na VPN"
                                        value={user.ds_vpn_name ?? "---"}
                                    />
                                    <InfoField
                                        icon={CalendarDays}
                                        label="Criado em"
                                        value={formatDate(user.dt_created_at)}
                                    />
                                    <InfoField
                                        icon={CalendarDays}
                                        label="Atualizado em"
                                        value={formatDate(user.dt_updated_at)}
                                    />
                                    <InfoField
                                        icon={Clock}
                                        label="Último acesso"
                                        value={formatDate(user.dt_last_login)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="w-full gap-0 overflow-hidden rounded-sm border border-border/10 bg-(image:--background-gradient) p-6 text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-border/80">
                            <CardHeader className="p-0 flex gap-3 items-center">
                                <div className="p-2 border border-border rounded-sm">
                                    <Shield className="size-8 text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Perfis
                                    </CardTitle>
                                    <CardDescription>
                                        Atribua ou remova papéis de acesso deste usuário.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 pt-6 space-y-2">
                                <div>
                                    <span className="text-sm text-primary">Papeis atuais (Ativo)</span>
                                </div>
                                {user.roles.map((role) => (
                                    <div key={role.cd_id} className="flex flex-wrap items-center border border-border justify-between gap-4 px-4 rounded-sm py-3 first:pt-0 last:pb-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{role.ds_name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {role.ds_description ?? "---"}
                                            </span>
                                        </div>
                                        <Can permission="rbac.assign">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500"
                                                    disabled={removeRole.isPending}
                                                    onClick={() => handleRemove(role)}
                                                >
                                                    <Unlink className="size-4" />
                                                    Remover
                                                </Button>
                                            </div>
                                        </Can>
                                    </div>
                                ))}
                                <div>
                                    <span className="text-sm text-muted-foreground">Outros papéis disponíveis</span>
                                </div>
                                {/* Carregando roles */}
                                {isLoadingRoles && (
                                    <ul className="space-y-3">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between gap-4"
                                            >
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-56" />
                                                </div>
                                                <Skeleton className="h-8 w-40" />
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Erro ao carregar roles */}
                                {!isLoadingRoles && isErrorRoles && (
                                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                                        <XCircle className="size-8 text-red-500" />
                                        <p className="text-sm text-muted-foreground">
                                            Não foi possível carregar os papéis.
                                        </p>
                                        <Button variant="outline" onClick={() => refetchRoles()}>
                                            <RefreshCw className="size-4" />
                                            Tentar novamente
                                        </Button>
                                    </div>
                                )}

                                {/* Empty state */}
                                {!isLoadingRoles &&
                                    !isErrorRoles &&
                                    availableRoles.length === 0 && (
                                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                                            <Shield className="size-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Nenhum papel disponível.
                                            </p>
                                        </div>
                                    )}

                                {!isLoadingRoles &&
                                    !isErrorRoles &&
                                    availableRoles.length > 0 && (
                                        <ul className="divide-y divide-border">
                                            {availableRoles.map((role) => {
                                                const hasRole = user.roles?.some(
                                                    (userRole) => userRole.cd_id === role.cd_id
                                                );

                                                // Usuário já possui esse role
                                                if (hasRole) {
                                                    return null;
                                                }

                                                // Usuário ainda não possui esse role
                                                return (
                                                    <li
                                                        key={role.cd_id}
                                                        className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {role.ds_name}
                                                            </span>

                                                            <span className="text-sm text-muted-foreground">
                                                                {role.ds_description ?? "---"}
                                                            </span>
                                                        </div>

                                                        <Can permission="rbac.assign">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={assignRole.isPending}
                                                                    onClick={() => handleAssign(role)}
                                                                >
                                                                    <Link2 className="size-4" />
                                                                    Atribuir
                                                                </Button>
                                                            </div>
                                                        </Can>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Modais controlados — recebem o usuário encontrado (ou null) */}
            <EditUserModal
                open={openEditModal}
                onOpenChange={setOpenEditModal}
                user={user ?? null}
            />
            <ChangePasswordModal
                open={openPasswordModal}
                onOpenChange={setOpenPasswordModal}
                user={user ?? null}
            />
        </>
    );
}