import { CircleX, Clock, ShieldAlert, ShieldAlertIcon, ShieldCheck, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { formatLastLogin } from "@/lib/format-last-login";

interface VPNDetailsResponse {
    vpnDetails: {
        name: string,
        expirationRaw: string,
        expirationDate: string,
        daysRemaining: number
        status: "valid" | "critical" | "warning" | "expired"
    }
}

export function VPNStatusCard() {
    const { user } = useUser()
    const query = useQuery({
        queryKey: ["vpn-details"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/vpn`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                }
            })

            const result = await response.json() as VPNDetailsResponse;

            return result;
        },
        refetchInterval: 30000,
    });

    if (query.isLoading) {
        return (
            <Card className="h-52 p-0">
                <Skeleton className="h-full bg-gray-100" />
            </Card>
        );
    }

    if (!query.data) {
        return null;
    }

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
                            {query.data.vpnDetails.name}
                        </span>
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                            Status
                        </span>

                        <div className="flex items-center gap-1">
                            {query.data.vpnDetails.status === 'valid' && (
                                <>
                                    <ShieldCheck className="size-4 text-emerald-500" />
                                    <span className="text-sm font-semibold text-emerald-500">
                                        Válido
                                    </span>
                                </>
                            )}
                            {query.data.vpnDetails.status === 'critical' && (
                                <>
                                    <ShieldAlertIcon className="size-4 text-red-500" />
                                    <span className="text-sm font-semibold text-red-500">
                                        Urgente
                                    </span>
                                </>
                            )}
                            {query.data.vpnDetails.status === 'expired' && (
                                <>
                                    <CircleX className="size-4 text-red-500" />
                                    <span className="text-sm font-semibold text-red-500">
                                        Expirado
                                    </span>
                                </>
                            )}
                            {query.data.vpnDetails.status === 'warning' && (
                                <>
                                    <ShieldAlert className="size-4 text-amber-500" />
                                    <span className="text-sm font-semibold text-amber-500">
                                        Alerta
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
                        {formatLastLogin(query.data.vpnDetails.expirationDate)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}