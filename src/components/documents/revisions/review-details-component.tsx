import type { Review } from "@/api/documents/reviews/fetch-reviews"
import { TableComponent, type Column } from "@/components/table-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    Circle,
    Clock3,
    FilePlus,
    FileText,
    Info,
    MoreVertical,
    Paperclip,
    PenLine,
    Users,
    XCircle,
} from "lucide-react"
import { ReviewStatusBadge } from "../review-status-badge"
import { UserCell } from "../user-cell"

type ReviewVersion = Review["versions"][number]

function getVersionStatus(status: ReviewVersion["status"]) {
    switch (status) {
        case "APROVADA":
            return {
                label: "APROVADA",
                className:
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                icon: CheckCircle2,
                iconClassName: "text-emerald-500",
            }

        case "EM_APROVACAO":
            return {
                label: "EM APROVAÇÃO",
                className:
                    "border-blue-500/30 bg-blue-500/10 text-blue-500",
                icon: Clock3,
                iconClassName: "text-blue-500",
            }

        case "CANCELADA":
            return {
                label: "CANCELADA",
                className:
                    "border-red-500/30 bg-red-500/10 text-red-500",
                icon: XCircle,
                iconClassName: "text-red-500",
            }

        case "RASCUNHO":
        default:
            return {
                label: "RASCUNHO",
                className:
                    "border-muted-foreground/30 bg-muted text-muted-foreground",
                icon: Circle,
                iconClassName: "text-muted-foreground",
            }
    }
}

function formatDate(value: string | null) {
    if (!value) return "---"
    return new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "numeric"
    }).format(new Date(value))
}

const staticFlowSteps = [
    { id: 1, name: "Responsável", done: true },
    { id: 2, name: "Comité SGSI", done: true },
    { id: 3, name: "Alta Gestão", done: false },
]

interface ReviewDetailsComponentProps {
    review?: Review
    isLoading: boolean
    isError: boolean
    onRetry?: () => void
}

