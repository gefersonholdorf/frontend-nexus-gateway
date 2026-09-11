import {
    Archive as ArchiveIcon,
    CheckCircle2,
    ClipboardList,
    ExternalLink,
    FileClock,
    FilePlus,
    FileText,
    Gavel,
    Pencil,
    XCircle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useParams, useSearchParams } from "react-router";

import { HeaderPage } from "@/components/header-page";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useMe } from "@/modules/auth/hooks/use-me";
import { Can } from "@/modules/auth/components/can";
import { useHasPermission } from "@/modules/providers/permission-provider";

import { ApproveRevisaoDialog } from "../components/approve-revisao-dialog";
import { ArchiveDocumentoDialog } from "../components/archive-documento-dialog";
import { AprovacaoDecisaoBadge } from "../components/aprovacao-decisao-badge";
import { CreateVersaoModal } from "../components/create-versao-modal";
import { DecideAprovacaoDialog } from "../components/decide-aprovacao-dialog";
import { DocumentoStatusBadge } from "../components/documento-status-badge";
import { EditDocumentoModal } from "../components/edit-documento-modal";
import { RejectRevisaoDialog } from "../components/reject-revisao-dialog";
import { RequestRevisaoDialog } from "../components/request-revisao-dialog";
import { RevisaoStatusBadge } from "../components/revisao-status-badge";
import { VersaoStatusBadge } from "../components/versao-status-badge";
import { useFetchAprovacoes } from "../hooks/use-fetch-aprovacoes";
import { useFetchDocumentoById } from "../hooks/use-fetch-documento-by-id";
import { useFetchRevisoes } from "../hooks/use-fetch-revisoes";
import { useFetchVersoes } from "../hooks/use-fetch-versoes";
import { useMarkVersaoReady } from "../hooks/use-mark-versao-ready";
import type { DocVersao } from "../hooks/use-fetch-versoes";

