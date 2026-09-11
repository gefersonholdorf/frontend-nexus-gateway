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

import { useDeleteDocArea } from "../hooks/use-delete-doc-area";
import type { DocArea } from "../hooks/use-fetch-doc-areas";

interface DeleteAreaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    area: DocArea | null;
}

export function DeleteAreaModal({ open, onOpenChange, area }: DeleteAreaModalProps) {
    const { mutate, isPending } = useDeleteDocArea();

    function handleConfirm() {
        if (!area) {
            return;
        }

        mutate(area.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        Excluir área
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {area ? (
                            <>
                                Tem certeza que deseja excluir <strong>{area.ds_nome}</strong>? Esta
                                ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir esta área? Esta ação não pode ser desfeita."
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
