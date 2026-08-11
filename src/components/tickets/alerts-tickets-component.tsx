import { useFetchTicketsSummary } from "@/api/glpi/get-tickets-summary";
import { AlertTriangle, ClockAlert, UserX } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export function AlertsTicketsComponent() {

    const { data: summaryData, isLoading: isLoadingSummary } =
        useFetchTicketsSummary();


    if (isLoadingSummary) {
        return (
            <Skeleton className="h-24 w-full rounded-xl" />
        );
    }


    if (!summaryData) {
        return null;
    }


    const alerts = [
        {
            count: summaryData.summary.alerts.slaExpired.count,
            title: "chamados com SLA vencido",
            description: "Ação imediata necessária",
            icon: ClockAlert,
            iconStyle: "bg-red-100 text-red-500",
        },

        {
            count: summaryData.summary.alerts.withoutResponsible.count,
            title: "chamados sem responsável",
            description: "Atribua um responsável",
            icon: UserX,
            iconStyle: "bg-orange-100 text-orange-500",
        },

        {
            count: summaryData.summary.alerts.withoutUpdate.count,
            title: "chamados sem atualização",
            description: "Há mais de 24 horas",
            icon: AlertTriangle,
            iconStyle: "bg-yellow-100 text-yellow-600",
        },

    ].filter(alert => alert.count > 0);


    if (alerts.length === 0) {
        return null;
    }


    return (
        <Card className="w-full border bg-(image:--background-gradient) rounded-lg px-4 py-1 transition-all duration-200 flex flex-row divide-x">
            {
                alerts.map((alert, index) => {
                    const Icon = alert.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-4 px-8 py-5 flex-1"
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${alert.iconStyle}`}>
                                <Icon className="size-5"/>
                            </div>
                            <div className="flex flex-col" >
                                <span className="text-sm font-semibold">
                                    {alert.count} {alert.title}
                                </span>
                                <span className="text-[.8rem] text-muted-foreground">
                                    {alert.description}
                                </span>
                            </div>
                        </div>
                    );
                })
            }
        </Card>
    );
}