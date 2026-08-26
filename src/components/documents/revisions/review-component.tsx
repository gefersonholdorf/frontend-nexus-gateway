import { useFetchReviews, type Review } from "@/api/documents/reviews/fetch-reviews"
import { useFetchSummarysReviews } from "@/api/documents/reviews/fetch-summary-reviews"
import { TableComponent, type Column } from "@/components/table-component"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "date-fns"
import { CheckIcon, Clock, FileText, LoaderCircle, X } from "lucide-react"
import { useState } from "react"
import { ReviewStatusBadge } from "../review-status-badge"
import { UserCell } from "../user-cell"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const columns: Column<Review>[] = [
    {
        key: "id",
        title: "Revisão",
        render: (_, row) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="truncate max-w-60 flex flex-col">
                        <span className="truncate">{row.document.title}</span>
                        <span className="text-sm text-muted-foreground">#{row.id} - REV-{row.id}-DOC-{row.document.id}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <span>
                        {row.document.title}
                    </span>
                </TooltipContent>
            </Tooltip>
        ),
    },
    {
        key: "status",
        title: "Status",
        render: (_, row) => (
            <div className="flex flex-col gap-1">
                <ReviewStatusBadge status={row.status} />
                <span className="text-[.8rem] text-muted-foreground">
                    {row.status === "EM_APROVACAO"}
                    {row.status === "ABERTA"}
                    {row.status === "APROVADA"}
                    {row.status === "CANCELADA"}
                </span>
            </div>
        ),
    },

    {
        key: "reviserUser",
        title: "Responsável",
        render: (_, row) => (
            <UserCell user={row.reviserUser} />
        ),
    },

    {
        key: "versions",
        title: "Versões",
        render: (_, row) => (
            <div className="flex flex-col">
                <span>
                    {row.versions?.length ?? 0} versões
                </span>

                {row.versions && (
                    <span className="text-[.8rem] text-muted-foreground">
                        {row.versions[0].version} é a candidata
                    </span>
                )}
            </div>
        ),
    },

    {
        key: "createdAt",
        title: "Aberta em",
        render: (_, row) => (
            <div className="flex flex-col">
                <span>
                    {
                        row.createdAt
                            ? formatDate(
                                new Date(row.createdAt),
                                "dd/MM/yyyy, HH:mm"
                            )
                            : "---"
                    }
                </span>

                <span className="text-[.8rem] text-muted-foreground">
                    Há 3 dias
                </span>
            </div>
        ),
    },

    {
        key: "dueDate",
        title: "Prazo",
        render: (_, row) => {
            if (!row.dueDate) {
                return (
                    <span className="text-muted-foreground">
                        ---
                    </span>
                )
            }

            const dueDate = new Date(row.dueDate)

            if (isNaN(dueDate.getTime())) {
                return (
                    <span className="text-muted-foreground">
                        ---
                    </span>
                )
            }

            const now = new Date()

            const diffTime =
                dueDate.getTime() - now.getTime()

            const daysRemaining = Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            )

            const badgeClass =
                daysRemaining < 0
                    ? "border-red-500/30 bg-red-500/10 text-red-500"
                    : daysRemaining <= 5
                        ? "border-red-500/30 bg-red-500/10 text-red-500"
                        : daysRemaining <= 10
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"

            return (
                <div className="flex flex-col gap-1">
                    {((row.status === 'APROVADA') || (row.status === 'CANCELADA')) ? (
                        <span>---</span>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-sm">
                                {formatDate(
                                    dueDate,
                                    "dd/MM/yyyy"
                                )}
                            </span>

                            <Badge
                                variant="outline"
                                className={badgeClass}
                            >
                                {daysRemaining < 0
                                    ? `há ${Math.abs(daysRemaining)} dias`
                                    : daysRemaining === 0
                                        ? "hoje"
                                        : `em ${daysRemaining} dias`}
                            </Badge>
                        </div>
                    )
                    }
                </div >
            )
        },
    }
]

interface ReviewComponentProps {
    documentId?: number
}

export function ReviewComponent({
    documentId,
}: ReviewComponentProps) {
    const [page, setPage] = useState(1)

    const {
        isLoading,
        data,
        isError,
        refetch,
    } = useFetchReviews({
        page,
        perPage: 10,
        documentId,
    })

    const { isLoading: isLoadingSummary, data: dataSummary } = useFetchSummarysReviews({
        page,
        perPage: 10,
        documentId
    })

    const summarys = dataSummary
        ? [
            {
                title: "Total",
                value: dataSummary.summary.total,
                icon: FileText,
                colorText: "text-primary",
                borderColor: "hover:border-primary",
            },
            {
                title: "Aberto",
                value: dataSummary.summary.open,
                icon: Clock,
                colorText: "text-blue-500",
                borderColor: "hover:border-blue-500",
            },
            {
                title: "Em Aprovação",
                value: dataSummary.summary.pendingApproval,
                icon: LoaderCircle,
                colorText: "text-purple-400",
                borderColor: "hover:border-purple-400",
            },
            {
                title: "Aprovado",
                value: dataSummary.summary.approved,
                icon: CheckIcon,
                colorText: "text-emerald-500",
                borderColor: "hover:border-emerald-500",
            },
            {
                title: "Cancelado",
                value: dataSummary.summary.cancelled,
                icon: X,
                colorText: "text-red-500",
                borderColor: "hover:border-red-500",
            }
        ]
        : [];

    return (
        <div className="flex-1 px-16 pb-8 space-y-6">
            <TableComponent
                registerName="Revisões"
                data={data?.revisions ?? []}
                columns={columns}
                cardsQuantity={{
                    summarys: summarys ?? [],
                    isLoading: isLoadingSummary,
                }}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
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
            />
        </div>
    )
}