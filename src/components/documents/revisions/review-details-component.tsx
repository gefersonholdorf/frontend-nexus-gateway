import type { Review } from "@/api/documents/reviews/fetch-reviews"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertCircle,
    CheckCircle2,
    FilePlus,
    FileText,
    Info,
    PenLine,
    XCircle
} from "lucide-react"
import { ReviewStatusBadge } from "../review-status-badge"
import { ReviewVersionsTableComponent } from "./reviews-versions-table-component"
import { useState } from "react"
import { CreateVersionModal } from "../versions/create-version-modal"

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
                                    label="Aberta por"
                                    value={review.openUser.name}
                                />

                                <InfoRow
                                    label="Revisor atual"
                                    value={review.reviserUser?.name ?? '---'}
                                />

                                <InfoRow
                                    label="Versão Inicial"
                                    value={review.versions.at(-1)?.version}
                                />

                                <InfoRow
                                    label="Versão Candidata"
                                    value={review.versions[0].version}
                                />
                                <div className="grid grid-cols-2 items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        Aberta automaticamente
                                    </span>

                                    <Badge className="bg-card border border-border text-primary-text">
                                        {review.autoOpened ? "Sim" : "Não"}
                                    </Badge>
                                </div>
                                {review.status === 'APROVADA' && (
                                    <InfoRow
                                        label="Aprovada em"
                                        value={review.approvedAt}
                                    />
                                )}
                                {review.status === 'CANCELADA' && (
                                    <InfoRow
                                        label="Aprovada em"
                                        value={review.approvedAt}
                                    />
                                )}

                                {((review.status === 'EM_APROVACAO') || (review.status === 'ABERTA')) && (
                                    <div className="grid grid-cols-2 items-start gap-3">
                                        <span className="text-sm text-muted-foreground">
                                            Prazo
                                        </span>

                                        <div>
                                            <span className="text-sm">
                                                {formatDate(review.dueDate)}
                                            </span>

                                            <div>
                                                <Badge
                                                    variant="outline"
                                                    className="mt-1 text-xs"
                                                >
                                                    14 dias restantes
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
        <div className="grid grid-cols-2 items-center gap-3">
            <span className="text-sm text-muted-foreground">
                {label}
            </span>

            <span className={`text-sm font-medium ${type === 'muted' && 'text-muted-foreground'}`}>
                {value}
            </span>
        </div>
    );
}