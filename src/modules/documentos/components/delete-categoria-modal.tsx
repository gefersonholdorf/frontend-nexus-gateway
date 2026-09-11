import { Trash2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteDocCategoria } from "../hooks/use-delete-doc-categoria";
import type { DocCategoria } from "../hooks/use-fetch-doc-categorias";

interface DeleteCategoriaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoria: DocCategoria | null;
}

export function DeleteCategoriaModal({ open, onOpenChange, categoria }: DeleteCategoriaModalProps) {
    const { mutate, isPending } = useDeleteDocCategoria();

    function handleConfirm() {
        if (!categoria) {
            return;
        }

        mutate(categoria.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        Excluir categoria
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {categoria ? (
                            <>
                                Tem certeza que deseja excluir <strong>{categoria.ds_nome}</strong>?
                                Esta ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleConfirm}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isPending ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
