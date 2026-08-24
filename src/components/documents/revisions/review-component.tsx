import { useFetchSummarys } from "@/api/documents/fetch-summary";
import { useFetchReviews, type Review } from "@/api/documents/reviews/fetch-reviews";
import { TableComponent, type Column } from "@/components/table-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/contexts/user-context";
import { differenceInDays, formatDate } from "date-fns";
import { CheckCircle, Clock, Edit, FileText, LoaderCircle, MoreHorizontalIcon, XCircle } from "lucide-react";
import { useState } from "react";
import {
    AlertTriangle,
    Ban,
    RotateCcw,
} from "lucide-react";
import { FilteringReviews, type Filters } from "./filtering-reviews-component";

const REVIEW_STATUS = {
    Pendente: {
        icon: Clock,
        color: "text-amber-500",
        label: "Pendente",
    },
    "Em Revisão": {
        icon: Edit,
        color: "text-blue-500",
        label: "Em Revisão",
    },
    "Solicitado Ajustes": {
        icon: RotateCcw,
        color: "text-amber-500",
        label: "Solicitado Ajustes",
    },
    Ajustado: {
        icon: Edit,
        color: "text-cyan-500",
        label: "Ajustado",
    },
    Aprovada: {
        icon: CheckCircle,
        color: "text-emerald-500",
        label: "Aprovada",
    },
    Rejeitada: {
        icon: XCircle,
        color: "text-red-500",
        label: "Rejeitada",
    },
    Cancelada: {
        icon: Ban,
        color: "text-zinc-500",
        label: "Cancelada",
    },
    Vencida: {
        icon: AlertTriangle,
        color: "text-red-600",
        label: "Vencida",
    },
};

const columns: Column<Review>[] = [
    {
        key: "document",
        title: "Título",
        render: (_, row) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="truncate max-w-60 flex flex-col">
                        <span className="truncate">{row.document.title.toString()}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <span>
                        {row.document.title.toString()}
                    </span>
                </TooltipContent>
            </Tooltip>
        )
    },
    {
        key: "applicant",
        title: "Solicitante",
    },
    {
        key: "status",
        title: "Status",
        render: (value) => {
            const status =
                REVIEW_STATUS[value as keyof typeof REVIEW_STATUS];

            if (!status) {
                return (
                    <Badge
                        className="bg-transparent border border-border"
                        variant="outline"
                    >
                        {value?.toString()}
                    </Badge>
                );
            }

            const Icon = status.icon;

            return (
                <Badge
                    variant="outline"
                    className="
                    gap-2
                    bg-transparent
                    border-border
                    text-primary-text
                "
                >
                    <Icon
                        className={`size-4 ${status.color}`}
                    />
                    {status.label}
                </Badge>
            );
        },
    },
    {
        key: "dueDate",
        title: "Prazo",
        render: (_, row) => {
            if (!row.dueDate) {
                return (
                    <span className="text-sm text-muted-foreground">
                        ---
                    </span>
                );
            }

            const daysRemaining = differenceInDays(
                new Date(row.dueDate),
                new Date()
            );

            const getBadgeVariant = () => {
                if (daysRemaining <= 5) {
                    return "destructive"; // vermelho
                }

                if (daysRemaining <= 10) {
                    return "secondary"; // amarelo
                }

                return "default"; // verde
            };

            return (
                <div className="flex items-center gap-2">
                    <span>
                        {formatDate(row.dueDate.toString(), "dd/MM/yyyy")}
                    </span>

                    <Badge
                        variant={getBadgeVariant()}
                        className={
                            daysRemaining > 10
                                ? "bg-emerald-500 hover:bg-green-600 text-white"
                                : daysRemaining <= 10 && daysRemaining > 5
                                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                                    : "bg-red-500"
                        }
                    >
                        {daysRemaining < 0
                            ? `${Math.abs(daysRemaining)} dias atrasado`
                            : `${daysRemaining} dias`}
                    </Badge>
                </div>
            );
        }
    },
    {
        key: "reviser",
        title: "Revisor",
    },
]

export function ReviewComponent() {
    const { user } = useUser()

    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<Filters>({
        type: "all"
    });

    const { isLoading, data, isError, refetch } = useFetchReviews({
        page,
        perPage: 10,
        type: "all"
    })

    // const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummarys({
    //     page,
    //     perPage: 10,
    //     type: "all"
    // })

    function handleFiltering(newFilters: Filters) {
        setFilters(newFilters);
        setPage(1);
    }

    // const summarys = dataSummary
    //     ? [
    //         {
    //             title: "Total",
    //             value: dataSummary.summary.total,
    //             icon: FileText,
    //             colorText: "text-primary",
    //             borderColor: "hover:border-primary",
    //         },
    //         {
    //             title: "Vigentes",
    //             value: dataSummary.summary.present,
    //             icon: CheckCircle,
    //             colorText: "text-emerald-500",
    //             borderColor: "hover:border-emerald-500",
    //         },
    //         {
    //             title: "Em Aprovação",
    //             value: dataSummary.summary.revision,
    //             icon: LoaderCircle,
    //             colorText: "text-purple-400",
    //             borderColor: "hover:border-purple-400",
    //         },
    //         {
    //             title: "Em Revisão",
    //             value: dataSummary.summary.revision,
    //             icon: Edit,
    //             colorText: "text-amber-500",
    //             borderColor: "hover:border-amber-500",
    //         },
    //         {
    //             title: "Em Andamento",
    //             value: dataSummary.summary.progress,
    //             icon: Clock,
    //             colorText: "text-blue-500",
    //             borderColor: "hover:border-blue-500",
    //         },
    //         {
    //             title: "Pendentes",
    //             value: dataSummary.summary.pending,
    //             icon: XCircle,
    //             colorText: "text-red-500",
    //             borderColor: "hover:border-red-500",
    //         },
    //     ]
    //     : [];

    return (
        <>
            <div className="flex-1 px-16 pb-8 space-y-6">
                <TableComponent
                    data={data?.revisions ?? []}
                    // cardsQuantity={{
                    //     summarys: summarys ?? [],
                    //     isLoading: isLoadingSummary,
                    // }}
                    registerName="Documentos"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    filteringComponent={
                        <FilteringReviews onFilterChange={handleFiltering} />
                    }
                    columns={columns}
                    pagination={
                        data?.pagination ?? {
                            page: 1,
                            perPage: 10,
                            total: 0,
                            totalPages: 1,
                            hasNextPage: false,
                            hasPreviousPage: false,
                        }
                    }
                    onPageChange={setPage}
                    actions={(revision) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8" >
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-fit">

                            </DropdownMenuContent>
                        </DropdownMenu>)} />
            </div>
        </>
    )
}