import type { Summary } from "@/api/documents/fetch-summary";
import { CheckCircle, CircleAlert, Clock, Edit, FileText } from "lucide-react";
import { Card } from "../ui/card";

interface CardDocumentsProps {
    onData: Summary
}

export function CardDocuments({ onData: summary }: CardDocumentsProps) {
    console.log(summary)
    const cardSummary = [
        {
            title: "Total de Documentos",
            value: summary["total"],
            icon: FileText,
            colorText: "text-purple-500",
            borderColor: "hover:border-purple-600",
        },
        {
            title: "Vigentes",
            value: summary["present"],
            icon: CheckCircle,
            colorText: "text-amber-500",
            borderColor: "hover:border-amber-500",
        },
        {
            title: "Em Revisão",
            value: summary["revision"],
            icon: Edit,
            colorText: "text-emerald-500",
            borderColor: "hover:border-emerald-500",
        },
        {
            title: "Em Andamento",
            value: summary["progress"],
            icon: Clock,
            colorText: "text-blue-500",
            borderColor: "hover:border-blue-500",
        }
        ,
        {
            title: "Pendente",
            value: summary["pending"],
            icon: CircleAlert,
            colorText: "text-red-500",
            borderColor: "hover:border-red-500",
        }
    ];
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-4">
            {cardSummary.map((item) => (
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
            ))}
        </div>
    )
}