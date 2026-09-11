import { FileText } from "lucide-react";
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

import { VersaoStatusBadge } from "../components/versao-status-badge";
import { useFetchDocumentos } from "../hooks/use-fetch-documentos";
import { useFetchVersoes } from "../hooks/use-fetch-versoes";

/**
 * Assim como em `revisoes-page.tsx`, não há endpoint global de versões no
 * contrato fixo — seletor de documento + `GET /documentos/:id/versoes`.
 */
export function VersoesPage() {
    const navigate = useNavigate();
    const [documentoId, setDocumentoId] = useState<string>("");

    const { data: documentos } = useFetchDocumentos({ page: 1, pageSize: 100 });
    const { data: versoes, isLoading } = useFetchVersoes(documentoId ? Number(documentoId) : undefined);

    return (
        <>
            <HeaderPage
                title="Versões"
                description="Consulte as versões de um documento específico."
                icon={FileText}
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
                            <BreadcrumbPage>Versões</BreadcrumbPage>
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
                        Selecione um documento para ver suas versões.
                    </Card>
                )}

                {documentoId && (
                    <Card className="divide-y divide-border/60 p-0">
                        {isLoading && <p className="p-4 text-sm text-muted-foreground">Carregando...</p>}
                        {!isLoading && (versoes ?? []).length === 0 && (
                            <p className="p-4 text-sm text-muted-foreground">
                                Nenhuma versão registrada para este documento.
                            </p>
                        )}
                        {(versoes ?? []).map((versao) => (
                            <button
                                key={versao.cd_id}
                                type="button"
                                onClick={() => navigate(`/gestao-documentos/${documentoId}`)}
                                className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left text-sm transition-colors hover:bg-muted/35"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-foreground">
                                        {versao.ds_versao_major}.{versao.ds_versao_minor}
                                    </span>
                                    <VersaoStatusBadge status={versao.st_status} />
                                </div>
                                <span className="text-xs text-muted-foreground">{versao.ds_descritivo}</span>
                            </button>
                        ))}
                    </Card>
                )}
            </div>
        </>
    );
}
