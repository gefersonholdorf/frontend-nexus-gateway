import { formatDate } from "date-fns";
import { KeyRound, Loader2, Shield } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useHasPermission } from "@/modules/providers/permission-provider";

import { useAssignPermissionToRole } from "../hooks/use-assign-permission-to-role";
import { useFetchPermissions, type CorePermission } from "../hooks/use-fetch-permissions";
import { useFetchRoleById } from "../hooks/use-fetch-role-by-id";
import type { CoreRole } from "../hooks/use-fetch-roles";
import { useUnassignPermissionFromRole } from "../hooks/use-unassign-permission-from-role";
import { MonoValue } from "./core-mono-value";
import { StatusDot } from "./core-status-dot";

interface RolePermissionsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: CoreRole | null;
}

/**
 * Extrai o domínio de uma chave de permissão (prefixo antes do primeiro `.`),
 * usado para agrupar o catálogo por domínio dentro do `Accordion` (RF014).
 */
function getPermissionDomain(ds_key: string): string {
    const [domain] = ds_key.split(".");
    return domain || ds_key;
}

function groupPermissionsByDomain(
    permissions: CorePermission[],
): Map<string, CorePermission[]> {
    const groups = new Map<string, CorePermission[]>();

    permissions.forEach((permission) => {
        const domain = getPermissionDomain(permission.ds_key);
        const group = groups.get(domain) ?? [];
        group.push(permission);
        groups.set(domain, group);
    });

    return groups;
}

/**
 * "Página de detalhe" da role (RF012) e atribuição/remoção de permissões
 * (RF014) — como não existe rota `/core/roles/:id`, ambos são resolvidos
 * aqui, num `Drawer` aberto a partir da linha da tabela. Permissões são
 * agrupadas por domínio (prefixo de `ds_key`) em `Accordion` + `Checkbox`.
 */
export function RolePermissionsDrawer({ open, onOpenChange, role }: RolePermissionsDrawerProps) {
    const { data: permissions, isLoading: isLoadingPermissions } = useFetchPermissions();
    // Refetch pontual da role (RF015/RF018) para manter os checkboxes em
    // sincronia com o servidor enquanto o drawer permanece aberto — ver
    // JSDoc de `useFetchRoleById`. Enquanto `roleDetail` não chega (ou falha),
    // `effectiveRole` cai no snapshot da listagem (`role`, via props) para não
    // deixar os checkboxes sem estado.
    const { data: roleDetail, isLoading: isLoadingRoleDetail } = useFetchRoleById(role?.cd_id);
    const isLoading = isLoadingPermissions || isLoadingRoleDetail;
    const effectiveRole = roleDetail ?? role ?? undefined;
    const { mutate: assignPermission, isPending: isAssigning } = useAssignPermissionToRole();
    const { mutate: unassignPermission, isPending: isUnassigning } =
        useUnassignPermissionFromRole();
    const navigate = useNavigate();

    // Atribuir/remover permissão exige rbac.assign (RF014) — desabilita os
    // checkboxes quando o perfil mockado atual não tem essa permissão.
    const canAssign = useHasPermission("rbac.assign");

    const isMutating = isAssigning || isUnassigning;

    const groupedPermissions = useMemo(
        () => groupPermissionsByDomain(permissions ?? []),
        [permissions],
    );

    const domains = useMemo(() => Array.from(groupedPermissions.keys()), [groupedPermissions]);

    function handleTogglePermission(permissionId: number, checked: boolean) {
        if (!role) {
            return;
        }

        if (checked) {
            assignPermission({ cd_role: role.cd_id, cd_permission: permissionId });
        } else {
            unassignPermission({ cd_role: role.cd_id, cd_permission: permissionId });
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-full flex-col">
                <DrawerHeader className="border-b border-border/60 text-left">
                    <DrawerTitle className="flex items-center gap-2">
                        <Shield className="size-4 text-core-signal" aria-hidden="true" />
                        Permissões de {role?.ds_name ?? "role"}
                    </DrawerTitle>
                    <DrawerDescription>
                        Atribua ou remova permissões do catálogo fixo desta role. Alterações são
                        aplicadas imediatamente.
                    </DrawerDescription>

                    {effectiveRole && (
                        <div className="mt-3 grid grid-cols-1 gap-1.5 rounded-md border border-border/60 bg-muted/30 p-3 text-xs sm:grid-cols-2">
                            <span className="text-muted-foreground">
                                Descrição:{" "}
                                <span className="text-foreground">
                                    {effectiveRole.ds_description}
                                </span>
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                Status:{" "}
                                {effectiveRole.st_status === "ACTIVE" ? (
                                    <StatusDot tone="ok" label="Ativo" />
                                ) : (
                                    <StatusDot tone="off" label="Inativo" />
                                )}
                            </span>
                            <span className="text-muted-foreground">
                                Criada em:{" "}
                                <span className="text-foreground">
                                    {formatDate(effectiveRole.dt_created_at, "dd/MM/yyyy")}
                                </span>
                            </span>
                            <span className="text-muted-foreground">
                                Permissões vinculadas:{" "}
                                <span className="text-foreground">
                                    {(effectiveRole.cd_permissions ?? []).length}
                                </span>
                            </span>
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 w-fit"
                        onClick={() => navigate("/core/permissions")}
                    >
                        <KeyRound className="size-4" />
                        Ver catálogo de permissões
                    </Button>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                        </div>
                    ) : (
                        <Accordion type="multiple" defaultValue={domains}>
                            {domains.map((domain) => {
                                const domainPermissions = groupedPermissions.get(domain) ?? [];
                                const assignedCount = domainPermissions.filter((permission) =>
                                    effectiveRole?.cd_permissions?.includes(permission.cd_id),
                                ).length;

                                return (
                                    <AccordionItem key={domain} value={domain}>
                                        <AccordionTrigger>
                                            <span className="flex items-center gap-2">
                                                <span className="font-medium capitalize text-foreground">
                                                    {domain}
                                                </span>
                                                <Badge variant="outline">
                                                    {assignedCount}/{domainPermissions.length}
                                                </Badge>
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2">
                                                {domainPermissions.map((permission) => {
                                                    const checked = Boolean(
                                                        effectiveRole?.cd_permissions?.includes(
                                                            permission.cd_id,
                                                        ),
                                                    );

                                                    return (
                                                        <li
                                                            key={permission.cd_id}
                                                            className="flex items-start gap-3 rounded-md border border-border/60 p-3"
                                                        >
                                                            <Checkbox
                                                                checked={checked}
                                                                disabled={
                                                                    !role ||
                                                                    isMutating ||
                                                                    !canAssign
                                                                }
                                                                onCheckedChange={(value) =>
                                                                    handleTogglePermission(
                                                                        permission.cd_id,
                                                                        Boolean(value),
                                                                    )
                                                                }
                                                                className="mt-0.5"
                                                                aria-label={`Vincular permissão ${permission.ds_name}`}
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-sm font-medium text-foreground">
                                                                        {permission.ds_name}
                                                                    </span>
                                                                    <MonoValue>
                                                                        {permission.ds_key}
                                                                    </MonoValue>
                                                                </div>
                                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                                    {permission.ds_description}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}

                            {domains.length === 0 && (
                                <p className="py-10 text-center text-sm text-muted-foreground">
                                    Nenhuma permissão cadastrada no catálogo.
                                </p>
                            )}
                        </Accordion>
                    )}
                </div>

                <DrawerFooter className="border-t border-border/60">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
