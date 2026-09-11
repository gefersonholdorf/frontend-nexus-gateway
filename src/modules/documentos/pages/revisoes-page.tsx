import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { RevisaoStatusBadge } from "../components/revisao-status-badge";
import { useFetchDocumentos } from "../hooks/use-fetch-documentos";
import { useFetchRevisoes } from "../hooks/use-fetch-revisoes";

/**
 * O contrato fixo só expõe revisões aninhadas por documento
 * (`GET /documentos/:id/revisoes`) — não há um endpoint global de listagem.
 * Esta tela resolve isso com um seletor de documento + lista das revisões
 * do documento escolhido.
 */
export function RevisoesPage() {
    const navigate = useNavigate();
    const [documentoId, setDocumentoId] = useState<string>("");

    const { data: documentos } = useFetchDocumentos({ page: 1, pageSize: 100 });
    const { data: revisoes, isLoading } = useFetchRevisoes(documentoId ? Number(documentoId) : undefined);

    return (
        <>
            <HeaderPage
                title="Revisões"
                description="Consulte as revisões de um documento específico."
                icon={ClipboardList}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/welcome">Página Inicial</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/gestao-documentos">Documentos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Revisões</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex-1 space-y-4 px-16 pb-8">
                <Select value={documentoId} onValueChange={setDocumentoId}>
                    <SelectTrigger className="w-full sm:w-96">
                        <SelectValue placeholder="Selecione um documento" />
                    </SelectTrigger>
                    <SelectContent>
                        {(documentos?.items ?? []).map((documento) => (
                            <SelectItem key={documento.cd_id} value={String(documento.cd_id)}>
                                {documento.ds_codigo} — {documento.ds_titulo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {!documentoId && (
                    <Card className="p-6 text-sm text-muted-foreground">
                        Selecione um documento para ver suas revisões.
                    </Card>
                )}

                {documentoId && (
                    <Card className="divide-y divide-border/60 p-0">
                        {isLoading && <p className="p-4 text-sm text-muted-foreground">Carregando...</p>}
                        {!isLoading && (revisoes ?? []).length === 0 && (
                            <p className="p-4 text-sm text-muted-foreground">
                                Nenhuma revisão registrada para este documento.
                            </p>
                        )}
                        {(revisoes ?? []).map((revisao) => (
                            <button
                                key={revisao.cd_id}
                                type="button"
                                onClick={() => navigate(`/gestao-documentos/${documentoId}`)}
                                className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left text-sm transition-colors hover:bg-muted/35"
                            >
                                <div className="flex items-center gap-3">
                                    <RevisaoStatusBadge status={revisao.st_status} />
                                    <span className="text-muted-foreground">
                                        {revisao.st_origem === "MANUAL" ? "Manual" : "Automática"} · Rodada{" "}
                                        {revisao.ds_rodada_atual}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Aberta em {new Date(revisao.dt_aberta_em).toLocaleDateString("pt-BR")}
                                </span>
                            </button>
                        ))}
                    </Card>
                )}
            </div>
        </>
    );
}
