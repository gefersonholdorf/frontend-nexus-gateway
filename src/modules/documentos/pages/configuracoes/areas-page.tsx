import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
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

import { CreateAreaModal } from "../../components/create-area-modal";
import { DeleteAreaModal } from "../../components/delete-area-modal";
import { EditAreaModal } from "../../components/edit-area-modal";
import { useFetchDocAreas, type DocArea } from "../../hooks/use-fetch-doc-areas";

export function AreasPage() {
    const { data: areas, isLoading, isError, refetch } = useFetchDocAreas();

    const [createOpen, setCreateOpen] = useState(false);
    const [editArea, setEditArea] = useState<DocArea | null>(null);
    const [deleteArea, setDeleteArea] = useState<DocArea | null>(null);

    const columns: Column<DocArea>[] = [
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
                title="Áreas"
                description="Áreas de documento, usadas na composição do código (RN001-RN003)."
                icon={Building2}
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
                            <BreadcrumbPage>Áreas</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
                actions={
                    <Can permission="configuracoes.gerenciar" fallback={null}>
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Nova área
                        </Button>
                    </Can>
                }
            />

            <div className="flex-1 space-y-6 px-16 pb-8">
                <TableComponentV2
                    data={areas ?? []}
                    columns={columns}
                    registerName="áreas"
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={refetch}
                    getRowKey={(row) => row.cd_id}
                    actions={(area) => (
                        <Can permission="configuracoes.gerenciar" fallback={null}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => setEditArea(area)}
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
                                        onClick={() => setDeleteArea(area)}
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

            <CreateAreaModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditAreaModal
                open={Boolean(editArea)}
                onOpenChange={(next) => !next && setEditArea(null)}
                area={editArea}
            />
            <DeleteAreaModal
                open={Boolean(deleteArea)}
                onOpenChange={(next) => !next && setDeleteArea(null)}
                area={deleteArea}
            />
        </>
    );
}
