import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ReviewStatus = "ABERTA" | "EM_APROVACAO" | "APROVADA" | "CANCELADA"
type VersionStatus = "RASCUNHO" | "EM_APROVACAO" | "APROVADA" | "CANCELADA"

type AnyStatus = ReviewStatus | VersionStatus

const STATUS_MAP: Record<AnyStatus, { label: string; className: string }> = {
    ABERTA: {
        label: "Aberta",
        className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-transparent dark:text-blue-500 dark:border-border",
    },
    RASCUNHO: {
        label: "Rascunho",
        className:
            "bg-slate-50 text-slate-700 border-slate-200 dark:bg-transparent dark:text-slate-500 dark:border-border",
    },
    EM_APROVACAO: {
        label: "Em aprovação",
        className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-transparent dark:text-amber-500 dark:border-border",
    },
    APROVADA: {
        label: "Aprovada",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
    },
    CANCELADA: {
        label: "Cancelada",
        className:
            "bg-red-50 text-red-700 border-red-200 dark:bg-transparent dark:text-red-500 dark:border-border",
    },
}

interface ReviewStatusBadgeProps {
    status: AnyStatus
    className?: string
}

export function ReviewStatusBadge({ status, className }: ReviewStatusBadgeProps) {
    const config = STATUS_MAP[status] ?? {
        label: status,
        className: "bg-muted text-muted-foreground border-border",
    }

    return (
        <Badge variant="outline" className={cn("font-medium", config.className, className)}>
            {config.label}
        </Badge>
    )
}