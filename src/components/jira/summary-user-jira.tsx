import { useGetSummaryJiraUser } from "@/api/jira/get-summary-jira-user";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChartSummaryUserPie } from "./chart-summary-user-pier";
import { Skeleton } from "../ui/skeleton";
import { Ticket } from "lucide-react";

export function SummaryUserJira() {
    const { data, isLoading } = useGetSummaryJiraUser()

    if (isLoading) {
        return (
            <Skeleton className="h-60" />
        )
    }

    if (!data) {
        return null
    }

    const totalTasks =
        data.summary.pending +
        data.summary.inProgress +
        data.summary.correction +
        data.summary.completed

    const summary = [
        {
            title: "Pendente",
            count: data.summary.pending,
            percentage: (data.summary.pending / totalTasks) * 100,
            bgColor: "bg-amber-400"
        },
        {
            title: "Em Andamento",
            count: data.summary.inProgress,
            percentage: (data.summary.inProgress / totalTasks) * 100,
            bgColor: "bg-blue-500"
        },
        {
            title: "Correção",
            count: data.summary.correction,
            percentage: (data.summary.correction / totalTasks) * 100,
            bgColor: "bg-rose-400"
        },
        {
            title: "Concluído",
            count: data.summary.completed,
            percentage: (data.summary.completed / totalTasks) * 100,
            bgColor: "bg-emerald-400"
        },
    ]
    return (
        <Card
            className={`h-74 flex flex-col items-center justify-start border border-border rounded-2xl shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                        hover:shadow-sm gap-6 bg-(image:--background-gradient)`}
        >
            <CardHeader className="w-full flex justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary bg-background/10">
                        <Ticket className="size-5 text-primary" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-primary-text">
                            Minhas Tarefas Jira
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Confira o resumo das suas tarefas no JIRA no mês atual
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 px-2 pr-4">
                <div className="w-full col-span-1">
                    <ChartSummaryUserPie summary={{
                        pending: data.summary.pending,
                        inProgress: data.summary.inProgress,
                        correction: data.summary.correction,
                        completed: data.summary.completed,
                    }} />
                </div>
                <div className="col-span-2 pl-10 w-full flex flex-col justify-center gap-3">
                    {summary.map((item) => (
                        <div
                            key={item.title}
                            className="w-full flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-sm ${item.bgColor}`}
                                />

                                <span className="text-primary-text">
                                    {item.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-8">
                                <span className="text-primary-text font-medium w-8 text-right">
                                    {item.count}
                                </span>

                                <span className="text-muted-foreground w-12 text-right">
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}