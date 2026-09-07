import { formatDate } from "date-fns";
import { Loader2, Shield } from "lucide-react";

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

import { useAssignRoleToUser } from "../hooks/use-assign-role-to-user";
import { useFetchRoles } from "../hooks/use-fetch-roles";
import { useUnassignRoleFromUser } from "../hooks/use-unassign-role-from-user";
import type { CoreUser } from "../hooks/use-fetch-users";
import { StatusDot } from "./core-status-dot";

interface UserRolesDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: CoreUser | null;
}

/**
 * "Página de detalhe" do usuário e vínculo/desvínculo de roles (RF014) — como
 * não existe rota `/core/users/:id`, ambos são resolvidos aqui, num `Drawer`
 * aberto a partir da linha da tabela.
 *
 * `useAssignRoleToUser`/`useUnassignRoleFromUser` chamam a API real
 * (`POST`/`DELETE /users/{id}/roles`), mas `useFetchRoles` (lista de roles
 * disponíveis para vincular) ainda é mockado — a entidade Roles é migrada em
 * etapa própria.
 */
export function UserRolesDrawer({ open, onOpenChange, user }: UserRolesDrawerProps) {
    const { data: roles, isLoading } = useFetchRoles();
    const { mutate: assignRole, isPending: isAssigning } = useAssignRoleToUser();
    const { mutate: unassignRole, isPending: isUnassigning } = useUnassignRoleFromUser();

    const isMutating = isAssigning || isUnassigning;

    function handleToggleRole(roleId: number, checked: boolean) {
        if (!user) {
            return;
        }

        if (checked) {
            assignRole({ cd_user: user.cd_id, cd_role: roleId });
        } else {
            unassignRole({ cd_user: user.cd_id, cd_role: roleId });
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="flex h-full flex-col">
                <DrawerHeader className="border-b border-border/60 text-left">
                    <DrawerTitle className="flex items-center gap-2">
                        <Shield className="size-4 text-core-signal" aria-hidden="true" />
                        Roles de {user?.ds_name ?? "usuário"}
                    </DrawerTitle>
                    <DrawerDescription>
                        Vincule ou desvincule roles deste usuário. Alterações são aplicadas
                        imediatamente.
                    </DrawerDescription>

                    {user && (
                        <div className="mt-3 grid grid-cols-1 gap-1.5 rounded-md border border-border/60 bg-muted/30 p-3 text-xs sm:grid-cols-2">
                            <span className="text-muted-foreground">
                                E-mail: <span className="text-foreground">{user.ds_email}</span>
                            </span>
                            <span className="text-muted-foreground">
                                Cargo:{" "}
                                <span className="text-foreground">{user.ds_role_description}</span>
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                                Status:{" "}
                                {user.fl_active ? (
                                    <StatusDot tone="ok" label="Ativo" />
                                ) : (
                                    <StatusDot tone="off" label="Inativo" />
                                )}
                            </span>
                            <span className="text-muted-foreground">
                                Criado em:{" "}
                                <span className="text-foreground">
                                    {formatDate(user.dt_created_at, "dd/MM/yyyy")}
                                </span>
                            </span>
                        </div>
                    )}
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {(roles ?? []).map((role) => {
                                const checked = Boolean(user?.cd_roles.includes(role.cd_id));

                                return (
                                    <li
                                        key={role.cd_id}
                                        className="flex items-start gap-3 rounded-md border border-border/60 p-3"
                                    >
                                        <Checkbox
                                            checked={checked}
                                            disabled={!user || isMutating}
                                            onCheckedChange={(value) =>
                                                handleToggleRole(role.cd_id, Boolean(value))
                                            }
                                            className="mt-0.5"
                                            aria-label={`Vincular role ${role.ds_name}`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-medium text-foreground">
                                                    {role.ds_name}
                                                </span>
                                                {role.fl_active ? (
                                                    <StatusDot tone="ok" label="Ativa" />
                                                ) : (
                                                    <StatusDot tone="off" label="Inativa" />
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {role.ds_description}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}

                            {(roles ?? []).length === 0 && (
                                <li className="py-10 text-center text-sm text-muted-foreground">
                                    Nenhuma role cadastrada.
                                </li>
                            )}
                        </ul>
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
