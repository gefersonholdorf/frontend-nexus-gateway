import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
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

import { CreateCategoriaModal } from "../../components/create-categoria-modal";
import { DeleteCategoriaModal } from "../../components/delete-categoria-modal";
import { EditCategoriaModal } from "../../components/edit-categoria-modal";
import { useFetchDocCategorias, type DocCategoria } from "../../hooks/use-fetch-doc-categorias";

export function CategoriasPage() {
    const { data: categorias, isLoading, isError, refetch } = useFetchDocCategorias();

    const [createOpen, setCreateOpen] = useState(false);
    const [editCategoria, setEditCategoria] = useState<DocCategoria | null>(null);
    const [deleteCategoria, setDeleteCategoria] = useState<DocCategoria | null>(null);

    const columns: Column<DocCategoria>[] = [
        { key: "ds_nome", title: "Nome" },
        { key: "ds_sigla", title: "Sigla" },
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
                title="Categorias"
                description="Categorias de documento, usadas na composição do código (RN001-RN003)."
                icon={Tags}
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
                            <BreadcrumbPage>Categorias</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <Can permission="configuracoes.gerenciar" fallback={null}>
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Nova categoria
                        </Button>
                    </Can>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={categorias ?? []}
                    columns={columns}
                    registerName="categorias"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    actions={(categoria) => (
                        <Can permission="configuracoes.gerenciar" fallback={null}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setEditCategoria(categoria)}
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
                                        onClick={() => setDeleteCategoria(categoria)}
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

            <CreateCategoriaModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditCategoriaModal
                open={Boolean(editCategoria)}
                onOpenChange={(next) => !next && setEditCategoria(null)}
                categoria={editCategoria}
            />
            <DeleteCategoriaModal
                open={Boolean(deleteCategoria)}
                onOpenChange={(next) => !next && setDeleteCategoria(null)}
                categoria={deleteCategoria}
            />
        </>
    );
}