export function DocumentoDetailPage() {
    const { id } = useParams<{ id: string }>();
    const documentoId = id ? Number(id) : undefined;
    const [searchParams, setSearchParams] = useSearchParams();

    const { data: documento, isLoading } = useFetchDocumentoById(documentoId);
    const { data: me } = useMe();
    const { data: revisoes } = useFetchRevisoes(documentoId);
    const { data: todasVersoes } = useFetchVersoes(documentoId);

    const revisaoAberta = documento?.revisaoAberta ?? null;
    const { data: versoesRevisao } = useFetchVersoes(documentoId, revisaoAberta?.cd_id);
    const { data: aprovacoes } = useFetchAprovacoes(
        documentoId,
        revisaoAberta?.cd_id,
        revisaoAberta?.ds_rodada_atual,
    );

    const { mutate: markReady, isPending: isMarkingReady } = useMarkVersaoReady(documentoId ?? 0);

    const canPublicar = useHasPermission("documento.publicar");
    const canAprovarRevisao = useHasPermission("revisao.aprovar");
    const canAvaliarAprovacao = useHasPermission("aprovacao.avaliar");

    // Lazy init (não efeito) para abrir o modal de edição quando a listagem
    // navega com `?editar=1` — evita setState síncrono dentro de um effect.
    const [editOpen, setEditOpen] = useState(() => searchParams.get("editar") === "1");
    const [archiveOpen, setArchiveOpen] = useState(false);
    const [requestRevisaoOpen, setRequestRevisaoOpen] = useState(false);
    const [createVersaoOpen, setCreateVersaoOpen] = useState(false);
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [decideAprovacaoId, setDecideAprovacaoId] = useState<number | null>(null);

    useEffect(() => {
        if (searchParams.get("editar") === "1") {
            searchParams.delete("editar");
            setSearchParams(searchParams, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 px-16 py-10 text-sm text-muted-foreground">
                Carregando documento...
            </div>
        );
    }

    if (!documento || !documentoId) {
        return (
            <div className="flex-1 px-16 py-10">
                <Card className="p-6 text-sm text-muted-foreground">Documento não encontrado.</Card>
            </div>
        );
    }

    const isRevisor = Boolean(me?.user && revisaoAberta && me.user.cd_id === revisaoAberta.cd_revisor);
    const podeDecidirRevisao =
        canAprovarRevisao && canPublicar && isRevisor && revisaoAberta?.st_status === "ABERTA";
    const ultimaVersaoAnterior = versoesRevisao && versoesRevisao.length > 0 ? versoesRevisao[versoesRevisao.length - 1] : undefined;

    return (
        <>
            <HeaderPage
                title={documento.ds_titulo}
                description={`Código ${documento.ds_codigo}`}
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
                            <BreadcrumbPage>{documento.ds_codigo}</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <div className="flex items-center gap-2">
                        <Can permission="documento.editar" fallback={null}>
                            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                                <Pencil className="size-4" />
                                Editar
                            </Button>
                        </Can>

                        <Can permission="revisao.solicitar" fallback={null}>
                            {!revisaoAberta && documento.st_status !== "ARQUIVADO" && (
                                <Button variant="outline" size="sm" onClick={() => setRequestRevisaoOpen(true)}>
                                    <FileClock className="size-4" />
                                    Solicitar revisão
                                </Button>
                            )}
                        </Can>

                        <Can permission="documento.arquivar" fallback={null}>
                            {documento.st_status !== "ARQUIVADO" && (
                                <Button variant="outline" size="sm" onClick={() => setArchiveOpen(true)}>
                                    <ArchiveIcon className="size-4" />
                                    Arquivar
                                </Button>
                            )}
                        </Can>
                    </div>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                {/* Dados mestres */}
                <Card className="p-5">
                    <CardHeader className="p-0 pb-3">
                        <CardTitle className="flex items-center justify-between text-base">
                            Dados do documento
                            <DocumentoStatusBadge status={documento.st_status} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 p-0 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Código">{documento.ds_codigo}</Field>
                        <Field label="Categoria">{documento.categoria?.ds_nome ?? "-"}</Field>
                        <Field label="Área">{documento.area?.ds_nome ?? "-"}</Field>
                        <Field label="Responsável">{documento.responsavel?.ds_name ?? "-"}</Field>
                        <Field label="Versão vigente">
                            {documento.ds_versao_major}.{documento.ds_versao_minor}
                        </Field>
                        <Field label="Roles associadas">
                            {documento.roles.map((role) => role.ds_name).join(", ") || "-"}
                        </Field>
                        <Field label="URL da versão vigente">
                            {documento.ds_url_versao_vigente ? (
                                <a
                                    href={documento.ds_url_versao_vigente}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                    Abrir <ExternalLink className="size-3.5" />
                                </a>
                            ) : (
                                "-"
                            )}
                        </Field>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <Field label="Descrição">{documento.ds_descricao}</Field>
                        </div>
                    </CardContent>
                </Card>

                {/* Revisão aberta */}
                {revisaoAberta && (
                    <Card className="p-5">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                                <span className="flex items-center gap-2">
                                    <FileClock className="size-4 text-primary" aria-hidden="true" />
                                    Revisão aberta
                                </span>
                                <RevisaoStatusBadge status={revisaoAberta.st_status} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-0 text-sm">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Field label="Origem">
                                    {revisaoAberta.st_origem === "MANUAL" ? "Manual" : "Automática"}
                                </Field>
                                <Field label="Rodada atual">{revisaoAberta.ds_rodada_atual}</Field>
                                <Field label="Aberta em">
                                    {new Date(revisaoAberta.dt_aberta_em).toLocaleString("pt-BR")}
                                </Field>
                            </div>

                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground">Versões desta revisão</h3>
                                <Can permission="versao.criar" fallback={null}>
                                    <Button size="sm" variant="outline" onClick={() => setCreateVersaoOpen(true)}>
                                        <FilePlus className="size-4" />
                                        Nova versão
                                    </Button>
                                </Can>
                            </div>

                            <div className="divide-y divide-border/60 rounded-md border border-border/60">
                                {(versoesRevisao ?? []).length === 0 && (
                                    <p className="p-3 text-sm text-muted-foreground">
                                        Nenhuma versão criada ainda.
                                    </p>
                                )}
                                {(versoesRevisao ?? []).map((versao) => (
                                    <VersaoRow
                                        key={versao.cd_id}
                                        versao={versao}
                                        onMarkReady={() => markReady(versao.cd_id)}
                                        isMarkingReady={isMarkingReady}
                                        meCdId={me?.user.cd_id}
                                    />
                                ))}
                            </div>

                            {podeDecidirRevisao && (
                                <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                                    <Button size="sm" onClick={() => setApproveOpen(true)}>
                                        <CheckCircle2 className="size-4" />
                                        Aprovar revisão
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)}>
                                        <XCircle className="size-4" />
                                        Negar revisão
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Fluxo / Aprovações */}
                {revisaoAberta && revisaoAberta.st_status === "EM_APROVACAO" && (
                    <Card className="p-5">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Gavel className="size-4 text-primary" aria-hidden="true" />
                                Fluxo de aprovação — rodada {revisaoAberta.ds_rodada_atual}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/60 rounded-md border border-border/60">
                                {(aprovacoes ?? []).length === 0 && (
                                    <p className="p-3 text-sm text-muted-foreground">
                                        Nenhuma aprovação registrada para esta rodada.
                                    </p>
                                )}
                                {(aprovacoes ?? []).map((aprovacao) => {
                                    const isAprovador = me?.user && me.user.cd_id === aprovacao.cd_aprovador;
                                    const podeDecidir =
                                        canAvaliarAprovacao &&
                                        canPublicar &&
                                        isAprovador &&
                                        aprovacao.st_decisao === "PENDENTE";

                                    return (
                                        <div
                                            key={aprovacao.cd_id}
                                            className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-foreground">
                                                    {aprovacao.ds_aprovador_nome}
                                                </span>
                                                <AprovacaoDecisaoBadge decisao={aprovacao.st_decisao} />
                                                {aprovacao.fl_automatica && (
                                                    <span className="text-xs text-muted-foreground">
                                                        (aprovação automática do responsável)
                                                    </span>
                                                )}
                                            </div>

                                            {podeDecidir && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setDecideAprovacaoId(aprovacao.cd_id)}
                                                >
                                                    <Gavel className="size-4" />
                                                    Decidir
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Histórico de revisões */}
                <Card className="p-5">
                    <CardHeader className="p-0 pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ClipboardList className="size-4 text-primary" aria-hidden="true" />
                            Histórico de revisões
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/60 rounded-md border border-border/60">
                            {(revisoes ?? []).length === 0 && (
                                <p className="p-3 text-sm text-muted-foreground">Nenhuma revisão registrada.</p>
                            )}
                            {(revisoes ?? []).map((revisao) => (
                                <div
                                    key={revisao.cd_id}
                                    className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
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
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Histórico de versões */}
                <Card className="p-5">
                    <CardHeader className="p-0 pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="size-4 text-primary" aria-hidden="true" />
                            Histórico de versões
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/60 rounded-md border border-border/60">
                            {(todasVersoes ?? []).length === 0 && (
                                <p className="p-3 text-sm text-muted-foreground">Nenhuma versão registrada.</p>
                            )}
                            {(todasVersoes ?? []).map((versao) => (
                                <div
                                    key={versao.cd_id}
                                    className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-foreground">
                                            {versao.ds_versao_major}.{versao.ds_versao_minor}
                                        </span>
                                        <VersaoStatusBadge status={versao.st_status} />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{versao.ds_descritivo}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditDocumentoModal open={editOpen} onOpenChange={setEditOpen} documento={documento} />

            <ArchiveDocumentoDialog
                open={archiveOpen}
                onOpenChange={setArchiveOpen}
                documento={documento}
            />

            <RequestRevisaoDialog
                open={requestRevisaoOpen}
                onOpenChange={setRequestRevisaoOpen}
                documentoId={documentoId}
            />

            <CreateVersaoModal
                open={createVersaoOpen}
                onOpenChange={setCreateVersaoOpen}
                documentoId={documentoId}
                urlEdicaoAnterior={ultimaVersaoAnterior?.ds_url_edicao}
            />

            {revisaoAberta && (
                <>
                    <ApproveRevisaoDialog
                        open={approveOpen}
                        onOpenChange={setApproveOpen}
                        documentoId={documentoId}
                        revisaoId={revisaoAberta.cd_id}
                        requiresUrlPublicacao={!documento.cd_fluxo_aprovacao}
                    />
                    <RejectRevisaoDialog
                        open={rejectOpen}
                        onOpenChange={setRejectOpen}
                        documentoId={documentoId}
                        revisaoId={revisaoAberta.cd_id}
                    />
                    <DecideAprovacaoDialog
                        open={decideAprovacaoId !== null}
                        onOpenChange={(next) => !next && setDecideAprovacaoId(null)}
                        documentoId={documentoId}
                        revisaoId={revisaoAberta.cd_id}
                        aprovacaoId={decideAprovacaoId ?? 0}
                    />
                </>
            )}
        </>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-foreground">{children}</p>
        </div>
    );
}

function VersaoRow({
    versao,
    onMarkReady,
    isMarkingReady,
    meCdId,
}: {
    versao: DocVersao;
    onMarkReady: () => void;
    isMarkingReady: boolean;
    /** RN013: só o responsável (autor) da versão pode marcá-la como pronta. */
    meCdId?: number;
}) {
    const isAutor = meCdId !== undefined && meCdId === versao.cd_responsavel;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">
                    {versao.ds_versao_major}.{versao.ds_versao_minor}
                </span>
                <VersaoStatusBadge status={versao.st_status} />
                <span className="text-muted-foreground">{versao.ds_descritivo}</span>
            </div>

            <Can permission="versao.criar" fallback={null}>
                {versao.st_status === "EM_ELABORACAO" && isAutor && (
                    <Button size="sm" variant="outline" disabled={isMarkingReady} onClick={onMarkReady}>
                        Marcar pronta
                    </Button>
                )}
            </Can>
        </div>
    );
}
