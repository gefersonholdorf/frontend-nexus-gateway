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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Can } from "@/modules/auth/components/can";
import { useFetchPermissions, type Permission } from "@/modules/rbac/hooks/use-fetch-permissions";
import { useFetchRoles, type Role } from "@/modules/rbac/hooks/use-fetch-roles";
import { formatDate } from "date-fns";
import {
    CalendarDays,
    CheckCircle,
    Hash,
    KeyRound,
    Link2,
    Plus,
    Shield,
    Unlink,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

// Considera a role ativa quando o status é "ATIVO" ou "ACTIVE".
function isRoleActive(status?: string): boolean {
    const normalized = status?.toUpperCase();
    return normalized === "ATIVO" || normalized === "ACTIVE";
}

export function RoleDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const roleId = Number(id);

    const [permissionFilter, setPermissionFilter] = useState("");

    const {
        data: roles,
        isLoading: isLoadingRoles,
        isError: isErrorRoles,
    } = useFetchRoles();

    const {
        data: permissions,
        isLoading: isLoadingPermissions,
    } = useFetchPermissions();

    // Localiza a role pelo id da URL.
    const role: Role | undefined = useMemo(
        () => (roles ?? []).find((r) => r.cd_id === roleId),
        [roles, roleId],
    );

    // Filtro client-side das permissões disponíveis.
    const filteredPermissions = useMemo(() => {
        const list = permissions ?? [];
        const text = permissionFilter.trim().toLowerCase();

        return list.filter((permission) => {
            if (text.length === 0) return true;
            return (
                permission.ds_key.toLowerCase().includes(text) ||
                permission.ds_name.toLowerCase().includes(text)
            );
        });
    }, [permissions, permissionFilter]);

    // ATENÇÃO: o backend NÃO retorna as permissões vinculadas à role atual.
    // Por isso, não é possível marcar "vinculada/desvinculada" de forma segura.
    // Os handlers abaixo ficam como TODO até termos essa informação.
    function handleAssignPermission(permission: Permission) {
        /* TODO: chamar use-assign-permission-to-role com { roleId, permissionId: permission.cd_id } */
    }

    function handleRemovePermission(permission: Permission) {
        /* TODO: chamar use-remove-permission-from-role com { roleId, permissionId: permission.cd_id } */
    }

    return (
        <>
            <HeaderPage
                title={role?.ds_name ?? "Detalhes da role"}
                description="Visualize os dados da role e gerencie as permissões vinculadas."
                icon={Shield}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/roles">Roles</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{role?.ds_name ?? "---"}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Card de dados da role */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="size-5 text-primary" />
                            Dados da role
                        </CardTitle>
                        <CardDescription>Informações gerais do papel de acesso.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {isLoadingRoles ? (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-4 w-96" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        ) : isErrorRoles || !role ? (
                            <div className="flex flex-col items-start gap-3">
                                <span className="text-sm text-muted-foreground">
                                    {isErrorRoles
                                        ? "Não foi possível carregar a role."
                                        : "Role não encontrada."}
                                </span>
                                <Button variant="outline" onClick={() => navigate("/roles")}>
                                    Voltar para Roles
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Nome</span>
                                    <span className="font-medium">{role.ds_name}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <div className="mt-1 flex items-center gap-1">
                                        {isRoleActive(role.st_status) ? (
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
                                </div>

                                <div className="flex flex-col sm:col-span-2">
                                    <span className="text-xs text-muted-foreground">Descrição</span>
                                    <span>{role.ds_description ?? "---"}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Criada em</span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="size-4 text-muted-foreground" />
                                        {role.dt_created_at
                                            ? formatDate(role.dt_created_at.toString(), "dd/MM/yyyy")
                                            : "---"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Seção de permissões disponíveis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="size-5 text-primary" />
                            Permissões
                        </CardTitle>
                        <CardDescription>
                            Permissões disponíveis no sistema para vincular a esta role.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Buscar por chave ou nome..."
                            value={permissionFilter}
                            onChange={(e) => setPermissionFilter(e.target.value)}
                            className="sm:max-w-xs"
                        />

                        {isLoadingPermissions ? (
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={index} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : filteredPermissions.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-center">
                                <KeyRound className="size-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Nenhuma permissão encontrada.
                                </span>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border rounded-md border border-border">
                                {filteredPermissions.map((permission) => (
                                    <li
                                        key={permission.cd_id}
                                        className="flex items-center justify-between gap-4 p-4"
                                    >
                                        <div className="flex min-w-0 flex-col">
                                            <span className="truncate font-medium">
                                                {permission.ds_name}
                                            </span>
                                            <span className="flex items-center gap-2 text-[.8rem] text-muted-foreground">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    <Hash className="mr-1 size-3" />
                                                    {permission.ds_key}
                                                </Badge>
                                                {permission.ds_description ? (
                                                    <span className="truncate">{permission.ds_description}</span>
                                                ) : null}
                                            </span>
                                        </div>

                                        {/* Vincular/desvincular protegido por permissão.
                        Como o backend não informa o vínculo atual, ambos os
                        botões ficam disponíveis (handlers TODO). */}
                                        <Can permission="rbac.manage">
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1"
                                                    onClick={() => handleAssignPermission(permission)}
                                                >
                                                    <Link2 className="size-4" />
                                                    Vincular
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1 text-red-500 hover:text-red-500"
                                                    onClick={() => handleRemovePermission(permission)}
                                                >
                                                    <Unlink className="size-4" />
                                                    Desvincular
                                                </Button>
                                            </div>
                                        </Can>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}