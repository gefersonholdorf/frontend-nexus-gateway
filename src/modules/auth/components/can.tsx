import { useHasPermission } from "@/modules/providers/permission-provider";
import type { ReactNode } from "react";

interface CanProps {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
    const allowed = useHasPermission(permission);

    if (!allowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}