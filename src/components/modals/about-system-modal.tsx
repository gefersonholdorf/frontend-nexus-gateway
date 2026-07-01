import {
    Info,
    Monitor,
    Server,
    CalendarClock,
    Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AboutSystemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AboutSystemModal({
    open,
    onOpenChange,
}: AboutSystemModalProps) {
    const frontendVersion = "v1.5.0";
    const backendVersion = "v1.5.0";

    const environment = "Produção";

    const lastUpdate = "20/06/2026";

    const browser =
        typeof window !== "undefined"
            ? navigator.userAgent
            : "N/A";

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Info className="size-5" />

                        <DialogTitle>
                            Sobre o Sistema
                        </DialogTitle>
                    </div>

                    <DialogDescription>
                        Informações técnicas e
                        institucionais da aplicação.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Nexus Gateway
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Plataforma de intranet corporativa desenvolvida para
                            centralizar informações, monitoramento, comunicação e
                            processos internos da organização.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Monitor className="size-4" />
                                Frontend
                            </div>

                            <p className="font-semibold">
                                {frontendVersion}
                            </p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Server className="size-4" />
                                Backend
                            </div>

                            <p className="font-semibold">
                                {backendVersion}
                            </p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Globe className="size-4" />
                                Ambiente
                            </div>

                            <p className="font-semibold">
                                {environment}
                            </p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <CalendarClock className="size-4" />
                                Atualização
                            </div>

                            <p className="font-semibold">
                                {lastUpdate}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Status da API
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-[.8rem] font-medium text-primery-text">
                                    Online
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Navegador
                            </p>

                            <p className="text-xs break-all">
                                {browser}
                            </p>
                        </div>
                    </div>

                    <div className="text-start text-xs text-muted-foreground">
                        © 2026 Nexus Gateway - Geferson Holdorf
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}