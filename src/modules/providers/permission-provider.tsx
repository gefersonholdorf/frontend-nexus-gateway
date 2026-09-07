import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

import { useMe } from "@/modules/auth/hooks/use-me";
import { useUser } from "@/contexts/user-context";

/**
 * PermissionProvider — infraestrutura REAL de autorização do app (não é mock).
 *
 * Consome `useMe()` (V2, `GET /me`) e expõe o conjunto de permissões do usuário
 * autenticado para `Can`/`RouteGuard` (src/modules/auth/components) e para
 * qualquer tela que precise checar `dominio.acao` (ex.: "users.manage").
 *
 * Ver docs/architecture/auth-and-rbac.md para o contrato completo.
 */
interface PermissionContextValue {
    permissions: string[];
    permissionSet: Set<string>;
    isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
    children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
    const { data, isLoading } = useMe();
    const { user, setUser } = useUser();

    const value = useMemo<PermissionContextValue>(() => {
        const permissions = data?.permissions ?? [];

        return {
            permissions,
            permissionSet: new Set(permissions),
            isLoading,
        };
    }, [data, isLoading]);

    useEffect(() => {
        if (!data || !user) return;

        const nextRoles = data.roles.map((role) => role.ds_name);
        const nextPermissions = data.permissions;

        const rolesChanged =
            nextRoles.length !== user.roles.length ||
            nextRoles.some((role, index) => role !== user.roles[index]);
        const permissionsChanged =
            nextPermissions.length !== user.permissions.length ||
            nextPermissions.some((permission, index) => permission !== user.permissions[index]);

        if (!rolesChanged && !permissionsChanged) return;

        setUser({
            ...user,
            roles: nextRoles,
            permissions: nextPermissions,
        });
    }, [data, user, setUser]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}

function usePermissionContext(): PermissionContextValue {
    const context = useContext(PermissionContext);

    if (!context) {
        throw new Error("usePermissionContext deve ser usado dentro de PermissionProvider");
    }

    return context;
}

export function usePermissions(): string[] {
    return usePermissionContext().permissions;
}

export function useHasPermission(permission: string): boolean {
    return usePermissionContext().permissionSet.has(permission);
}

export function usePermissionsLoading(): boolean {
    return usePermissionContext().isLoading;
}
