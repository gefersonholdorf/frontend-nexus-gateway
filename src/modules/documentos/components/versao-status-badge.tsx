import { Badge } from "@/components/ui/badge";
import type { VersaoStatus } from "../hooks/use-fetch-versoes";

const STATUS_LABEL: Record<VersaoStatus, string> = {
    EM_ELABORACAO: "Em Elaboração",
    APROVADA_AUTOR: "Aprovada pelo Autor",
    REPROVADA: "Reprovada",
};

const STATUS_VARIANT: Record<VersaoStatus, "default" | "secondary" | "destructive" | "outline"> = {
    EM_ELABORACAO: "outline",
    APROVADA_AUTOR: "default",
    REPROVADA: "destructive",
};

export function VersaoStatusBadge({ status }: { status: VersaoStatus }) {
    return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
