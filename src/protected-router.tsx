import { useUser } from "@/contexts/user-context";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

export function ProtectedRoute() {
    const { isAuthenticated } = useUser();

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Autenticação necessária", {
                description: "Efetue o login para acessar os recursos do sistema.",
                position: "top-center",
                richColors: true,
            });
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}