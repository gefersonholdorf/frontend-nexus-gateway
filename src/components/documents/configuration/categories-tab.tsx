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
import type { DocumentCategory } from "@/types/documents/settings";
import { useDocumentCategories } from "@/api/documents/use-document-settings";
import { useDeleteSettingsEntity } from "@/api/documents/use-settings-mutations";

interface CategoriesTabProps {
    canManage: boolean;
}

export function CategoriesTab({ canManage }: CategoriesTabProps) {
    const { data, isLoading, isError } = useDocumentCategories();
    const deleteMutation = useDeleteSettingsEntity("category");

    const [formOpen, setFormOpen] = useState(false);
    const [selected, setSelected] = useState<DocumentCategory | null>(null);

    function handleCreate() {
        setSelected(null);
        setFormOpen(true);
    }

    function handleEdit(entity: DocumentCategory) {
        setSelected(entity);
        setFormOpen(true);
    }

    async function handleDelete(id: number) {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
        }
    }

    const columns: Column<DocumentCategory>[] = [
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
                title="Categorias"
                description="Organize os documentos por áreas ou domínios de negócio (ex.: SGSI, Recursos Humanos, Financeiro)."
                actionLabel="Nova Categoria"
                onAction={handleCreate}
                canManage={canManage}
            >
                <TableComponent
                    data={data ?? []}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    emptyMessage="Nenhuma categoria cadastrada."
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
                kind="category"
                entity={selected}
                title={selected ? "Editar Categoria" : "Nova Categoria"}
            />
        </>
    );
}