import { GitBranch, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { HeaderPage } from "@/components/header-page";
import { TableComponentV2, type Column } from "@/components/table-component-v2";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Can } from "@/modules/auth/components/can";

import { CreateFluxoModal } from "../../components/create-fluxo-modal";
import { DeleteFluxoModal } from "../../components/delete-fluxo-modal";
import { EditFluxoModal } from "../../components/edit-fluxo-modal";
import { useFetchDocFluxos, type DocFluxo } from "../../hooks/use-fetch-doc-fluxos";

export function FluxosPage() {
    const { data: fluxos, isLoading, isError, refetch } = useFetchDocFluxos();

    const [createOpen, setCreateOpen] = useState(false);
    const [editFluxo, setEditFluxo] = useState<DocFluxo | null>(null);
    const [deleteFluxo, setDeleteFluxo] = useState<DocFluxo | null>(null);

    const columns: Column<DocFluxo>[] = [
        { key: "ds_nome", title: "Nome" },
        {
            key: "etapas",
            title: "Etapas",
            render: (_, row) => `${row.etapas.length} etapa(s)`,
        },
        {
            key: "fl_ativo",
            title: "Status",
            render: (value) =>
                value ? <Badge>Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
        },
    ];

    return (
        <>
            <HeaderPage
                title="Fluxos de aprovação"
                description="Etapas sequenciais e aprovadores paralelos por etapa (RF015-RF019)."
                icon={GitBranch}
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
                            <BreadcrumbPage>Fluxos de aprovação</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <Can permission="configuracoes.gerenciar" fallback={null}>
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Novo fluxo
                        </Button>
                    </Can>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={fluxos ?? []}
                    columns={columns}
                    registerName="fluxos de aprovação"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    actions={(fluxo) => (
                        <Can permission="configuracoes.gerenciar" fallback={null}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setEditFluxo(fluxo)}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive hover:text-destructive"
                                        onClick={() => setDeleteFluxo(fluxo)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Excluir</TooltipContent>
                            </Tooltip>
                        </Can>
                    )}
                />
            </div>

            <CreateFluxoModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditFluxoModal
                open={Boolean(editFluxo)}
                onOpenChange={(next) => !next && setEditFluxo(null)}
                fluxo={editFluxo}
            />
            <DeleteFluxoModal
                open={Boolean(deleteFluxo)}
                onOpenChange={(next) => !next && setDeleteFluxo(null)}
                fluxo={deleteFluxo}
            />
        </>
    );
}
