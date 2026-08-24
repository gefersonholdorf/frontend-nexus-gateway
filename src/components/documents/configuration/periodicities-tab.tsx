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
import type { DocumentPeriodicity } from "@/types/documents/settings";
import { useDocumentPeriodicities } from "@/api/documents/use-document-settings";
import { useDeleteSettingsEntity } from "@/api/documents/use-settings-mutations";

interface PeriodicitiesTabProps {
    canManage: boolean;
}

export function PeriodicitiesTab({ canManage }: PeriodicitiesTabProps) {
    const { data, isLoading, isError } = useDocumentPeriodicities();
    const deleteMutation = useDeleteSettingsEntity("periodicity");

    const [formOpen, setFormOpen] = useState(false);
    const [selected, setSelected] = useState<DocumentPeriodicity | null>(null);

    function handleCreate() {
        setSelected(null);
        setFormOpen(true);
    }

    function handleEdit(entity: DocumentPeriodicity) {
        setSelected(entity);
        setFormOpen(true);
    }

    async function handleDelete(id: number) {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error) {
            console.error("Erro ao excluir periodicidade:", error);
        }
    }

    const columns: Column<DocumentPeriodicity>[] = [
        { key: "name", title: "Nome" },
        {
            key: "months",
            title: "Intervalo",
            render: (_, row) => `${row.months} ${row.months === 1 ? "mês" : "meses"}`,
        },
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
                title="Periodicidades"
                description="Defina os intervalos de revisão aplicados aos documentos (ex.: Anual, Semestral, Trimestral)."
                actionLabel="Nova Periodicidade"
                onAction={handleCreate}
                canManage={canManage}
            >
                <TableComponent
                    data={data ?? []}
                    columns={columns}
                    isLoading={isLoading}
                    isError={isError}
                    emptyMessage="Nenhuma periodicidade cadastrada."
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
                kind="periodicity"
                entity={selected}
                title={selected ? "Editar Periodicidade" : "Nova Periodicidade"}
            />
        </>
    );
}