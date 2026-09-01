import { useHasPermission, usePermissionsLoading } from "@/modules/providers/permission-provider";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

interface RouteGuardProps {
    permission: string;
    children: ReactNode;
    redirectTo?: string;
    loadingFallback?: ReactNode;
}

export function RouteGuard({
    permission,
    children,
    redirectTo = "/",
    loadingFallback = null,
}: RouteGuardProps) {
    const isLoading = usePermissionsLoading();
    const allowed = useHasPermission(permission);

    if (isLoading) {
        return <>{loadingFallback}</>;
    }

    if (!allowed) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}