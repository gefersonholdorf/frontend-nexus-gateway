import { Badge } from "@/components/ui/badge";
import type { AprovacaoDecisao } from "../hooks/use-fetch-aprovacoes";

const DECISAO_LABEL: Record<AprovacaoDecisao, string> = {
    PENDENTE: "Pendente",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    AJUSTE_SOLICITADO: "Ajuste Solicitado",
    CANCELADO: "Cancelado",
};

const DECISAO_VARIANT: Record<AprovacaoDecisao, "default" | "secondary" | "destructive" | "outline"> = {
    PENDENTE: "outline",
    APROVADO: "default",
    REPROVADO: "destructive",
    AJUSTE_SOLICITADO: "secondary",
    CANCELADO: "outline",
};

export function AprovacaoDecisaoBadge({ decisao }: { decisao: AprovacaoDecisao }) {
    return <Badge variant={DECISAO_VARIANT[decisao]}>{DECISAO_LABEL[decisao]}</Badge>;
}
