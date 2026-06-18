import { Clock, ShieldAlert, ShieldCheck, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface VPNStatusProps {
    isConnected: boolean;
    userName?: string;
    ip?: string;
}

export function VPNStatusCard({
    isConnected,
}: VPNStatusProps) {
    return (
        <Card
            className="
            h-52
                w-full
                rounded-2xl
                border border-border
                bg-(image:--background-gradient)
                shadow-lg
                transition-all
                duration-300
                hover:shadow-xl
            "
        >
            <CardHeader className="">
                <div className="flex items-center gap-3">
                    <div
                        className={`
                            flex h-10 w-10 items-center justify-center rounded-md border
                            border-blue-500
                        `}
                    >
                        <Wifi className="size-5 text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Status do Certificado da VPN
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Monitoramento do certificado em tempo real
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    {/* USER */}
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            Usuário
                        </span>
                        <span className="text-sm font-medium text-primary-text">
                            Lusati_geferson
                        </span>
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                            Status
                        </span>

                        <div className="flex items-center gap-1">
                            {isConnected ? (
                                <>
                                    <ShieldCheck className="size-4 text-emerald-500" />
                                    <span className="text-sm font-semibold text-emerald-500">
                                        Válido
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="size-4 text-red-500" />
                                    <span className="text-sm font-semibold text-red-500">
                                        Desconectado
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-muted-foreground border border-border p-3 rounded-sm bg-card">
                    <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>Data de Expiração</span>
                    </div>

                    <span className="text-muted-foreground font-semibold">
                        30/06/2026 18:00:00
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}