import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableComponent, type Column } from "@/components/table-component";

import { SettingsSection } from "./settings-section";
import { SettingsEntityFormModal } from "./settings-entity-form-modal";
import type { DocumentType } from "@/types/documents/settings";
import { useDocumentTypes } from "@/api/documents/use-document-settings";
import { useDeleteSettingsEntity } from "@/api/documents/use-settings-mutations";

interface DocumentTypesTabProps {
    canManage: boolean;
}

export function DocumentTypesTab({ canManage }: DocumentTypesTabProps) {
    const { data, isLoading, isError } = useDocumentTypes();
    const deleteMutation = useDeleteSettingsEntity("type");

    const [formOpen, setFormOpen] = useState(false);
    const [selected, setSelected] = useState<DocumentType | null>(null);

    function handleCreate() {
        setSelected(null);
        setFormOpen(true);
    }

    function handleEdit(entity: DocumentType) {
        setSelected(entity);
        setFormOpen(true);
    }

    async function handleDelete(id: number) {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error) {
            console.error("Erro ao excluir tipo de documento:", error);
        }
    }

    const columns: Column<DocumentType>[] = [
        { key: "name", title: "Nome" },
        {
            key: "description",
            title: "Descrição",
            render: (_, row) => row.description ?? "—",
        },
        {
            key: "active",
            title: "Status",
            render: (_, row) => (
                <Badge variant={row.active ? "default" : "secondary"}>
                    {row.active ? "Ativo" : "Inativo"}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <SettingsSection
                title="Tipos de Documentos"
                description="Defina os tipos utilizados na classificação dos documentos (ex.: Política, Procedimento, Registro)."
                actionLabel="Novo Tipo"
                onAction={handleCreate}
                canManage={canManage}
            >
                <TableComponent
                    data={data ?? []}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    emptyMessage="Nenhum tipo de documento cadastrado."
                    actions={
                        canManage
                            ? (row) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-fit">
                                        <DropdownMenuItem onClick={() => handleEdit(row)}>
                                            <Pencil /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(row.id)}
                                            variant="destructive"
                                        >
                                            <Trash2 /> Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                            : undefined
                    }
                />
            </SettingsSection>

            <SettingsEntityFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                kind="type"
                entity={selected}
                title={selected ? "Editar Tipo de Documento" : "Novo Tipo de Documento"}
            />
        </>
    );
}