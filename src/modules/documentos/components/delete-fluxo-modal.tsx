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

import { useDeleteDocFluxo } from "../hooks/use-delete-doc-fluxo";
import type { DocFluxo } from "../hooks/use-fetch-doc-fluxos";

interface DeleteFluxoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fluxo: DocFluxo | null;
}

export function DeleteFluxoModal({ open, onOpenChange, fluxo }: DeleteFluxoModalProps) {
    const { mutate, isPending } = useDeleteDocFluxo();

    function handleConfirm() {
        if (!fluxo) {
            return;
        }

        mutate(fluxo.cd_id, { onSettled: () => onOpenChange(false) });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        Excluir fluxo de aprovação
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {fluxo ? (
                            <>
                                Tem certeza que deseja excluir <strong>{fluxo.ds_nome}</strong>? Esta
                                ação não pode ser desfeita.
                            </>
                        ) : (
                            "Tem certeza que deseja excluir este fluxo? Esta ação não pode ser desfeita."
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