export function ReviewDetailsComponent({
    review,
    isLoading,
    isError,
    onRetry,
}: ReviewDetailsComponentProps) {
    // Estado de carregamento
    if (isLoading) {
        return (
            <div className="flex-1 px-16 pb-8 space-y-6">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        )
    }

    // Estado de erro
    if (isError || !review) {
        return (
            <div className="flex-1 px-16 pb-8">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <AlertCircle className="size-8 text-destructive" />
                        <p className="text-sm text-muted-foreground">
                            Não foi possível carregar os detalhes desta revisão.
                        </p>
                        {onRetry && (
                            <Button variant="outline" size="sm" onClick={onRetry}>
                                Tentar novamente
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    const canContinueRevision = ["APROVADA", "CANCELADA", "ABERTA"].includes(review.status)
    const canCreateVersion = ["APROVADA", "CANCELADA", "EM_APROVACAO"].includes(review.status)
    const canApproveRevision = ["APROVADA", "CANCELADA"].includes(review.status)
    const canDeniedVersion = ["APROVADA", "CANCELADA"].includes(review.status)

    return (
        <div className="flex-1 px-16 pb-8 space-y-6">
            <div className="w-full grid grid-cols-5 gap-6">
                <div className="col-span-2 space-y-6">
                    <Card className="rounded-lg p-6 space-y-1 border border-border shadow-sm transition-all duration-300 hover:shadow-lg bg-(image:--background-gradient)">
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info className="size-4 text-muted-foreground" />
                                Informações da Revisão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 p-0">
                            <div className="space-y-1 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Documento
                                </span>
                                <p className="text-sm">
                                    <span className="text-muted-foreground">#{review.document.id} - {review.document.title}</span>
                                </p>
                            </div>
                            <div className="space-y-1 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Motivo
                                </span>
                                <p className="text-sm">{review.reason}</p>
                                {review.autoOpened && (
                                    <span className="text-xs text-muted-foreground">
                                        Aberta automaticamente
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Estado
                                </span>
                                <ReviewStatusBadge status={review.status as Review["status"]} />
                            </div>

                            <div className="space-y-2 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Aberta em
                                </span>
                                <p className="flex items-center gap-1.5 text-sm">
                                    <CalendarClock className="size-4 text-muted-foreground" />
                                    {formatDate(review.createdAt)}
                                </p>
                            </div>

                            <div className="space-y-2 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Aberta por
                                </span>
                                <UserCell user={review.openUser} />
                            </div>

                            <div className="space-y-2 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Revisor
                                </span>
                                <UserCell user={review.reviserUser} />
                            </div>

                            <div className="space-y-1 grid grid-cols-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Prazo
                                </span>
                                <p className="flex items-center gap-1.5 text-sm">
                                    <CalendarClock className="size-4 text-muted-foreground" />
                                    {formatDate(review.dueDate)}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="space-y-1 grid grid-cols-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Concluída em
                                    </span>
                                    <p className="flex items-center gap-1.5 text-sm"><CalendarClock className="size-4 text-muted-foreground" />{formatDate(review.completedAt)}</p>
                                </div>
                                <div className="space-y-1 grid grid-cols-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Aprovada em
                                    </span>
                                    <p className="flex items-center gap-1.5 text-sm"><CalendarClock className="size-4 text-muted-foreground" />{formatDate(review.approvedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg p-6 space-y-1 border border-border shadow-sm transition-all duration-300 hover:shadow-lg bg-(image:--background-gradient)">
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info className="size-4 text-muted-foreground" />
                                Descrição da Revisão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 p-0">
                            <p className="line-clamp-6 text-justify text-sm text-muted-foreground">
                                {review.description ?? (
                                    <span className="text-muted-foreground">---</span>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3 space-y-6">
                    <Card className="rounded-lg p-6 space-y-1 border border-border shadow-sm transition-all duration-300 hover:shadow-lg bg-(image:--background-gradient)">
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info className="size-4 text-muted-foreground" />
                                Ações
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-4 gap-4 p-0">
                            <Button disabled={canCreateVersion}>
                                <FilePlus className="size-4" /> Criar Nova Versão
                            </Button>
                            <Button disabled={canContinueRevision}>
                                <PenLine className="size-4" /> Continuar Revisão
                            </Button>
                            <Button
                                disabled={canApproveRevision}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="size-4" /> Aprovar Revisão
                            </Button>
                            <Button className="bg-gray-800 hover:bg-gray-900 text-white hover:text-white dark:bg-red-800 dark:hover:bg-red-900 dark:text-white" variant="destructive" disabled={canDeniedVersion}>
                                <XCircle className="size-4" /> Cancelar Revisão
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg p-6 border border-border bg-(image:--background-gradient) shadow-sm transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 p-0 p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="size-4 text-muted-foreground" />
                                Versões da Revisão
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="relative space-y-4 h-100 overflow-y-auto sidebar-scroll">
                                {review.versions.map((version, index) => {
                                    const status = getVersionStatus(version.status)
                                    const StatusIcon = status.icon
                                    const isLast = index === review.versions.length - 1

                                    return (
                                        <div
                                            key={version.id}
                                            className="relative flex gap-4"
                                        >
                                            {/* Linha da timeline */}
                                            {!isLast && (
                                                <div className="absolute left-3.25 top-8 -bottom-4 w-px bg-border" />
                                            )}

                                            {/* Indicador da versão */}
                                            <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted">
                                                <StatusIcon
                                                    className={`size-4 ${status.iconClassName}`}
                                                />
                                            </div>

                                            {/* Card da versão */}
                                            <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-background/40 transition-all hover:border-border/80 hover:bg-background/60">
                                                <div className="grid grid-cols-[120px_minmax(0,1fr)_280px_40px]">
                                                    {/* Versão */}
                                                    <div className="flex flex-col justify-center items-center border-r border-border/50 px-5 py-4">
                                                        <span className="text-lg font-semibold">
                                                            {version.version}
                                                        </span>

                                                        <span
                                                            className={`mt-2 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.className}`}
                                                        >
                                                            {status.label}
                                                        </span>

                                                        <span className="mt-2 text-xs text-muted-foreground">
                                                            {formatDate(version.createdAt)}
                                                        </span>
                                                    </div>

                                                    {/* Change Log */}
                                                    <div className="flex flex-col items-start justify-start border-r border-border/50 px-5 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-[.8rem] font-medium text-muted-foreground">
                                                                Alterações
                                                            </span>

                                                            {index === 0 && (
                                                                <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[.8rem] font-semibold text-emerald-500">
                                                                    Versão Candidata
                                                                </span>
                                                            )}

                                                            {index === review.versions.length - 1 && (
                                                                <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[.8rem] font-semibold text-amber-500">
                                                                    Versão Base
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="line-clamp-2 text-sm leading-relaxed">
                                                            {version.changeLog || (
                                                                <span className="text-muted-foreground">
                                                                    Nenhuma alteração informada.
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Responsáveis */}
                                                    <div className="flex flex-col justify-center gap-3 px-5 py-4">
                                                        <div>
                                                            <span className="mb-1 block text-xs font-medium text-muted-foreground">
                                                                Revisor
                                                            </span>

                                                            <UserCell user={review.reviserUser} />
                                                        </div>
                                                    </div>

                                                    {/* Menu */}
                                                    <div className="flex items-start justify-center pt-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div >

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Progresso da Aprovação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-center gap-4">
                                {staticFlowSteps.map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {step.done ? (
                                                <CheckCircle2 className="size-5 text-emerald-500" />
                                            ) : (
                                                <Circle className="size-5 text-muted-foreground" />
                                            )}
                                            <span
                                                className={
                                                    step.done
                                                        ? "text-sm font-medium"
                                                        : "text-sm text-muted-foreground"
                                                }
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                        {index < staticFlowSteps.length - 1 && (
                                            <div className="h-px w-8 bg-border" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}