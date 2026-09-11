import { Badge } from "@/components/ui/badge";
import type { RevisaoStatus } from "../hooks/use-fetch-revisoes";

const STATUS_LABEL: Record<RevisaoStatus, string> = {
    ABERTA: "Aberta",
    EM_APROVACAO: "Em Aprovação",
    APROVADA: "Aprovada",
    REPROVADA: "Reprovada",
};

const STATUS_VARIANT: Record<RevisaoStatus, "default" | "secondary" | "destructive" | "outline"> = {
    ABERTA: "outline",
    EM_APROVACAO: "secondary",
    APROVADA: "default",
    REPROVADA: "destructive",
};

export function RevisaoStatusBadge({ status }: { status: RevisaoStatus }) {
    return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
