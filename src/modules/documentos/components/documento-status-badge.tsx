import { Badge } from "@/components/ui/badge";
import type { DocumentoStatus } from "../hooks/use-fetch-documentos";

const STATUS_LABEL: Record<DocumentoStatus, string> = {
    RASCUNHO: "Rascunho",
    EM_REVISAO: "Em Revisão",
    EM_APROVACAO: "Em Aprovação",
    APROVADO: "Aprovado",
    PUBLICADO: "Publicado",
    REPROVADO: "Reprovado",
    ARQUIVADO: "Arquivado",
};

const STATUS_VARIANT: Record<DocumentoStatus, "default" | "secondary" | "destructive" | "outline"> = {
    RASCUNHO: "outline",
    EM_REVISAO: "secondary",
    EM_APROVACAO: "secondary",
    APROVADO: "default",
    PUBLICADO: "default",
    REPROVADO: "destructive",
    ARQUIVADO: "outline",
};

/** Ciclo de status do documento (`Rascunho → ... → Publicado`, mais `Reprovado`/`Arquivado`). */
export function DocumentoStatusBadge({ status }: { status: DocumentoStatus }) {
    return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
