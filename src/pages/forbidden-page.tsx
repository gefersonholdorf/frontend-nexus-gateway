import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

export function ForbiddenPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-lg text-center">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-7xl font-extrabold tracking-tight text-foreground">
                    403
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-foreground">
                    Acesso negado
                </h2>

                <p className="mt-3 text-muted-foreground">
                    Você não possui permissão para acessar esta página ou recurso.
                    Caso acredite que isso seja um erro, entre em contato com o
                    administrador do sistema.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-medium transition hover:bg-accent"
                    >
                        <ArrowLeft size={18} />
                        Voltar
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        <Home size={18} />
                        Ir para o início
                    </button>
                </div>
            </div>
        </div>
    );
}