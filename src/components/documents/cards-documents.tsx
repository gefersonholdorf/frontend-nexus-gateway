import type { Summary } from "@/api/documents/fetch-summary";
import { CheckCircle, CircleAlert, Clock, Edit, FileText } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface CardDocumentsProps {
    summary?: Summary
    isLoading: boolean
}

export function CardDocuments({ summary, isLoading }: CardDocumentsProps) {
    const cardSummary = [
        {
            title: "Total de Documentos",
            value: summary?.["total"] ?? 0,
            icon: FileText,
            colorText: "text-purple-500",
            borderColor: "hover:border-purple-600",
        },
        {
            title: "Vigentes",
            value: summary?.["present"] ?? 0,
            icon: CheckCircle,
            colorText: "text-amber-500",
            borderColor: "hover:border-amber-500",
        },
        {
            title: "Em Revisão",
            value: summary?.["revision"] ?? 0,
            icon: Edit,
            colorText: "text-emerald-500",
            borderColor: "hover:border-emerald-500",
        },
        {
            title: "Em Andamento",
            value: summary?.["progress"] ?? 0,
            icon: Clock,
            colorText: "text-blue-500",
            borderColor: "hover:border-blue-500",
        }
        ,
        {
            title: "Pendente",
            value: summary?.["pending"] ?? 0,
            icon: CircleAlert,
            colorText: "text-red-500",
            borderColor: "hover:border-red-500",
        }
    ];
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4">
            {isLoading ? (
                Array.from({ length: 8 }).map((_, rowIndex) => (
                    <Skeleton key={rowIndex} className="h-20" />
                ))) : (
                cardSummary.map((item) => (
                    <Card
                        key={item.title}
                        className={`flex flex-row items-center justify-start border-b-3 border-transparent ${item.borderColor} rounded-sm shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-sm p-3 px-6 gap-3 bg-(image:--background-gradient)`}
                    >
                        <div className={`${item.colorText} p-3 rounded-lg border border-border bg-card`}>
                            <item.icon className="size-5" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-primary-text font-bold text-[1.1rem]">{item.value}</span>
                            <span className="text-[.8rem] text-muted-foreground">{item.title}</span>
                        </div>
                    </Card>
                ))
            )}
        </div>
    )
}