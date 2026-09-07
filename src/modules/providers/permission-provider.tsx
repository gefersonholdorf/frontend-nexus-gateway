import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useMe } from "@/modules/auth/hooks/use-me";

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

    const value = useMemo<PermissionContextValue>(() => {
        const permissions = data?.permissions ?? [];

        return {
            permissions,
            permissionSet: new Set(permissions),
            isLoading,
        };
    }, [data, isLoading]);

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
