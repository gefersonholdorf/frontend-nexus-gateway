import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMe } from "../auth/hooks/use-me";

interface PermissionContextValue {
    permissions: string[];
    isLoading: boolean;
    hasPermission: (key: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(
    undefined,
);

interface PermissionProviderProps {
    children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
    const { data, isLoading } = useMe();

    const value = useMemo<PermissionContextValue>(() => {
        const permissions = data?.permissions ?? [];
        const permissionSet = new Set(permissions);

        return {
            permissions,
            isLoading,
            hasPermission: (key: string) => permissionSet.has(key),
        };
    }, [data?.permissions, isLoading]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}

function usePermissionContext(): PermissionContextValue {
    const context = useContext(PermissionContext);

    if (!context) {
        throw new Error(
            "usePermissionContext deve ser usado dentro de um PermissionProvider",
        );
    }

    return context;
}

export function usePermissions(): string[] {
    return usePermissionContext().permissions;
}

export function useHasPermission(key: string): boolean {
    return usePermissionContext().hasPermission(key);
}

export function usePermissionsLoading(): boolean {
    return usePermissionContext().isLoading;
}