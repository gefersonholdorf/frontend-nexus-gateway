import { useState } from "react"
import { formatDate } from "date-fns"
import { TableComponent, type Column } from "@/components/table-component"
import { useFetchReviews, type Review } from "@/api/documents/reviews/fetch-reviews"
import { ReviewStatusBadge } from "../review-status-badge"
import { UserCell } from "../user-cell"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const columns: Column<Review>[] = [
    {
        key: "id",
        title: "Revisão",
        render: (_, row) => (
            <div className="flex flex-col">
                <span className="text-base">
                    #{row.id}
                </span>

                <span className="text-[.8rem] text-muted-foreground">
                    REV-{String(row.id).padStart(6, "0")}
                </span>
            </div>
        ),
    },

    {
        key: "document",
        title: "Documento",
        render: (_, row) => (
            <div className="flex flex-col min-w-0 max-w-70">
                <span className="truncate">
                    {row.document.title}
                </span>

                <span className="text-[.8rem] text-muted-foreground">
                    #{row.document.id}
                </span>
            </div>
        ),
    },

    {
        key: "status",
        title: "Status",
        render: (_, row) => (
            <div className="flex flex-col gap-1">
                <ReviewStatusBadge status={row.status} />

                <span className="text-[.8rem] text-muted-foreground">
                    {row.status === "EM_APROVACAO" &&
                        "Aguardando aprovação"}

                    {row.status === "ABERTA" &&
                        "Editando revisão"}

                    {row.status === "APROVADA" &&
                        "Revisão concluída"}

                    {row.status === "CANCELADA" &&
                        "Revisão cancelada"}
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
                            ? `${Math.abs(daysRemaining)} dias atrasado`
                            : daysRemaining === 0
                                ? "Vence hoje"
                                : `${daysRemaining} dias restantes`}
                    </Badge>
                </div>
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

    return (
        <div className="flex-1 px-16 pb-8">
            <TableComponent
                registerName="Revisões"
                data={data?.revisions ?? []}
                columns={columns}
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