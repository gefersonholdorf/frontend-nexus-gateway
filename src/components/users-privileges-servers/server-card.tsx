import { Clock, ClockAlert, ShieldAlert } from "lucide-react";
import { Card } from "../ui/card";

export function ServerCard() {
    return (
        <Card className="h-fit p-4 bg-(image:--background-gradient) rounded-sm border border-border shadow-sm flex flex-col gap-2">
            <span className="px-2 text-emerald-500 border border-border w-fit rounded-lg text-[.8rem]">Ativo</span>
            <div className="flex gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <span className="font-semibold text-primary-text">SERVER BRA HOM</span>
                            <span className="text-[.8rem] text-muted-foreground">Servidor de Homologação</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                                <Clock className="size-3 text-muted-foreground" />
                                Último Acesso
                            </span>
                            <span className="font-semibold text-primary-text">09/06/2026 às 06:15</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                            <ShieldAlert className="size-3 text-muted-foreground" />
                            Privilégio
                        </span>
                        <span className="font-semibold text-primary-text">ADMIN</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-[.8rem] text-muted-foreground">
                            <ClockAlert className="size-3 text-muted-foreground" />
                            Expira em
                        </span>
                        <span className="font-semibold text-primary-text">15/06/2026 às 20:59</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}