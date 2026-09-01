import type { Review } from "@/api/documents/reviews/fetch-reviews"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertCircle,
    Calendar1Icon,
    CheckCircle2,
    ClockFading,
    File,
    FilePlus,
    FileText,
    GitBranch,
    Info,
    PenLine,
    XCircle,
    type LucideIcon
} from "lucide-react"
import { useState } from "react"
import { ReviewStatusBadge } from "../review-status-badge"
import { CreateVersionModal } from "../versions/create-version-modal"
import { ReviewVersionsTableComponent } from "./reviews-versions-table-component"

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
    const [createVersionOpen, setCreateVersionOpen] = useState(false)

    function handleSetCreateVersionModal(status: boolean) {
        setCreateVersionOpen(status)
    }
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
    const daysRemaining = review.dueDate
        ? Math.ceil(
            (new Date(review.dueDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
        : 0

    const summarys = [
        {
            title: "Tipo de Abertura",
            value: `${review.autoOpened ? "Automático" : "Manual"}`,
            icon: Calendar1Icon,
            colorText: "text-red-400",
            borderColor: "hover:border-red-400",
        },
        {
            title: "Versão Inicial",
            value: `${review.versions.at(-1)?.version}`,
            icon: File,
            colorText: "text-amber-400",
            borderColor: "hover:border-amber-400",
        },
        {
            title: "Versão Candidata",
            value: `${review.versions[0].version}`,
            icon: GitBranch,
            colorText: "text-emerald-400",
            borderColor: "hover:border-emerald-400",
        },
        {
            title: "Prazo",
            value:
                review.status === "APROVADA" || review.status === "CANCELADA"
                    ? "---"
                    : daysRemaining < 0
                        ? `${Math.abs(daysRemaining)} dias`
                        : daysRemaining === 0
                            ? "Hoje"
                            : `${daysRemaining} dias`,
            icon: ClockFading,
            colorText: "text-emerald-400",
            borderColor: "hover:border-emerald-400",
        },
    ];

    return (
        <div className="flex-1 px-16 pb-8 space-y-6">
            <div className="w-full grid grid-cols-5 gap-6">
                <div className="col-span-2 space-y-6">
                    <Card className="rounded-xl p-6 border border-border/50 bg-(image:--background-gradient) shadow-sm">
                        <CardHeader className="p-0 flex justify-start items-center gap-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info className="size-4 text-muted-foreground" />
                                Resumo da Revisão
                            </CardTitle>
                            <ReviewStatusBadge
                                status={review.status as Review["status"]}
                            />
                        </CardHeader>

                        <CardContent className="w-full grid grid-cols-1 gap-8 p-0">
                            <div className="w-full space-y-4">
                                <InfoRow
                                    label="Documento"
                                    value={`#${review.document.id} - ${review.document.title}`}
                                    type="muted"
                                />

                                <InfoRow
                                    label="Motivo"
                                    value={review.reason}
                                />

                                <InfoRow
                                    label="Abertura"
                                    value={formatDate(review.createdAt)}
                                />
                                <InfoRow
                                    label="Descrição"
                                    value={review.description ?? "---"}
                                    type="muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        {summarys.map((summary) => (
                            <CardInfoReview summary={summary} />
                        ))}
                        <Card
                            className={`flex flex-row items-center justify-start border-b-3 border-transparent hover:border-blue-400 rounded-sm shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-sm p-3 px-6 gap-3 bg-(image:--background-gradient)`}
                        >
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage
                                    src={review.openUser.avatarUrl ?? ""}
                                    alt={review.openUser.name}
                                />

                                <AvatarFallback className="bg-primary/90 text-white">
                                    {"GH"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-primary-text font-semibold text-[1rem]">{review.openUser.name}</span>
                                <span className="text-[.8rem] text-muted-foreground">Solicitante</span>
                            </div>
                        </Card>
                        <Card
                            className={`flex flex-row items-center justify-start border-b-3 border-transparent hover:border-amber-400 rounded-sm shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-sm p-3 px-6 gap-3 bg-(image:--background-gradient)`}
                        >
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage
                                    src={review.reviserUser?.avatarUrl ?? ""}
                                    alt={review.reviserUser?.name}
                                />

                                <AvatarFallback className="bg-primary/90 text-white">
                                    {"GH"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-primary-text font-semibold text-[1rem]">{review.reviserUser?.name}</span>
                                <span className="text-[.8rem] text-muted-foreground">Revisor</span>
                            </div>
                        </Card>
                    </div>
                    <Card className="rounded-lg p-6 space-y-1 border border-border shadow-sm transition-all duration-300 hover:shadow-lg bg-(image:--background-gradient)">
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Info className="size-4 text-muted-foreground" />
                                Ações
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-4 gap-4 p-0">
                            <Button disabled={canCreateVersion} onClick={() => handleSetCreateVersionModal(true)}>
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
                        <CardHeader className="flex flex-row items-center justify-between p-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="size-4 text-muted-foreground" />
                                Versões da Revisão
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <ReviewVersionsTableComponent versions={review.versions} />
                        </CardContent>
                    </Card>
                </div>
                <div >
                </div>
            </div>
            <CreateVersionModal
                open={createVersionOpen}
                onOpenChange={handleSetCreateVersionModal}
                review={{
                    currentVersion: review.versions[0].version,
                    id: review.document.id,
                    editUrl: review.versions[0].editUrl
                }}
                currentUserId={1}
                nextVersion={`${review.versions[0].major}.${review.versions[0].minor + 1}`}
                isPending={false}
            />
        </div>
    )
}

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
    type?: "muted"
}

function InfoRow({
    label,
    value,
    type
}: InfoRowProps) {
    return (
        <div className="grid grid-cols-2 items-start gap-3">
            <span className="text-sm text-muted-foreground">
                {label}
            </span>

            <span className={`text-sm font-medium ${type === 'muted' && 'text-muted-foreground'} line-clamp-3 text-justify`}>
                {value}
            </span>
        </div>
    );
}

interface CardInfoReviewProps {
    summary: {
        title: string
        value: string
        icon: LucideIcon,
        colorText: string
        borderColor: string
    }
}

function CardInfoReview({ summary }: CardInfoReviewProps) {
    return (
        <Card
            key={summary.title}
            className={`flex flex-row items-center justify-start border-b-3 border-transparent ${summary.borderColor} rounded-sm shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                                    hover:shadow-sm p-3 px-6 gap-3 bg-(image:--background-gradient)`}
        >
            <div className={`${summary.colorText} p-3 rounded-lg border border-border bg-card`}>
                <summary.icon className="size-5" />
            </div>
            <div className="flex flex-col items-start gap-1">
                <span className="text-primary-text font-semibold text-[1.1rem]">{summary.value}</span>
                <span className="text-[.8rem] text-muted-foreground">{summary.title}</span>
            </div>
        </Card>
    )
}